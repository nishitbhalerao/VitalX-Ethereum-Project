import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { fetch } from "undici";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://vitalx-eth.vercel.app',  // Your Vercel app
    process.env.FRONTEND_URL // For flexibility
  ].filter(Boolean),
  credentials: true
}));

// Local users file path
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper functions for local storage
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// ⬇️ CONNECT SUPABASE (with fallback to local storage)
const supabase = createClient(
  process.env.SUPABASE_URL || "https://ypgnvwemsibsmydcqkon.supabase.co",
  process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZ252d2Vtc2lic215ZGNxa29uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA4ODc2MywiZXhwIjoyMDc1NjY0NzYzfQ.iYFVsaj414_FneatMSYYIkIAHa6KZTCHgYbq_pBaXHw",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: fetch
    }
  }
);

let USE_LOCAL_STORAGE = false;

// Test Supabase connection on startup
(async () => {
  try {
    const { error } = await supabase.from("users").select("count").limit(1);
    if (error) throw error;
    console.log("✅ Connected to Supabase");
  } catch (err) {
    console.warn("⚠️  Cannot connect to Supabase, using local storage:", err.message);
    USE_LOCAL_STORAGE = true;
  }
})();

const otpStore = {}; // Temporary store (use DB in production)

// Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "2025.vitalx@gmail.com",
    pass: process.env.EMAIL_PASS || "ugry lhys wunm saok",
  },
});

// =====================
// ✔ TEST ENDPOINT
// =====================
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

// =====================
// ✔ SIGNUP NEW USER
// =====================
app.post("/signup", async (req, res) => {
  console.log("📝 Signup request received:", req.body);
  const { full_name, email, password, role } = req.body;

  try {
    if (USE_LOCAL_STORAGE) {
      // Use local file storage
      console.log("💾 Using local storage...");
      const users = await readUsers();
      
      // Check if email exists
      if (users.find(u => u.email === email)) {
        return res.json({ success: false, message: "Email already registered" });
      }
      
      // Add new user
      const newUser = {
        id: Date.now(),
        full_name,
        email,
        password_hash: password,
        role: role || "patient",
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      await writeUsers(users);
      
      console.log("✅ User created in local storage:", email);
      return res.json({ success: true, message: "Account created successfully", data: newUser });
    } else {
      // Use Supabase
      console.log("🔄 Attempting to insert user into Supabase...");
      
      const { data, error } = await supabase
        .from("users")
        .insert([{ 
          full_name, 
          email, 
          password_hash: password, 
          role: role || "patient" 
        }])
        .select();

      if (error) {
        console.error("❌ Supabase error:", error);
        return res.json({ 
          success: false, 
          message: error.message || "Database error"
        });
      }

      console.log("✅ User created in Supabase:", data);
      return res.json({ success: true, message: "Account created successfully", data });
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.json({ 
      success: false, 
      message: err.message || "Server error occurred"
    });
  }
});

// =====================
// ✔ CHECK USER EXISTS
// =====================
app.post("/check-user", async (req, res) => {
  const { email } = req.body;

  try {
    if (USE_LOCAL_STORAGE) {
      const users = await readUsers();
      const exists = users.some(u => u.email === email);
      return res.json({ exists });
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (error || !data) {
        return res.json({ exists: false });
      }

      return res.json({ exists: true });
    }
  } catch (err) {
    return res.json({ exists: false });
  }
});

// =====================
// ✔ GET USER FULL NAME
// =====================
app.post("/get-user", async (req, res) => {
  const { email } = req.body;

  try {
    if (USE_LOCAL_STORAGE) {
      const users = await readUsers();
      const user = users.find(u => u.email === email);
      return res.json({ full_name: user ? user.full_name : null });
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("email", email)
        .single();

      if (error || !data) {
        return res.json({ full_name: null });
      }

      return res.json({ full_name: data.full_name });
    }
  } catch (err) {
    return res.json({ full_name: null });
  }
});

// =====================
// SEND OTP
// =====================
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  const mailOptions = {
    from: "VitalX <yourgmail@gmail.com>",
    to: email,
    subject: "Your VitalX Login OTP",
    text: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// =====================
// VERIFY OTP
// =====================
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));