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

function sendEmail(title, description, file) {
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
      to: email,
      attachments: [
        {
          filename: file.name,
          content: Buffer.from(file.content, 'base64'),
        },
      ],
      subject: 'Thank you',
      text: `Title: ${title}\nDescription: ${description}`,
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

app.post('/sendEmail', async (req, res) => {
  const { title, description, file } = req.body

  try {
    await sendEmail(title, description, file)
    res.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to send email' })
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
