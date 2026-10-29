const Item = require('../models/Item');
const { Op } = require('sequelize');

const getItems = async (req, res) => {
    try {
        const { search } = req.query;
        let queryOptions = {};

        if (search) {
            queryOptions.where = {
                name: {
                    [Op.like]: `%${search}%`
                }
            };
        }

        const items = await Item.findAll(queryOptions);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching items', details: error.message });
    }
};

const createItem = async (req, res) => {
    try {
        const { name, category, quantity, status } = req.body;
        const newItem = await Item.create({ name, category, quantity, status });
        res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (error) {
        res.status(500).json({ error: 'Error creating item', details: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, quantity, status } = req.body;

        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await item.update({ name, category, quantity, status });
        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(500).json({ error: 'Error updating item', details: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await item.destroy();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting item', details: error.message });
    }
};

module.exports = {
    getItems,
    createItem,
    updateItem,
    deleteItem
};