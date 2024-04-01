const Operation = require('../db/schemas/Operation');
const Course = require('../db/schemas/Course');
const Material = require('../db/schemas/Material');
const Code = require('../db/schemas/Code');
const { generateRandomCode } = require('../utils');

const registerOperation = async (req, res) => {
    try {
        const { uid, products, typePay, name, total, code } = req.body;
        if (typePay == 'YAPE') {
            const isValid = await Code.findOne({ description: code });
            if (!isValid) return res.status(400).send('Código no válido');
            if (!isValid.valid) return res.status(400).send('El código ya fue usado');
            const idProducts = products.map(x => x._id);
            if (!idProducts.every(element => isValid.products.includes(element))) return res.status(400).send('El código no es válido para los productos seleccionados');
            isValid.valid = false;
            await isValid.save();
        }

        const materials = products.map(prod => (
            {
                ...prod, code: prod._id, zip: prod.url,
                materials: prod.materials ? prod.materials.map(x => ({ ...x, code: x._id, zip: x.url })) : []
            }));

        const data = {
            uid,
            products: materials,
            name,
            total,
            typePay,
            code: generateRandomCode()
        }

        const newOperation = new Operation(data);
        await newOperation.save();
        for (const product of products) {
            if (product.course) {
                let founded = await Material.findById(product._id);
                founded.quantitySold = founded.quantitySold + 1;
                await founded.save();
            } else {
                for (const mat of product.materials) {
                    let founded = await Material.findById(mat._id);
                    founded.quantitySold = founded.quantitySold + 1;
                    await founded.save();
                }
            }
        }
        res.status(200).send(newOperation);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error on server' });
    }
}

const getOperationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const founded = await Operation.find({ uid: userId }).sort({ createdAt: -1 });
        res.status(200).send(founded);
    } catch (error) {
        res.status(500).send({ error: 'Error on server' });
    }
}

const getEarningsByUser = async (req, res) => {
    try {

        const { userId } = req.params;
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        const aggregation = [
            {
                $unwind: "$products"
            },
            {
                $match: {
                    "products.uid": userId
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$products.price" },
                    cantidad: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    cantidad: 1
                }
            }
        ]
        const aggregationPipeline = [
            {
                $unwind: "$products"
            },
            {
                $match: {
                    "products.uid": userId,
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    mes: { $sum: "$products.price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    mes: 1
                }
            }
        ];
        const result = await Operation.aggregate(aggregationPipeline);
        const _result = await Operation.aggregate(aggregation);
        const { mes } = result[0] ? result[0] : 0;
        const { total, cantidad } = _result[0] ? _result[0] : 0;

        res.status(200).send({ total, mes, cantidad });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error on server' });
    }
}
const getAllOperations = async (req, res) => {
    try {
        const operations = await Operation.find();
        res.status(200).send(operations);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error on server' });
    }
}
module.exports = {
    registerOperation,
    getOperationsByUser,
    getEarningsByUser,
    getAllOperations
}