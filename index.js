// commented for deployment for production uncomment dotenv
// require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const limiter = require("./requestLimiter");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.post("/api/v1/sendmail", limiter, (req, res) => {
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
      res.json({ success: true, message: "Email sent !" });
    })
    .catch((err) => {
      console.log(err.message);
      res.json({ success: false, message: "Email not sent !" });
    });
});

app.listen(port, () => {
  console.log("server running...");
});
