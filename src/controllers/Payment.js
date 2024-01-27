const Payment = require('../db/schemas/Payment');

const sendPayment = async (req, res) => {
    try {
        const { uid, amount, bank, account, name } = req.body;

        const newPayment = new Payment({ uid, amount, bank, account, name });
        await newPayment.save();
        res.status(200).send(newPayment);
    } catch (error) {
        res.status(200).send({ error: 'Error on server' });
    }
}
const getPayments = async (req, res) => {
    try {
        const { id } = req.params;
        const founded = await Payment.find({ uid: id });
        res.status(200).send(founded);
    } catch (error) {
        res.status(200).send({ error: 'Error on server' });
    }
}
module.exports = {
    sendPayment,
    getPayments
}