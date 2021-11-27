// configuracao inicial
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userAccountController = require('./UserAccount/userAccountController');

// mongodb connection settings
const mongoDbHost = process.env.MONGODB_HOST;
const mongoDbPort = process.env.MONGODB_PORT;
const mongoDbName = process.env.MONGODB_NAME;
const mongoDbUser = process.env.MONGODB_USER;
const mongoDbPassword = encodeURIComponent(process.env.MONGODB_PASSWORD);
const connectionString = `mongodb://${mongoDbUser}:${mongoDbPassword}@${mongoDbHost}:${mongoDbPort}/${mongoDbName}`;

// configuring express to read json messages
const api = express();
api.use(express.urlencoded({extended: true}));
api.use(express.json());
api.use('/user-account', userAccountController);

// start API
mongoose.connect(connectionString).then( () => {
    console.log('Conectamos ao mongodb!');
    api.listen(3000);
}).catch( (error) => {
    console.log(`Erro inesperado. Causa: ${error}`);
});

