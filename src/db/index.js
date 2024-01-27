const mongoose = require('mongoose');
const { config } = require('dotenv');
config();
//const url = 'mongodb+srv://61126863:CJ05yA55creGkCii@cluster0.iyqbg9l.mongodb.net/matecode'
const url = 'mongodb://localhost:27017/matecode';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(db => console.log('db connected'))
    .catch(error => console.log(error));
