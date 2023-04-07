//API Endpoint
const projectData = {};

//Import all the required dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

//Declare the port to be used by the server
const port = 3000;

//Instantiate express app
const app = express();

//Use middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

//Define the routes and its handlers
app.get('/entries', (req, res) => {
    res.send(projectData);
})
app.post('/entries', (req, res) => {
    const reqData = req.body;
    projectData[reqData.date] = reqData;
    res.status(201).send({
        status: 201, 
        message: 'Entry Created!',
    })
})
app.get('/cors', (req, res) => {
    let url = ''
    for(let key in req.query) {
        url = url.concat(`${key}=${req.query[key]}&`);
    }
    url = url.substring(4, url.length - 1);
    if(!url) {
        res.status(400).send({
            status: '400',
            message: 'Please send a valid url!'
        })
        return;
    }
    axios.default.get(url)
        .then(axiosRes => {
            if(axiosRes.status != 200) {
                res.status(axiosRes.status).send({
                    status: axiosRes.status,
                    message: axiosRes.statusText
                })
                return;
            }
            res.status(200).send({
                status: 200,
                data: axiosRes.data
            })
        })
        .catch(err => {
            const errObj = err.toJSON();
            res.status(500).send({
                status: 500,
                message: errObj.message
            })
        })
})

//Start the server.
app.listen(port, () => {
   console.log( `Server started! Running on port ${port}`);
});




