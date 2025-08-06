const UserRegistration = require('../models/RegisterSchema')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const verifyToken = async (req, res, next) => {
    console.log(req.cookies.Token)
    const token = req.cookies.Token
    jwt.verify(token, 'jeth445', (err, decoded) => {
        if (err) {
            res.send({ message: 'Unauthorized Access' })
        } else if (decoded) {
            req._id = decoded.userDB._id
            console.log(req._id)
            req.username = decoded.userDB.username
            next()
        }
    })
}
exports.testController = (req, res) => {
    res.send('hello from test controller')
}

var id1 = ''

exports.photographerLogin = async (req, res) => {
    const { username, password } = req.body
    const userDB = await UserRegistration.findOne(
        { username },
        { _id: 1, username: 1 }
    )
    id1 = userDB._id
    if (userDB) {
        let Token = jwt.sign({ userDB }, 'jeth445', {
            expiresIn: '2h',
        })
        res.cookie('Token', Token)
        console.log(Token)
        res.status(200).send()
    } else {
        res.status(404).send()
    }
}

const storage = multer.diskStorage({
    destination: '../assets/images',
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    },
})
// const maxSize = 10 * 1024 * 1024;
const upload = multer({ storage })

;(exports.photographerRegister = upload.single('image')),
    async (req, res) => {
        const path = req.file.path
        var image = path.replace(/\\/g, '/')
        var img = fs.readFileSync(image)

        var encode_image = img.toString('base64')

        // Define a JSONobject for the image attributes for saving to database

        var finalImg = {
            contentType: req.file.mimetype,

            images: Buffer.from(encode_image, 'base64'),
        }

        const { username, password, repassword, email, phone } = req.body
        const userDB = await UserRegistration.findOne({ username })

        if (userDB) {
            res.send('Username already exists')
        } else {
            const Registration = new UserRegistration({
                image,
                username,
                password,
                repassword,
                email,
                phone,
            })
                .save()
                .then((result) => {
                    if (result) {
                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'manikumar81796@gmail.com',
                                pass: 'cnnsapjgbrilpywm',
                            },
                        })

                        var mailOptions = {
                            from: 'manikumar81796@gmail.com',
                            to: email,
                            subject: 'Sending Email using Node.js',
                            html: `<div class="card"><h1>PHOTOGRAPHERS HUB</h1>
            <div>
            <p>Thank you for registering....</p>
            <p>Now you became a member of photographers hub</p>
            <img src="cid:firstpic" width="300" height="300">
            </div>
            </div>`,
                            attachments: [
                                {
                                    filename: 'firstpic.jpeg',
                                    path: '../assets/images/firstpic.jpeg',
                                    cid: 'firstpic',
                                },
                            ],
                        }

                        transporter.sendMail(
                            mailOptions,
                            function (error, info) {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log('Email sent: ' + info.response)
                                }
                                console.log(result)
                                res.json({ data: result })
                            }
                        )
                    } else console.log(err)
                })
        }
    }

// app.post('/register', upload.single('image'), async (req, res) => {

// })
