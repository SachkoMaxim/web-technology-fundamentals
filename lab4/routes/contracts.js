const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');

router.get('/', async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.json(contracts);
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred during data receiving.'
        });
    }
});

router.post('/', async (req, res) => {
    const { companyName, type, validFrom, validTo } = req.body;
    try {
        const newContract = new Contract({
            companyName, type, validFrom, validTo
        });
        await newContract.save();
        res.status(201).json(newContract);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(401).json({
                error: error.message
            }); 
        } else {
            res.status(500).json({
                error: 'An error occurred during record creation.'
            });
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                error: 'Record not found.'
            });
        }

        res.json(contract);
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred during data receiving.'
        });
    }
});

router.put('/:id', async (req, res) => {
    const { companyName, type, validFrom, validTo } = req.body;
    try {
        const updatedContract = await Contract.findByIdAndUpdate(
            req.params.id,
            { companyName, type, validFrom, validTo },
            { new: true }
        );

        if (!updatedContract) {
            return res.status(404).json({
                error: 'Record not found.'
            });
        }

        res.json(updatedContract);
    } catch (error) {
        res.status(500).json({
            error: 'Record update failed.'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedContract = await Contract.findByIdAndDelete(req.params.id);

        if (!deletedContract) {
            return res.status(404).json({
                error: 'Record not found.'
            });
        }

        res.json({ message: 'Record deleted successfully.' });
    } catch (error) {
        res.status(500).json({
            error: 'Record deletion failed.'
        });
    }
});

module.exports = router;
