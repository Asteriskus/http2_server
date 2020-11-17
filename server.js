const Server = require('./index');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const options = {
    key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))
};

const app = new Server(options);

const getRoutes = {
    '/': (req, res) => {
        return res.send(`<h1>Hello from / ${PORT}</h1>`)
    },
    '/as': (req, res) => {
        const obj = {
            name: 'Alex Bormotov',
            age: '23',
        };
        return res.send(obj);
    }
};

app.get(getRoutes);

app.listen(PORT, () => console.log('Server is running'));