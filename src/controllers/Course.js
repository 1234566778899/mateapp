const { BlobServiceClient } = require('@azure/storage-blob');
const { config } = require('dotenv');
const Course = require('../db/schemas/Course');
const Material = require('../db/schemas/Material');
config();

const blobService = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=storematecode;AccountKey=66QIwhPz9ABODzT+NXoGBr8ndbg8+h4NpH8/5n+ZUeszupqrGtopIa6LszNBr9mFrDO00XGK1pLe+AStCr2R1A==;EndpointSuffix=core.windows.net');

const addCourse = async (req, res) => {
    try {
        const { title, description, author, university, user, videoUrl, tools, price, preview, materials } = req.body;
        const files = req.files;
        const formData = {
            title,
            university,
            author,
            user,
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
        const { quantity, paginate, title, category } = req.body;
        let query = {}
        if (title) {
            query['$or'] = [
                { title: { $regex: title, $options: "i" } }
            ]
        }
        if (category) {
            query['category'] = { $regex: category, $options: "i" }
        }
        const courses = await Course.aggregate([
            {
                $match: {
                    ...query,
                    status: {
                        $in: ['1', '2']
                    }
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

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const course = await Course.findById(id);
        if (!course) return res.status(400).send({ error: 'Curso no encontrado' });
        course.status = status;
        await course.save();
        res.status(200).send({ ok: 'Successful' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
}
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).send(courses);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
}
module.exports = {
    addCourse,
    getCourseList,
    getCourse,
    getCoursesByUser,
    updateStatus,
    getAllCourses
}