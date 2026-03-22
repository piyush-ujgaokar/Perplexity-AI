
import { Resend } from "resend";

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Reusable email function
export async function sendEmail({ to, subject, text, html }) {
  try {
    // Email sending logic commented out to disable outbound emails.
    // Uncomment the block below to re-enable sending with Resend.
    /*
    const response = await resend.emails.send({
      from: "piyushuj2005@gmail.com", // default sender (works for testing)
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully:", response);
    return response;
    */

    // Stub response while email sending is disabled.
    console.log("⚠️ Email sending disabled: sendEmail is a no-op stub.");
    return { mocked: true, to, subject };
  } catch (error) {
    // Error handling for the stubbed implementation.
    console.error("sendEmail stub error:", error);
    throw error;
  }
}

