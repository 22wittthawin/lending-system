const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const BorrowRecord = require('../models/BorrowRecord');
const { issueToken, requireAdmin, revokeToken, getTokenFromRequest } = require('../middleware/requireAdmin');

// รหัสผ่านผู้ดูแล — ตั้งค่าได้ผ่าน .env (ADMIN_PASSWORD) ถ้าไม่ตั้งไว้จะ fallback เป็นค่านี้
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lemontang';

const uploadDir = path.join(__dirname, '..', 'uploads');

// POST /api/admin/login -> ตรวจรหัสผ่าน แล้วออก token ชั่วคราวให้ใช้เรียก endpoint ของผู้ดูแล
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
  }
  const token = issueToken();
  res.json({ token });
});

// POST /api/admin/logout -> ล้าง token ปัจจุบันทิ้ง (ออกจากระบบผู้ดูแล)
router.post('/logout', requireAdmin, (req, res) => {
  revokeToken(getTokenFromRequest(req));
  res.json({ ok: true });
});

// GET /api/admin/photos/:recordId -> ดูรูปบัตรประชาชนของรายการยืม (เฉพาะผู้ดูแลที่ล็อกอินแล้วเท่านั้น)
router.get('/photos/:recordId', requireAdmin, async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.recordId);
    if (!record) return res.status(404).json({ error: 'ไม่พบรายการนี้' });

    // เอาเฉพาะชื่อไฟล์จริงๆ ไม่พึ่ง path ที่ client ส่งมา กัน path traversal
    const filename = path.basename(record.photoUrl);
    const filePath = path.join(uploadDir, filename);

    // กันเส้นทางหลุดออกนอกโฟลเดอร์ uploads อีกชั้น (defense-in-depth)
    if (!filePath.startsWith(uploadDir + path.sep) && filePath !== uploadDir) {
      return res.status(400).json({ error: 'เส้นทางไฟล์ไม่ถูกต้อง' });
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'ไม่พบไฟล์รูปภาพนี้บนเซิร์ฟเวอร์' });
    }

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: 'โหลดรูปภาพไม่สำเร็จ', detail: err.message });
  }
});

module.exports = router;
