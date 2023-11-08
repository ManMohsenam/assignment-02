// Define all require dependancy
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());

// Static Files
app.use(express.static('public'));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'client', 'views'));

const routes = require('./api/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));