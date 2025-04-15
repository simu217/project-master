const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER || "hivequeen2025@gmail.com",
      pass: process.env.EMAIL_PASS || "vgcm xzaq fkds vjqp",
    },
  });

const sendInviteEmail = async (toEmail, hiveName, inviteLink) => {

    console.log()
    const mailOptions = {
      from: `"Hive Queen" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🐝 You're invited to join the Hive: ${hiveName}!`,
      html: `
        <p>Hello Explorer,</p>
        <p>You’ve been invited to join <strong>${hiveName}</strong> on HiveVerse.</p>
        <p><a href="${inviteLink}" style="padding: 8px 12px; background: #6366f1; color: white; text-decoration: none; border-radius: 4px;">Accept Invite</a></p>
        <p>See you in the stars ✨</p>
      `,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.response);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    }
  };

module.exports = { sendInviteEmail };
