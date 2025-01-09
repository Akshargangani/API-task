


const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "admin";

// Middleware
app.use(express.json());

let db, users;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all users
app.get('/users', async (req, res) => {
    try {
        const allusers = await users.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }   
});

// POST: Add a new student
app.post('/users', async (req, res) => {
    try {
        // console.log("Request object: ",req)
        // console.log("Request body:",req.body)
        const newStudent = req.body;
        const result = await users.insertOne(newStudent);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

// PUT: Update a student completely
// app.put('/users/:name', async (req, res) => {
//     try {
//         // console.log("Request params: ",req.params)
//         // console.log("Request body:",req.body)
//         const name = parseInt(req.params.name);
//         const updatedStudent = req.body;
//         const result = await users.replaceOne({ name }, updatedStudent);
//         res.status(200).send(`${result.modifiedCount} document(s) updated`);
//     } catch (err) {
//         res.status(500).send("Error updating student: " + err.message);
//     }
// });


app.put('/users/:name', async (req, res) => {
    try {
        const name = req.params.name; // Extract the name from the route parameter
        const updatedData = req.body; // Extract updated fields from the request body

        // Ensure there is data to update
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).send("No data provided to update.");
        }

        // Perform the update operation
        const result = await users.updateOne(
            { name: name }, // Query: match the document by the "name" field
            { $set: updatedData } // Update: only modify the specified fields
        );

        // Check if a document was matched and modified
        if (result.matchedCount === 0) {
            return res.status(404).send(`User with name "${name}" not found.`);
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated.`);
    } catch (err) {
        // Handle any errors that occur during the update process
        res.status(500).send("Error updating user: " + err.message);
    }
});




// PATCH: Partially update a student
app.patch('/users/:name', async (req, res) => {
    try {
        const name = (req.params.name);
        const updates = req.body;
        const result = await users.updateOne({ name }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a student
// app.delete('/users/:name', async (req, res) => {
//     try {
//         console.log(req.params.name);
//         const NAme = (req.params.name);
//         console.log(NAme);
//         const result = await users.deleteOne({ NAme });
//         res.status(200).send(`${result.deletedCount} document(s) deleted`);
//     } catch (err) {
//         res.status(500).send("Error deleting student: " + err.message);
//     }
// });


app.delete('/users/:name', async (req, res) => {
    try {
        console.log(req.params);
        const name = req.params.name; 
        console.log({name})
        const result = await users.deleteOne({ name:name });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
}
});
