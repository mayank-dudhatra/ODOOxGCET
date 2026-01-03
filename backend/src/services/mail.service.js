import nodemailer from 'nodemailer';

// Configuration using your .env variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,   // smtp.gmail.com
  port: process.env.EMAIL_PORT,   // 587
  secure: process.env.EMAIL_SECURE === 'true', // false for port 587
  auth: {
    user: process.env.EMAIL_USER, // aryapatel.cg@gmail.com
    pass: process.env.EMAIL_PASSWORD, // wzag mjkt zkxd gczk
  },
});

/**
 * Sends a welcome email to the newly registered admin
 */
export const sendWelcomeEmail = async (adminEmail, adminName, loginId, companyName) => {
  const mailOptions = {
    from: `"Dayflow HRMS" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `Welcome to Dayflow HRMS - Your Login ID for ${companyName}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #2563eb; text-align: center;">Welcome to Dayflow HRMS!</h2>
        <p>Hello <strong>${adminName}</strong>,</p>
        <p>Your company, <strong>${companyName}</strong>, has been successfully registered on our platform.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Your unique Admin Login ID is:</p>
          <h1 style="margin: 10px 0; color: #0f172a; font-family: monospace; letter-spacing: 2px;">${loginId}</h1>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Use this ID instead of your email to log in.</p>
        </div>

        <p>You can now access your dashboard to begin setting up your HR operations.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173/login" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
        </div>
        
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this registration, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail service error: ", error.message);
    throw error; // Propagate error to the controller
  }
};