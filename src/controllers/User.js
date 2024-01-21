const User = require('../db/schemas/User')
const register = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({ ok: 'Successful' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ erro: 'Error on server' });
    }
    
}

module.exports = {
    register
}