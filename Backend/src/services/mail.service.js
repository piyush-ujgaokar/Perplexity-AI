
import { Resend } from "resend";

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Reusable email function
export async function sendEmail({ to, subject, text, html }) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // default sender (works for testing)
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
}

