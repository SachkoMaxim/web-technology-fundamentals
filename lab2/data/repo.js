const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, 'users.json');

const MSG_USERNAME_OCCUPIED = 'Error: Username already belongs to another user!';

const getUsers = async () => {
    const data = await fs.promises.readFile(filePath);
    return JSON.parse(data.toString());
};

const getUserById = async (id) => {
    const users = await getUsers();
    return users.find((user) => user.id === id);
};

const getUserByUsername = async (username) => {
    const users = await getUsers();
    return users.find((user) => user.username === username);
};

const saveUsers = async (users) => {
    await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
};

const updateUser = async (user) => {
    const users = await getUsers();
    if (users.find((u) => u.id !== user.id && u.username === user.username)) {
        throw new Error(MSG_USERNAME_OCCUPIED)
    }

    const updatedUsers = users.map(userToReplace => {
        if (userToReplace.id === user.id) {
            return user;
        } else {
            return userToReplace;
        }
    });

    await saveUsers(updatedUsers);
    return await getUserById(user.id);
};

const addUser = async (user) => {
    user.id = uuidv4();
    const users = await getUsers();
    if (users.find((u) => u.username === user.username)) {
        throw new Error(MSG_USERNAME_OCCUPIED)
    }

    users.push(user);
    await saveUsers(users);
    return await getUserById(user.id);
};

module.exports = { MSG_USERNAME_OCCUPIED, getUsers, getUserById, getUserByUsername, saveUsers, updateUser, addUser };
