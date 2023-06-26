const express = require('express');
require('dotenv').config({ path: './config/.env' });
const app = express();
const dbConfig = require('./config/dbconfig');
const port = process.env.PORT || 4000;
const cors = require('cors');

// Connect to MongoDB database
const usersRoute = require('./routes/usersRoute');
const stationsRoute = require('./routes/stationsRoute');

app.use(express.json());

// set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const server = require('http').createServer(app);

app.use('/api/users', usersRoute);
app.use('/api/stations', stationsRoute);

// Render deployment
// const path = require('path');
// __dirname = path.resolve();
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '/client/build')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, "client", "build", "index.html"));
//     });
// }

server.listen(port, () =>
    console.log(`Server started on port ${port}`)
);