const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['sports', 'tools', 'rec', 'other'] // กีฬา / เครื่องมือช่าง / นันทนาการ / อื่นๆ
  },
  total: { type: Number, required: true, min: 0 },     // จำนวนทั้งหมดที่มี
  available: { type: Number, required: true, min: 0 }  // จำนวนที่พร้อมให้ยืมตอนนี้
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
