const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets')));  // Serve static files like CSS, images, etc.

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gym-application-form')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve the HTML file (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Make sure index.html exists here
});

// Define a schema for the application form
const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    membershipType: { type: String, required: true }
});

// Create a model based on the schema
const Application = mongoose.model('Application', applicationSchema);

// POST route to handle form submission
app.post('/apply', async (req, res) => {
    const { name, email, phone, membershipType } = req.body;

    const newApplication = new Application({
        name,
        email,
        phone,
        membershipType
    });

    try {
        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Error saving application.' });
    }
});

// 404 Route - Handle undefined routes
app.use((req, res) => {
    res.status(404).send('404: Page Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
