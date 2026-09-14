// รันด้วยคำสั่ง: npm run seed
// ใส่ข้อมูลอุปกรณ์เริ่มต้นลง database (ลบของเก่าทิ้งก่อนแล้วใส่ใหม่)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Item = require('../models/Item');

const initialItems = [
  { name: 'ลูกบาสเกตบอล', category: 'sports', total: 6, available: 4 },
  { name: 'ไม้แบดมินตันคู่', category: 'sports', total: 8, available: 8 },
  { name: 'ลูกฟุตบอล', category: 'sports', total: 5, available: 1 },
  { name: 'เชือกกระโดด', category: 'sports', total: 10, available: 0 },
  { name: 'ตาข่ายวอลเลย์บอล', category: 'sports', total: 2, available: 2 },

  { name: 'สว่านไฟฟ้า', category: 'tools', total: 4, available: 2 },
  { name: 'ค้อนหงอน', category: 'tools', total: 6, available: 5 },
  { name: 'ชุดไขควงอเนกประสงค์', category: 'tools', total: 5, available: 3 },
  { name: 'เลื่อยมือ', category: 'tools', total: 3, available: 0 },
  { name: 'บันไดพับอลูมิเนียม', category: 'tools', total: 2, available: 1 },
  { name: 'ประแจเลื่อน', category: 'tools', total: 4, available: 4 },

  { name: 'เต็นท์แคมปิ้ง 4 คน', category: 'rec', total: 3, available: 1 },
  { name: 'เก้าอี้พับปิกนิก', category: 'rec', total: 12, available: 9 },
  { name: 'เครื่องฉายหนังกลางแจ้ง', category: 'rec', total: 1, available: 0 },
  { name: 'ลำโพงบลูทูธ', category: 'rec', total: 4, available: 2 },
  { name: 'กระเป๋าเป้เดินป่า', category: 'rec', total: 5, available: 5 },

  { name: 'รถเข็นขนของ', category: 'other', total: 3, available: 2 },
  { name: 'เครื่องดูดฝุ่น', category: 'other', total: 2, available: 1 },
  { name: 'พัดลมไอเย็น', category: 'other', total: 2, available: 0 },
  { name: 'โต๊ะพับอเนกประสงค์', category: 'other', total: 6, available: 4 }
];

async function seed() {
  await connectDB();
  await Item.deleteMany({});
  await Item.insertMany(initialItems);
  console.log(`ใส่ข้อมูลอุปกรณ์เริ่มต้นสำเร็จ ${initialItems.length} รายการ`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('seed ไม่สำเร็จ:', err);
  process.exit(1);
});
