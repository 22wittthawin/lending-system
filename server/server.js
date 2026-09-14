require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const itemsRouter = require('./routes/items');
const recordsRouter = require('./routes/records');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// เสิร์ฟรูปบัตรประชาชนที่อัปโหลดไว้ (ในระบบจริงควรจำกัดสิทธิ์เข้าถึงโฟลเดอร์นี้ให้เฉพาะผู้ดูแล)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API
app.use('/api/items', itemsRouter);
app.use('/api/records', recordsRouter);

// เสิร์ฟหน้าเว็บ (frontend) จากโฟลเดอร์ ../public
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์ทำงานที่ http://localhost:${PORT}`);
});
