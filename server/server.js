require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const itemsRouter = require('./routes/items');
const recordsRouter = require('./routes/records');
const adminRouter = require('./routes/admin');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// หมายเหตุ: ไม่เสิร์ฟโฟลเดอร์ uploads แบบสาธารณะอีกต่อไป (ก่อนหน้านี้ใครก็เปิดลิงก์รูปดูได้)
// รูปบัตรประชาชนต้องเข้าถึงผ่าน /api/admin/photos/:recordId ซึ่งต้องล็อกอินผู้ดูแลก่อนเท่านั้น

// API
app.use('/api/items', itemsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/admin', adminRouter);

// เสิร์ฟหน้าเว็บ (frontend) จากโฟลเดอร์ ../public
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์ทำงานที่ http://localhost:${PORT}`);
});
