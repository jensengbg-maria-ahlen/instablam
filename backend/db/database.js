const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/db.json');
const db = low(adapter);


module.exports = {
    async getImages() {
        return await db.get('images').value();
    },

    async addImage(image) {
        return await db.get('images').push(image).write();
    },

    async removeImage(image) {
        return await db.get('images').remove(image).write();
    }
}