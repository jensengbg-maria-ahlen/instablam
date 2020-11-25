const { Router } = require('express');
const router = new Router();
const {getImages, addImage, removeImage} = require('../db/database');

router.get('/', async(req, res) => {
    let resObj = {
        success: false
    }

    const images = await getImages();

    if(images) {
        resObj.success = true;
        resObj.images = images;
    }

    res.send(JSON.stringify(resObj));
})

router.post('/add', async(req, res) => {
    const body = req.body;
    const img = await addImage(body);

    let resObj = {
        imgUrl: img.imgUrl,
        lat: img.lat,
        lng: img.lng
    }

    res.send(JSON.stringify(resObj));
})


router.delete('/delete', async(req,res) => {
    const body = req.body
    let img = await removeImage(body);
    
    let resObj = {
        imgUrl: img.imgUrl,
        lat: img.lat,
        lng: img.lng
    }

    res.send(JSON.stringify(resObj));
})

module.exports = router;