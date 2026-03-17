import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    // Optional but helpful for debugging
    // logger: true,
    // debug: true,
  });

  // Optional: Verify connection once at startup (good practice)
  // await transporter.verify(); // uncomment to test connection on server start

  const mailOptions = {
    from: '"Diag App" <dennisraynex@gmail.com>',
    to,
    subject,
    html,
    // Optional: replyTo: "support@yourdomain.com",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
