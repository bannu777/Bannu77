const ProfilesData = require('../../models/AllProfilesSchema')
const UserRegistration = require('../../models/RegisterSchema')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: '../assets/images',
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    },
})
// const maxSize = 10 * 1024 * 1024;
const upload = multer({ storage })

exports.GetAllProfiles = async (req, res) => {
    console.log(req.params.username)
    console.log('hello')
    await UserRegistration.find()
        .then((retrievedata) => {
            res.send({ retrievedata: retrievedata })
        })
        .catch((err) => console.log(err))
}

exports.EditProfile = async (req, res) => {
    await UserRegistration.findOne({ username: req.params.username })
        .then((retrievedata) => {
            console.log(req.cookies.token)
            res.send({ retrievedata: retrievedata })
        })
        .catch((err) => console.log(err))
}
;(exports.UpdateProfile = upload.array('image[]', 12)),
    async (req, res) => {
        var files = req.files
        let image = {}
        let userp = {}
        let res1 = []

        console.log(files)
        files.forEach((file, i) => {
            const path = file.path
            image[i] = path.replace(/\\/g, '/')
        })

        const { username, email, phone, Address, City } = req.body

        const userDb = await UserRegistration.findOne(
            { username },
            { username: 1, _id: 0 }
        )
        userp = await ProfilesData.findOne({ username }, { image: 1, _id: 0 })

        if (
            (await ProfilesData.findOne(
                { username },
                { username: 1, _id: 0 }
            )) == null
        ) {
            const SaveProfiledata = new ProfilesData({
                username: req.body.username,
                email,
                phone,
                Address,
                City,
                image,
            })
                .save()
                .then((result) => {
                    res.status(200).json({ updated: result })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (
            await ProfilesData.findOne({ username }, { username: 1, _id: 0 })
        ) {
            console.log('hello')
            const obj = Object.values(userp.image)
            console.log(obj)
            let arr = []
            for (i of obj) {
                arr.push(...Object.values(i))
                console.log(arr)
            }

            const obj2 = Object.values(image)
            console.log(obj2)

            let result = [...obj2, ...arr]
            console.log(result)

            const obj3 = Object.assign({}, result)
            console.log(obj3)

            let result1 = []
            result1.push(obj3)
            console.log(result1)

            ProfilesData.updateOne(
                { username: req.params.username },
                {
                    $set: {
                        username: req.params.username,
                        email: email,
                        phone: phone,
                        Address: Address,
                        City: City,
                        image: result1,
                    },
                },
                { new: true }
            ).then((result) => {
                UserRegistration.updateOne(
                    { username: req.params.username },
                    {
                        $set: {
                            username: req.params.username,
                            email: email,
                            phone: phone,
                        },
                    },
                    { new: true }
                )
                    .then((result) => {
                        res.status(200).json({ updated: result })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }
    }

exports.ViewProfile = async (req, res) => {
    console.log(req.params.user)
    await UserRegistration.findOne({ username: req.params.user })
        .then((retrievedata) => {
            console.log(req.cookies.token)
            res.send({ retrievedata: retrievedata })
        })
        .catch((err) => console.log(err))
}
