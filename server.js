const Server = require('./index');
const Request = require('./lib/request');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://ayrtmhor:uadbE8cDUNDBxqZuAZxL45978yrMe-BS@satao.db.elephantsql.com:5432/ayrtmhor';
const PORT = 3000;

const options = {
    key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))
};

const app = new Server(options);
const request = new Request(connectionString);

const getRoutes = {
    '/': (req, res) => {
        return res.send(`<h1>Hello from / ${Math.round(process.memoryUsage().heapUsed) }</h1>`)
    },
    '/as': (req, res) => {
        request.execute('SELECT * FROM test')
        .then(result => {
            res.send(result);
        });
    }
};

const postRoutes = {
    '/auth': (req, res) => {
        console.log(req.body);
        res.send('hi');
    }
};

app.get(getRoutes);
app.post(postRoutes);

app.listen(PORT, () => console.log('Server is running'));