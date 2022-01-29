const http = require('http');
const express = require('express');
const cors = require('cors');

const Server = express();
const HTTP = new http.Server(Server);

Server.use(cors());

Server.get('/test', (req: any, res: any) => {
    res.status(200).send('success!')
});

HTTP.listen(9001, () => {
    console.log('listening on *:9001');
});