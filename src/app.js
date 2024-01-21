const express = require('express')
const app = express();
const cors = require('cors')
require('./db/index')
app.use(express.json());
const port = process.env.PORT || 4000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('v.1.0.13')
})

app.use('/product', require('./routes/Product'));
app.use('/user', require('./routes/User'));
app.use('/comment', require('./routes/Comment'));
app.use('/code', require('./routes/Code'));
app.use('/operation', require('./routes/Operation'));

app.listen(port, () => {
    console.log('server running on port: ' + port);
});