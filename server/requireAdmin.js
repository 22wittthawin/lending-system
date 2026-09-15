const crypto = require('crypto');

// ระบบยืนยันตัวตนผู้ดูแลแบบง่าย: ล็อกอินด้วยรหัสผ่านเดียว แล้วได้ token ชั่วคราวกลับไป
// เก็บ token ที่ใช้งานได้ไว้ในหน่วยความจำของเซิร์ฟเวอร์ (ไม่ต้องใช้ DB/JWT ก็พอสำหรับระบบขนาดนี้)
// token จะหมดอายุอัตโนมัติ และจะหายไปทั้งหมดถ้าเซิร์ฟเวอร์รีสตาร์ท (ต้องล็อกอินใหม่)
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 ชั่วโมง
const validTokens = new Map(); // token -> เวลาหมดอายุ (timestamp)

function issueToken() {
  const token = crypto.randomBytes(24).toString('hex');
  validTokens.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

function isValidToken(token) {
  if (!token) return false;
  const expiresAt = validTokens.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    validTokens.delete(token);
    return false;
  }
  return true;
}

function revokeToken(token) {
  if (token) validTokens.delete(token);
}

function getTokenFromRequest(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

// middleware สำหรับป้องกัน route ที่ต้องเป็นผู้ดูแลเท่านั้น
function requireAdmin(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!isValidToken(token)) {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบผู้ดูแลก่อนจึงจะดูข้อมูลนี้ได้' });
  }
  next();
}

module.exports = { issueToken, isValidToken, revokeToken, requireAdmin, getTokenFromRequest };
