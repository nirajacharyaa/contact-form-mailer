require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/api/v1/sendmail", (req, res) => {
  const { name, email, message } = req.body;
  async function sendEmail() {
    // mail formatting
    const mailOptions = {
      from: process.env.SENDER_API_EMAIL,
      to: process.env.USER_EMAIL,
      subject: `Message from ${(name, email)}:`,
      text: message,
    };

    // creating the transporter(sender)
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    // sending email

    let result = await transporter.sendMail(mailOptions);
  }
  sendEmail()
    .then(() => {
      res.json({ success: true, message: "Email sent successfully" });
    })
    .catch((err) => {
      res.json({ success: false, message: "error" + err.message });
    });
});

app.listen(8000, () => {
  console.log("server running...");
});
