// IMPORT ::::::::::::::::::::::::::
const express = require('express');
const mongoose = require('mongoose');

// express - framework for building APIs
const app = express();

// BODY - parses incoming JSON request bodies
app.use(express.json()); // RAW JSON

// ==========================================================================================

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB...');
}).catch(err => {
    console.error('Could not connect to MongoDB...', err);
});

// Define User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// ==========================================================================================

// routes::
// PATH ---------- here ['/'] represents the homepage or root of the API
app.get('/', (request, response) => {
    response.send('my 🖖 world');
});

// ==========================================================================================

// GET :::::::::::::
app.get('/mongo/api/user', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from the database
        res.json(users); // send data
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST :::::::::::::
app.post('/mongo/api/user/create', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
    });

    try {
        const savedUser = await newUser.save(); // Save the new user to the database
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// PUT ::::::::::::::
app.put('/mongo/api/users/ChangeID/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId); // Find user by ID

        // If the user is not found, return 404
        if (!user) return res.status(404).send('User not found');

        // Update the user's name from the request body
        user.name = req.body.name;

        // Save the updated user
        const updatedUser = await user.save();

        // Respond with the updated user
        res.json(updatedUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE :::::::::::::
app.delete('/mongo/api/users/DeleteName/:name', async (req, res) => {
    const userName = req.params.name;

    try {
        const deletedUser = await User.findOneAndDelete({ name: userName }); // Find and delete user by name

        // If the user is not found, return a 404 error
        if (!deletedUser) return res.status(404).send('User not found');

        // Respond with the deleted user data
        res.json(deletedUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ==========================================================================================

// define port no
const PORT = 3000;

// Start the Server ::::::
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ==========================================================================================
