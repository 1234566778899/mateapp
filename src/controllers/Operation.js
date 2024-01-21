const Operation = require('../db/schemas/Operation');
const Code = require('../db/schemas/Code');
const { generateRandomCode } = require('../utils');

const registerOperation = async (req, res) => {
    try {
        const { uid, products, typePay, name, total, code } = req.body;
        if (typePay == 'YAPE') {
            const isValid = await Code.findOne({ description: code });
            if (!isValid) return res.status(400).send('Código no válido');
            if (isValid && !isValid.valid) return res.status(400).send('El código ya fue usado');
            const idProducts = products.map(x => x.code);
            if (!idProducts.every(element => isValid.products.includes(element))) return res.status(400).send('El código no es válido para los productos seleccionados');
            isValid.valid = false;
            await isValid.save();
        }
        const data = {
            uid,
            products,
            name,
            total,
            typePay,
            code: generateRandomCode()
        }

        const newOperation = new Operation(data);
        await newOperation.save();
        res.status(200).send(newOperation);

    } catch (error) {
        res.status(500).send({ error: 'Error on server' });
    }
}

module.exports = {
    registerOperation
}