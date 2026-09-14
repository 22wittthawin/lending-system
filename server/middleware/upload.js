const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // ตั้งชื่อไฟล์ใหม่กันชนกัน แต่ยังเก็บนามสกุลไฟล์เดิมไว้ (รองรับ .heic, .jpg, .png, .pdf ฯลฯ)
    const ext = path.extname(file.originalname) || '';
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `idcard-${unique}${ext}`);
  }
});

// จงใจไม่จำกัดชนิดไฟล์ให้แคบเกินไป (ปัญหาที่เจอก่อนหน้านี้บนมือถือ/ไอแพด)
// ตรวจแค่ขนาดไฟล์ไม่ให้ใหญ่เกินไป
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;
