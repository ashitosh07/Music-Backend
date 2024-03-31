const express = require("express");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 5002;

const email = "Ashitosh07@outlook.com";
const myemail = "kambleashitosh07@gmail.com";
const mypassword = "osvr sxea qazq bcgj";

app.use(cors());
app.use(express.json({ limit: "50mb" }));
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: myemail,
    pass: mypassword,
  },
});

function sendEmail(
  toEmail,
  title,
  description,
  url,
  isBuyer,
  donationAmount,
  buyerEmail
) {
  console.log("request made");
  return new Promise((resolve, reject) => {
    const mailConfigs = {
      from: myemail,
      to: toEmail,
      subject: isBuyer
        ? "Thank you for your purchase"
        : "Donation Confirmation",
      html: isBuyer
        ? `<div style="font-family: Arial, sans-serif;">
             <h2 style="color: #008080;">Thank you for your purchase!</h2>
             <p>Title: ${title}</p>
             <p>Description: ${description}</p>
             <p>Amount: ${donationAmount}</p>
             <p>Your contribution is highly appreciated. You can download your file <a href="${url}" download>here</a>.</p>
           </div>`
        : `<div style="font-family: Arial, sans-serif;">
             <h2 style="color: #008080;">Donation Confirmation</h2>
             <p>Title: ${title}</p>
             <p>Description: ${description}</p>
             <p>A donation of $${donationAmount} was made by ${buyerEmail} for this song.</p>
           </div>`,
    };

    if (isBuyer) {
      mailConfigs.attachments = [
        {
          filename: "Letter of Thanks.pdf",
          content: fs.createReadStream("./Letter_of_Thanks.pdf"),
        },
      ];
    }

    transporter.sendMail(mailConfigs, (error, info) => {
      if (error) {
        console.error(error);
        reject({ message: "Failed to send email" });
      } else {
        resolve({ message: "Email sent successfully" });
      }
    });
  });
}

const clientEmail = "yvesmugisha84@gmail.com"; // Replace with the actual client's email address

app.post("/sendEmail", async (req, res) => {
  const { email, title, description, url, donationAmount } = req.body;
  console.log(req.body, "req.body");
  try {
    // Send email to the buyer
    await sendEmail(email, title, description, url, true);
    await sendEmail(
      clientEmail,
      title,
      description,
      url,
      false,
      donationAmount,
      email
    );

    res.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send emails" });
  }
});
// Other routes and middleware can be added as needed

const task = () => {
  console.log("Running a task every minute");
};

cron.schedule("0 12 28 * *", () => {
  console.log("Cron job executed");
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
