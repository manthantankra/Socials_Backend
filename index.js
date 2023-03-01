const dotenv = require('dotenv');
const express = require('express') ;
const mongoose = require('mongoose') ;
const AuthRoute = require('./routes/AuthRoute.js') ;
const userRoute = require('./routes/userRoute.js');
const postRoute = require('./routes/postRoute.js') ;
const cors = require('cors') ;
const UploadRoute = require('./routes/uploadFile.js'); 

dotenv.config();
const port = process.env.PORT || 4000;

const app = express();

// To serve images to the public
app.use(express.static('public'));
app.use('/images', express.static("images"));

// middleware
app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log(`DB GOT CONNECTED`);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}..`);
        });
    })
    .catch((error) => console.log(error));

// routes

app.use('/hello', (req, res) => {
    res.send('Social Media Backend');
})

app.use('/auth', AuthRoute);
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/upload', UploadRoute);