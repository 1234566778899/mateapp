const Product = require('../db/schemas/Product');
const { BlobServiceClient } = require('@azure/storage-blob');
const { config } = require('dotenv');
config();

const blobService = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=storematecode;AccountKey=66QIwhPz9ABODzT+NXoGBr8ndbg8+h4NpH8/5n+ZUeszupqrGtopIa6LszNBr9mFrDO00XGK1pLe+AStCr2R1A==;EndpointSuffix=core.windows.net');

const addProducto = async (req, res) => {
    try {
        const { title, description, author, videoUrl, uid, course, tools, lastUpdate, price, miniature, preview, zip } = req.body;
        const files = req.files;


        const formData = {
            title,
            author,
            description,
            videoUrl,
            uid,
            course,
            tools: tools.split(','),
            lastUpdate,
            price,
            files: []
        };

        const newProduct = new Product(formData);

        for (const element of files) {
            const { originalname, buffer } = element;
            const containerClient = blobService.getContainerClient('archivos');
            const blobClient = containerClient.getBlockBlobClient(`${newProduct._id.toString()}/${originalname}`);
            await blobClient.uploadData(buffer);

            switch (originalname) {
                case miniature:
                    newProduct.miniature = blobClient.url;
                    break;
                case preview:
                    newProduct.preview = blobClient.url;
                    break;
                case zip:
                    newProduct.zip = blobClient.url;
                    break;
                default:
                    newProduct.files.push(blobClient.url);
                    break;
            }
        }
        await newProduct.save();

        res.status(200).send({ ok: 'Successful' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error on server' });
    }
}

const getProductList = async (req, res) => {
    try {
        const { quantity, paginate, title, course, tool, priceMin, priceMax } = req.body;
        let query = {}

        if (title) {
            query['$or'] = [
                { title: { $regex: title, $options: "i" } },
                { course: { $regex: title, $options: "i" } },
                { tools: { $regex: title, $options: "i" } },
            ]
        }
        if (course)
            query.course = { $regex: course, $options: "i" }

        if (tool)
            query.tools = { $regex: tool, $options: "i" }

        if (priceMin == 0 || priceMax == 0 || (priceMax && priceMin))
            query.price = { $gte: priceMin, $lte: priceMax };

        const productList = await Product.aggregate([
            {
                $match: {
                    ...query,
                    status: '1'
                }
            },
            {
                $skip: (paginate - 1) * quantity
            },
            {
                $limit: quantity
            }
        ]);
        res.status(200).send(productList);
    } catch (error) {
        res.status(500).send({ error });
    }
}

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const founded = await Product.findById(id);
        if (!founded) return res.status(400).send({ error: 'Producto no encontrado' });
        res.status(200).send(founded);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
}

const getProductsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const founded = await Product.find({ uid: userId });
        res.status(200).send(founded);
    } catch (error) {
        res.status(500).send({ error });
    }
}
module.exports = {
    addProducto,
    getProductList,
    getProduct,
    getProductsByUser
}