const Reserve = require('../../models/ReserveSchemea')
exports.Reserve = async (req, res) => {
    const { username1, email1, phone1, City, Event, date, photographername } =
        req.body
    const userDB = await Reserve.findOne({ date })
    console.log(userDB)
    if (userDB) {
        res.send({ message: 'failure' })
    } else {
        const Reserve1 = new Reserve({
            username1,
            email1,
            phone1,
            City,
            Event,
            date,
            photographername,
        })
            .save()
            .then((result) => {
                if (result) {
                    console.log(result)
                    res.send({ data: result })
                } else console.log(err)
            })
    }
}
exports.Reserved = async (req, res) => {
    await Reserve.find({ photographername: req.params.username1 })
        .then((retrievedata) => {
            console.log(retrievedata)
            console.log('bye')
            res.send({ retrievedata: retrievedata })
        })
        .catch((err) => console.log(err))
}
