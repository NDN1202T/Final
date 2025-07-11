require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const forgotPasswordRoutes = require('./routes/forgotPassword');
const profileRoutes = require('./routes/profile');  
const jobRoutes = require("./routes/jobs");  
const companyRoutes = require("./routes/companyRoutes"); // Đường dẫn đến file companyRoutes.js
const employerRoutes = require('./routes/employer');
const applicationRoutes = require('./routes/application');
const dashboardRoutes = require('./routes/dashboardRoutes');
const contactRoutes = require('./routes/contact'); // Đường dẫn đến file contact.js nếu cần sử dụng


const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static('uploads')); // Để phục vụ file CV từ thư mục uploads
app.use("/api/jobs", jobRoutes); 
app.use("/api/company", companyRoutes); // Sử dụng router cho các route liên quan đến công ty
app.use("/api/employers", employerRoutes); // Sử dụng router cho các route liên quan đến nhà tuyển dụng
app.use('/api/cv', require('./routes/cv'));
app.use('/api/applications', applicationRoutes); // Sử dụng router cho các route liên quan đến ứng tuyển
app.use('/api/dashboard', dashboardRoutes); // Sử dụng router cho các route liên quan đến dashboard 
app.use('/api/contact', contactRoutes); // Sử dụng router cho các route liên quan đến liên hệ


// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Đăng ký người dùng
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã được sử dụng!" });

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo user mới
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "Đăng ký thành công!" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});


app.post("/api/auth/google", async (req, res) => {
  try {
    const { name, email, googleId } = req.body;

    // Kiểm tra user đã tồn tại chưa
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }

    res.status(200).json({ message: "Đăng ký với Google thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
