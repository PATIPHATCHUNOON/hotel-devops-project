const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ Database (MongoDB) โดยรับค่าจาก Kubernetes
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/abudabee';
mongoose.connect(mongoURI)
  .then(() => console.log('เชื่อมต่อฐานข้อมูล Abudabee สำเร็จ!'))
  .catch(err => console.log('Error:', err));

// โครงสร้างข้อมูลห้องพัก
const Room = mongoose.model('Room', new mongoose.Schema({
  name: String,
  price: Number,
  available: Boolean
}));

// API สำหรับสร้างข้อมูลห้องพักเริ่มต้น (เอาไว้กดเรียกตอน Deploy เสร็จ)
app.get('/api/init', async (req, res) => {
  await Room.deleteMany({});
  await Room.insertMany([
    { name: 'Standard Room', price: 1500, available: true },
    { name: 'Deluxe Pool View', price: 2500, available: true },
    { name: 'Abudabee Suite', price: 5000, available: true }
  ]);
  res.send('สร้างข้อมูลห้องพักเริ่มต้นเรียบร้อย!');
});

// API สำหรับดึงข้อมูลห้องพักไปแสดงหน้าเว็บ
app.get('/api/rooms', async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// API สำหรับจองห้องพัก (สมมติว่ากดแล้วสถานะว่างเปลี่ยนเป็น false)
app.post('/api/book', async (req, res) => {
  const { id } = req.body;
  await Room.findByIdAndUpdate(id, { available: false });
  res.json({ message: 'จองห้องพักสำเร็จ!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend รันอยู่ที่พอร์ต ${PORT}`));