const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

// 1. GET ALL ITEMS (with Search & Filters)
router.get('/', async (req, res) => {
  try {
    const { search, type, category, location } = req.query;

    const query = {};

    // Filter by type (LOST or FOUND)
    if (type && type !== 'ALL') {
      query.type = type.toUpperCase();
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.location = location;
    }

    // Simple MongoDB Search across title, description, category, location
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { location: regex }
      ];
    }

    const items = await Item.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items: ' + err.message
    });
  }
});

// 2. GET SINGLE ITEM BY ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      item
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item: ' + err.message
    });
  }
});

// 3. CREATE ITEM (Requires Auth)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, category, location, date } = req.body;

    if (!title || !description || !type || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, type, category, location).'
      });
    }

    const newItem = await Item.create({
      title,
      description,
      type,
      category,
      location,
      date: date || Date.now(),
      status: 'ACTIVE',
      postedBy: req.user.id
    });

    const populatedItem = await newItem.populate('postedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Item posted successfully!',
      item: populatedItem
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating item: ' + err.message
    });
  }
});

// 4. UPDATE ITEM (Requires Auth & Ownership)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Authorization check: only owner can edit
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own posts.'
      });
    }

    const { title, description, type, category, location, date } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (type) item.type = type;
    if (category) item.category = category;
    if (location) item.location = location;
    if (date) item.date = date;

    const updatedItem = await item.save();
    const populated = await updatedItem.populate('postedBy', 'name email');

    res.json({
      success: true,
      message: 'Post updated successfully!',
      item: populated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating item: ' + err.message
    });
  }
});

// 5. DELETE ITEM (Requires Auth & Ownership)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Authorization check: only owner can delete
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own posts.'
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item: ' + err.message
    });
  }
});

// 6. RESOLVE ITEM (Requires Auth & Ownership)
router.put('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Authorization check: only owner can resolve
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only mark your own posts as resolved.'
      });
    }

    item.status = 'RESOLVED';
    await item.save();

    res.json({
      success: true,
      message: 'Item marked as RESOLVED.',
      item
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error resolving item: ' + err.message
    });
  }
});

module.exports = router;
