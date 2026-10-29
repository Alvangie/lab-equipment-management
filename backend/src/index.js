const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Lab Equipment Management API is running successfully' 
    });
});


sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully via Sequelize.');
        return sequelize.sync(); 
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });