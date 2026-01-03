import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.error("CRITICAL ERROR: RESEND_API_KEY is not defined in .env file.");
}

// Initialize Resend with your API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a welcome email to the newly registered admin using Resend
 */
export const sendWelcomeEmail = async (adminEmail, adminName, loginId, companyName) => {
  try {
    const { data, error } = await resend.emails.send({
      // Resend requires a verified domain. If you don't have one, 
      // use 'onboarding@resend.dev' for testing.
      from: 'Dayflow HRMS <onboarding@resend.dev>', 
      to: [adminEmail],
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
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully via Resend:", data.id);
    return data;
  } catch (error) {
    console.error("Mail service error: ", error.message);
    throw error;
  }
};