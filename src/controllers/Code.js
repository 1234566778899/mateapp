
const Code = require('../db/schemas/Code');
const { generateRandomCode } = require('../utils');

const registerCode = async (req, res) => {
    try {
        const { products } = req.body;
        const data = {
            products,
            description: generateRandomCode()
        };
        const newCode = new Code(data);
        await newCode.save();
        res.status(200).send(newCode.description);

    } catch (error) {
        res.status(500).send({ error: 'Error on server' });
    }

}

module.exports = {
    registerCode
}