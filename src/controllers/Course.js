const { BlobServiceClient } = require('@azure/storage-blob');
const { config } = require('dotenv');
const Course = require('../db/schemas/Course');
const Material = require('../db/schemas/Material');
config();

const blobService = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=storematecode;AccountKey=66QIwhPz9ABODzT+NXoGBr8ndbg8+h4NpH8/5n+ZUeszupqrGtopIa6LszNBr9mFrDO00XGK1pLe+AStCr2R1A==;EndpointSuffix=core.windows.net');

const addCourse = async (req, res) => {
    try {
        const { title, description, author, university, videoUrl, tools, price, preview, materials } = req.body;
        const files = req.files;
        const formData = {
            title,
            university,
            author,
            description,
            videoUrl,
            tools: tools.split(','),
            price,
            screens: []
        };
        const newProduct = new Course(formData);
        for (const element of files) {
            const { originalname, buffer } = element;
            const containerClient = blobService.getContainerClient('archivos');
            const blobClient = containerClient.getBlockBlobClient(`${newProduct._id.toString()}/${originalname}`);
            await blobClient.uploadData(buffer);
            if (originalname == preview) {
                newProduct.preview = blobClient.url;
            } else {
                newProduct.screens.push(blobClient.url);
            }
        }
        for (const material of JSON.parse(materials)) {
            material.course = newProduct._id;
            const newMaterial = new Material(material);
            await newMaterial.save();
        }
        await newProduct.save();
        res.status(200).send({ ok: 'Successful' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error on server' });
    }
}

const getCourseList = async (req, res) => {
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

        const courses = await Course.aggregate([
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

        const totalCourses = await Course.countDocuments(query);

        res.status(200).send({
            courses,
            totalPages: totalCourses,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
}

const getCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const founded = await Course.findById(id);
        if (!founded) return res.status(400).send({ error: 'Producto no encontrado' });
        const materials = await Material.find({ course: founded._id });
        res.status(200).send({ course: founded, materials });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
}

const getCoursesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const founded = await Course.find({ author: userId });
        res.status(200).send(founded);
    } catch (error) {
        res.status(500).send({ error });
    }
}
module.exports = {
    addCourse,
    getCourseList,
    getCourse,
    getCoursesByUser
}