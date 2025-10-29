const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');
const contractRoutes = require('./routes/contracts');
const viewRoutes = require('./routes/views');

dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/contracts', contractRoutes);
app.use('/contracts', viewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
