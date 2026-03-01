import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // ค่อยๆ เพิ่มจำนวนคนเข้าเว็บจนถึง 50 คน ใน 30 วินาที
    { duration: '1m', target: 50 },  // รักษาจำนวนคนไว้ที่ 50 คน เป็นเวลา 1 นาที (ช่วงนี้ Pod ควรจะเริ่ม Scale)
    { duration: '30s', target: 0 },  // ค่อยๆ ลดจำนวนคนลงจนเหลือ 0 ใน 30 วินาที
  ],
};

export default function () {
  // ยิง Request ไปที่ Backend API ดึงข้อมูลห้องพัก (เพื่อปั่น CPU)
  http.get('http://localhost:30050/api/rooms');
  // ยิง Request ไปที่หน้าเว็บ Frontend 
  http.get('http://localhost:30080');
  sleep(1);
}