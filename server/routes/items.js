const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items  -> รายการอุปกรณ์ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'โหลดรายการอุปกรณ์ไม่สำเร็จ', detail: err.message });
  }
});

module.exports = router;
