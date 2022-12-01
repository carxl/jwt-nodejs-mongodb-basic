import mongoose from "mongoose";

mongoose.connect('mongodb://localhost/simplejwt', {
    useNewUrlParser: true,
}).then(db=>console.log('Database is connected'))