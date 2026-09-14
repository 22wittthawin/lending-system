const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  itemId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemName: { type: String, required: true }, // เก็บชื่อซ้ำไว้ตรงนี้ด้วย กันกรณีลบ item ต้นทางภายหลัง

  // ข้อมูลผู้ยืม
  firstname: { type: String, required: true, trim: true },
  lastname:  { type: String, required: true, trim: true },
  age:       { type: Number, required: true, min: 1 },
  address:   { type: String, required: true, trim: true },
  photoUrl:  { type: String, required: true }, // path ไฟล์รูปบัตรประชาชนที่เก็บไว้บนเซิร์ฟเวอร์

  qty:        { type: Number, required: true, min: 1 },
  borrowDate: { type: Date, required: true },
  dueDate:    { type: Date, required: true }, // = borrowDate + 7 วัน (คำนวณตอนสร้าง record)

  returned:     { type: Boolean, default: false },
  returnedDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
