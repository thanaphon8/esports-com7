import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'กรุณาระบุ Username'],
      unique: true,
      trim: true,
    },
    nickname: {
      type: String,
      trim: true,
      default: function () {
        return this.username; // ถ้าไม่มี nickname ให้ใช้ username เป็นค่าเริ่มต้น
      },
    },
    email: {
      type: String,
      required: [true, 'กรุณาระบุ Email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'กรุณาระบุ Password'],
      select: false, // เพื่อความปลอดภัย: จะไม่ดึงรหัสผ่านออกมาโดยไม่จำเป็นเมื่อ query ข้อมูล
    },
    country: {
      type: String,
      default: 'TH',
      uppercase: true,
      trim: true,
    },
    // --- ฟิลด์สำหรับระบบจัดอันดับและมินิเกม ---
    score: {
      type: Number,
      default: 0,
      min: 0,
      index: true, // เพิ่ม index ช่วยให้ Query ตาราง Leaderboard ได้รวดเร็วขึ้น
    },
    aimHighScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    memoryHighScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPlays: {
      type: Number,
      default: 0,
      min: 0,
    },
    // --- ฟิลด์เก็บประวัติการเข้าใช้งาน ---
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginHistory: [
      {
        loginAt: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ป้องกันการสร้าง Model ซ้ำใน Next.js Hot Reload
export default mongoose.models.User || mongoose.model('User', userSchema);