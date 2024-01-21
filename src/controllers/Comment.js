const Comment = require('../db/schemas/Comment');

const addComment = async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(200).send(newComment);
    } catch (error) {
        res.status(500).send({ error: 'Error on server' });
    }
}

const getCommentsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const founded = await Comment.find({ product: productId });
        res.status(200).send(founded);
    } catch (error) {
        res.status(500).send({ error: 'Error on server' });
    }
}
module.exports = {
    addComment,
    getCommentsByProduct
}