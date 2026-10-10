import nodemailer from "nodemailer";

// Create SMTP transporter using Gmail (or any SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // your 16-character App Password
  },
});

export async function sendOtpEmail(to: string, otp: string, purpose: string) {
  const subject =
    purpose === "reset"
      ? "Password Reset OTP"
      : "Verify your account OTP";

  const text =
    purpose === "reset"
      ? `Your password reset OTP is ${otp}. It expires in 10 minutes.`
      : `Your verification OTP is ${otp}. It expires in 10 minutes.`;

  await transporter.sendMail({
    from: `"Sathak Workshop" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: `
      <h2>${subject}</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP expires in <b>10 minutes</b>.</p>
    `,
  });
}
