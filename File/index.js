// IMPORT ::::::::::::::::::::::::::
const express = require('express');
const fs = require('fs'); // handle file operations
const path = require('path'); // file path handling

// ==========================================================================================

// express - framework for building APIs
const app = express();

// BODY - parses incoming JSON request bodies
app.use(express.json()); // RAW JSON

// File path for storing user data
const filePath = path.join(__dirname, 'database.json');

// Function to load users from the JSON file
function loadUsers() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data); 
    }
    return []; // Return an empty array if the file doesn't exist
}

// Function to save users to the JSON file
function saveUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8'); // Save users to the file
}

// ==========================================================================================

let users = loadUsers();

// ==========================================================================================

// routes::
// PATH ---------- here ['/'] represents the homepage or root of the API
app.get('/', (request, response) => {
    response.send('my 🖖 world');
});

// ==========================================================================================

// GET :::::::::::::
app.get('/myStorage.api/user', (req, res) => {
    res.json(users); // Send users data as JSON response
});

// POST :::::::::::::
app.post('/myStorage.api/user/create', (req, res) => {
    const newUser = {
        id: users.length + 1, // Simple ID increment
        name: req.body.name,
    };

    users.push(newUser); // Add the new user to the array
    saveUsers(users); // Save updated users to the file

    res.status(201).json(newUser); // Respond with the new user
});

// PUT ::::::::::::::
app.put('/myStorage.api/users/ChangeID/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    // If the user is not found, return 404
    if (!user) return res.status(404).send('User not found');

    // Update the user's name from the request body
    user.name = req.body.name;

    // Save updated users to the file
    saveUsers(users);

    // Respond with the updated user
    res.json(user);
});

// DELETE :::::::::::::
app.delete('/myStorage.api/users/DeleteName/:name', (req, res) => {
    const userName = req.params.name;

    // Find the index of the user by name
    const userIndex = users.findIndex((u) => u.name === userName);

    // If the user is not found, return a 404 error
    if (userIndex === -1) return res.status(404).send('User not found');

    const deletedUser = users.splice(userIndex, 1); // Remove user from the array

    // Save updated users to the file
    saveUsers(users);

    // Respond with the deleted user data
    res.json(deletedUser);
});

// ==========================================================================================

// define port no
const PORT = 3000;

// Start the Server ::::::
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ==========================================================================================
