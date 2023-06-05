const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendEmail = (email, verificationToken) => {
  // Create a transporter configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification",
    html: `
    <html>
      <head>
        <style>
          /* Add your CSS styles here */
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            width: 500px;
            margin: 0 auto;
          }
          .verification-link {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Email Verification</h2>
          <p>Click the button below to verify your email:</p>
          <a class="verification-link" href="${config.verificationUrl}?token=${verificationToken}">Verify Email</a>
        </div>
      </body>
    </html>
  `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:");
      console.log(error.message);
    } else {
      console.log("Email sent successfully!");
      console.log("Message ID: " + info.messageId);
    }
  });
};

module.exports = { sendEmail };
