const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const galleryRouter = require('./routes/gallery');
app.use('/gallery', galleryRouter);


const port = 8000;
app.listen(port, () => {
    console.log('Server is running on port ' + port + '!');
})