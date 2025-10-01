const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRepo = require('../data/repo');
const hashPassword = require('../util/hashPassword');
const authorize = require('../middleware/auth');

const MSG_USER_NOT_FOUND = 'Error: User not found.';
const MSG_USERNAME_REQUIRED = 'Error: The "username" parameter is required.';
const MSG_PASSWORD_REQUIRED = 'Error: The "password" parameter is required.';
const MSG_ROLES_REQUIRED = 'Error: The "roles" parameter is required.';
const MSG_PASSWORD_INVALID = 'Error: Password is not valid.';

const ROLE_USER = 'USER';
const ROLE_ADMIN = 'ADMIN';

router.get('/all', async (req, res) => {
    try {
        const users = await usersRepo.getUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.put('/:id/update', authorize(), async (req, res) => {
    try {
        const user = await usersRepo.getUserById(req.params.id);
        if (!user) return res.status(404).send(MSG_USER_NOT_FOUND);

        if (!req.body.username) return res.status(400).send(MSG_USERNAME_REQUIRED);

        if (!req.body.password) return res.status(400).send(MSG_PASSWORD_REQUIRED);

        if (!req.body.roles) return res.status(400).send(MSG_ROLES_REQUIRED);

        user.username = req.body.username;
        user.password = hashPassword(req.body.password);
        user.roles = req.body.roles;

        const result = await usersRepo.updateUser(user);
        return res.json(result);
    } catch (err) {
        console.error(err);

        if (err.message === usersRepo.MSG_USERNAME_OCCUPIED) {
            res.status(400).send(err.message);
        }
        res.status(500).json(err);
    }
});

router.post('/register', async (req, res) => {
    try {
        if (!req.body.username) return res.status(400).send(MSG_USERNAME_REQUIRED);

        if (!req.body.password) return res.status(400).send(MSG_PASSWORD_REQUIRED);

        const user = {
            id: undefined,
            username: req.body.username,
            password: hashPassword(req.body.password),
            roles: [ROLE_USER]
        };

        const result = await usersRepo.addUser(user);
        res.json(result);
    } catch (err) {
        console.error(err);

        if (err.message === usersRepo.MSG_USERNAME_OCCUPIED) {
            res.status(400).send(err.message);
        }
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        if (!req.body.username) return res.status(400).send(MSG_USERNAME_REQUIRED);

        if (!req.body.password) return res.status(400).send(MSG_PASSWORD_REQUIRED);

        const user = await usersRepo.getUserByUsername(req.body.username);
        if (!user) return res.status(404).send(MSG_USER_NOT_FOUND);

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) return res.status(400).send(MSG_PASSWORD_INVALID);

        const token = jwt.sign(
            { id: user.id, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ auth_token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/me', authorize(), async (req, res) => {
    try {
        const userIdentity = req.user; // from auth.js
        const user = await usersRepo.getUserById(userIdentity.id);
        if (!user) {
            res.status(404).send(MSG_USER_NOT_FOUND);
        }
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/admin', authorize(roles = [ROLE_ADMIN]), async (req, res) => {
    res.send('Welcome, Admin!');
});

module.exports = router;
