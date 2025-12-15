import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());
app.use(cors());

// ⬇️ CONNECT SUPABASE TO CHECK IF EMAIL EXISTS
const supabase = createClient(
  "https://ypgnvwemsibsmydcqkon.supabase.co", // Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZ252d2Vtc2lic215ZGNxa29uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA4ODc2MywiZXhwIjoyMDc1NjY0NzYzfQ.iYFVsaj414_FneatMSYYIkIAHa6KZTCHgYbq_pBaXHw" // service_role key
);

const otpStore = {}; // Temporary store (use DB in production)

// Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "2025.vitalx@gmail.com",
    pass: "ugry lhys wunm saok",
  },
});

// =====================
// ✔ CHECK USER EXISTS
// =====================
app.post("/check-user", async (req, res) => {
  const { email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.json({ exists: false });
  }

  return res.json({ exists: true });
});

// =====================
// ✔ GET USER FULL NAME
// =====================
app.post("/get-user", async (req, res) => {
  const { email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("full_name")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.json({ full_name: null });
  }

  return res.json({ full_name: data.full_name });
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

app.listen(5000, () => console.log("✅ Server running on port 5000"));
