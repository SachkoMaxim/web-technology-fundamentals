const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');

router.get('/', async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.render('contracts', { contracts });
    } catch (error) {
        res.status(500).send('Error retrieving contracts');
    }
});

router.get('/add', async (req, res) => {
    res.render('add-contract');
});

router.post('/', async (req, res) => {
    const { companyName, type, validFrom, validTo } = req.body;
    try {
        const newContract = new Contract({
            companyName, type, validFrom, validTo
        });
        await newContract.save();
        res.redirect('/contracts');
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(401).send(error.message); 
        } else {
            res.status(500).send('Error creating contract');
        }
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) return res.status(404).send('Contract not found.');

        res.render('edit-contract', { contract });
    } catch (error) {
        res.status(500).send('Error retrieving contract');
    }
});

router.post('/upgrade/:id', async (req, res) => {
    const { companyName, type, validFrom, validTo } = req.body;
    try {
        await Contract.findByIdAndUpdate(
            req.params.id,
            { companyName, type, validFrom, validTo }
        );
        res.redirect('/contracts');
    } catch (error) {
        res.status(500).send('Error updating contract');
    }
});

router.get('/confirm-delete/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) return res.status(404).send('Contract not found.');

        res.render('confirm-delete-contract', { contract });
    } catch (error) {
        res.status(500).send('Error retrieving contract');
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await Contract.findByIdAndDelete(req.params.id);
        res.redirect('/contracts');
    } catch (error) {
        res.status(500).send('Error deleting contract');
    }
});

module.exports = router;
