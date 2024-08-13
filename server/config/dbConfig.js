const mongoose = require('mongoose');

//const username = encodeURIComponent("kmohank428")
//const password = encodeURIComponent("mohan428451");


mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log('Mongo DB Connection Successfull')
})

db.on('error', (err) => {
    console.log('Mongo DB Connection failed');
})

module.exports = db;