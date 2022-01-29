import { handleLogin } from "./login/login";

const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Server = express();
const HTTP = new http.Server(Server);

Server.use(cors());
Server.use(bodyParser.json());

Server.post('/login', async (req: any, res: any) => {
    handleLogin(req, res);
});

HTTP.listen(9001, () => {
    console.log('listening on *:9001');
});