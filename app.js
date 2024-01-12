const express = require('express')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const cors = require('cors')

const app = express()
const port = 5002

const email = 'Ashitosh07@outlook.com'
const myemail = 'kambleashitosh07@gmail.com'
const mypassword = 'osvr sxea qazq bcgj'

app.use(cors())
app.use(express.json({ limit: '50mb' }))

function sendEmail(toEmail, title, description, file, isBuyer, donationAmount) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myemail,
        pass: mypassword,
      },
    })

    const mailConfigs = {
      from: myemail,
      to: toEmail,
      attachments: [
        {
          filename: file.name,
          content: file.content ? Buffer.from(file.content, 'base64') : '',
        },
      ],
      subject: isBuyer
        ? 'Thank you for your purchase'
        : 'Donation Confirmation',
      text: isBuyer
        ? `Title: ${title}\nDescription: ${description}\n\nThank you for your purchase!`
        : `Title: ${title}\n\nThank you for your generous donation amount of ${donationAmount}. Your contribution is highly appreciated.`,
    }

    transporter.sendMail(mailConfigs, (error, info) => {
      if (error) {
        console.error(error)
        reject({ message: 'Failed to send email' })
      } else {
        resolve({ message: 'Email sent successfully' })
      }
    })
  })
}

const clientEmail = 'ashitosh.k008@gmail.com' // Replace with the actual client's email address

app.post('/sendEmail', async (req, res) => {
  const { buyerEmail, title, description, file, donationAmount } = req.body
  console.log(req.body, 'req.body')
  try {
    // Send email to the buyer
    await sendEmail(buyerEmail, title, description, file, true)

    // Send email to the client
    await sendEmail(
      clientEmail,
      title,
      description,
      file,
      false,
      donationAmount
    ) // Assuming client email only needs title

    res.json({ message: 'Emails sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to send emails' })
  }
})
// Other routes and middleware can be added as needed

const task = () => {
  console.log('Running a task every minute')
}

cron.schedule('0 12 28 * *', () => {
  console.log('Cron job executed')
})

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`)
})
