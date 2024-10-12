// IMPORT EXPERSS
const express = require('express');


// express - framework for building APIs
e = require('express');

// creates an instance of an Express application
// app == object is used to define routes, middleware, and the behavior of your API.
app = express();

// ==========================================================================================

// BODY - parses incoming JSON request bodie (from request body)
app.use(express.json()); // RAW JSON 
// app.use(express.urlencoded({ extended: true })); // FORM DATA 

// ==========================================================================================

// routes::
// PATH ---------- here ['/'] represents the homepage or root of the API
app.get('/', (request, response) => {
    response.send('my 🖖 world');
  });
//  sends the string "Hello, world!" as the response to the client.

// ==========================================================================================

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'leonardo' },
]

// ===========================================================================================

// GET :::::::::::::
app.get('/api/user', (req, res) => {
    res.json(users); // send data
  });

// POST :::::::::::::
app.post('/api/user/create', (req, res) => {
  const newUser = {
    id: users.length + 1, // Incremental ID
    name: req.body.name,
  };

  // Add the new user to the users array
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT ::::::::::::::
app.put('/api/users/ChangeID/:id', (req, res) => {
  // Parse the ID from the request parameters
  const userId = parseInt(req.params.id);
  
  const user = users.find((u) => u.id === userId); // Find the user by ID

  // If the user is not found, return 404
  if (!user) return res.status(404).send('User not found');

  // Update the user's name from the request body
  user.name = req.body.name;

  // Respond with the updated user
  res.json(user);
});


// DELETE :::::::::::::
app.delete('/api/users/DeleteName/:name', (req, res) => {
  // Get the name from the request parameters
  const userName = req.params.name;

  // Find the index of the user with the given name
  const userIndex = users.findIndex((u) => u.name === userName);

  // If the user is not found, return a 404 error
  if (userIndex === -1) 
    return res.status(404).send('User not found');

  // Remove the user from the array using splice and store the deleted user
  const deletedUser = users.splice(userIndex, 1);

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



// ============================= RUN SERVER ========================================

/*

ASYNC ------------- node index.js
SYNC  ------------- nodemon index.js 
{nodemon == IF WE MAKE ANY CHANGES IT AUTOMATICALLY REFLECT ON THE SERRVER / PAGE}

GET  ---- GET data
POST ---- CREATE data
PUT  ---- UPDATE data
DELETE -- REMOVE data

+ Every time I restart the server, my data lost ?????????? 
-------------------------------------------------------------------------
the array is re-initialized, and all previously added data is lost
you need to store the data externally
-- MongoDB (NoSQL)
-- MySQL or PostgreSQL (SQL)
*/