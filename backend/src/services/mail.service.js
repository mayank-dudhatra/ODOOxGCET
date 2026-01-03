import nodemailer from 'nodemailer';

// Transporter configuration explicitly targeting Gmail's SMTP servers
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL port
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (adminEmail, adminName, loginId, companyName) => {
  const mailOptions = {
    from: `"Dayflow HRMS" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `Welcome to Dayflow HRMS - Your Login ID for ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Welcome to Dayflow HRMS, ${adminName}!</h2>
        <p>Congratulations! Your company, <strong>${companyName}</strong>, has been successfully registered.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Your unique Admin Login ID is:</p>
          <h1 style="margin: 10px 0; color: #10b981; font-family: monospace;">${loginId}</h1>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Please keep this ID safe as it is required for every login.</p>
        </div>
        <p>You can now log in to your dashboard to start managing your employees and HR operations.</p>
        <a href="http://localhost:5173/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};