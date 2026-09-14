const express = require('express');
const router = express.Router();
const path = require('path');
const Item = require('../models/Item');
const BorrowRecord = require('../models/BorrowRecord');
const upload = require('../middleware/upload');

// GET /api/records -> รายการยืม-คืนทั้งหมด (ใหม่สุดก่อน)
router.get('/', async (req, res) => {
  try {
    const records = await BorrowRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'โหลดรายการยืม-คืนไม่สำเร็จ', detail: err.message });
  }
});

// POST /api/records -> สร้างรายการยืมใหม่ (multipart/form-data พร้อมไฟล์รูปบัตรประชาชน)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { itemId, firstname, lastname, age, address, qty, borrowDate } = req.body;

    if (!itemId || !firstname || !lastname || !age || !address || !qty || !borrowDate) {
      return res.status(400).json({ error: 'กรอกข้อมูลไม่ครบ' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'กรุณาแนบรูปถ่ายบัตรประชาชน' });
    }

    const qtyNum = parseInt(qty, 10);
    if (!Number.isInteger(qtyNum) || qtyNum < 1) {
      return res.status(400).json({ error: 'จำนวนที่ยืมไม่ถูกต้อง' });
    }

    // หักจำนวนอุปกรณ์แบบ atomic — กันกรณีมีคนยืมของชิ้นสุดท้ายพร้อมกันสองคน (race condition)
    const item = await Item.findOneAndUpdate(
      { _id: itemId, available: { $gte: qtyNum } },
      { $inc: { available: -qtyNum } },
      { new: true }
    );

    if (!item) {
      return res.status(409).json({ error: 'ของไม่พอให้ยืมแล้ว (อาจมีคนยืมไปพร้อมกัน) กรุณารีเฟรชแล้วลองใหม่' });
    }

    const due = new Date(borrowDate);
    due.setDate(due.getDate() + 7);

    const record = await BorrowRecord.create({
      itemId: item._id,
      itemName: item.name,
      firstname,
      lastname,
      age: parseInt(age, 10),
      address,
      photoUrl: `/uploads/${req.file.filename}`,
      qty: qtyNum,
      borrowDate: new Date(borrowDate),
      dueDate: due
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: 'บันทึกการยืมไม่สำเร็จ', detail: err.message });
  }
});

// POST /api/records/:id/return -> คืนของ
router.post('/:id/return', async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'ไม่พบรายการนี้' });
    if (record.returned) return res.status(400).json({ error: 'รายการนี้คืนไปแล้ว' });

    record.returned = true;
    record.returnedDate = new Date();
    await record.save();

    const item = await Item.findById(record.itemId);
    if (item) {
      item.available = Math.min(item.total, item.available + record.qty);
      await item.save();
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'บันทึกการคืนไม่สำเร็จ', detail: err.message });
  }
});

module.exports = router;
