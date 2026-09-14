const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ไม่พบ MONGODB_URI — กรุณาตั้งค่าไฟล์ .env ก่อน (ดูตัวอย่างใน .env.example)');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('เชื่อมต่อ MongoDB สำเร็จ');
  } catch (err) {
    console.error('เชื่อมต่อ MongoDB ไม่สำเร็จ:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
