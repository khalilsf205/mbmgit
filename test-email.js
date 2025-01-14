import nodemailer from 'nodemailer';

async function testEmail() {
  // Create a test account
  let testAccount = await nodemailer.createTestAccount();

  // Create a transporter using the test account
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  try {
    // Send a test email
    let info = await transporter.sendMail({
      from: '"Test Sender" <sender@example.com>',
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email from the Node.js script",
      html: "<b>This is a test email from the Node.js script</b>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();

