


const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbsubscriptionId = "admin";

// Middleware
app.use(express.json());

let db, subscriptions;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbsubscriptionId);
        subscriptions = db.collection("subscriptions");

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

// GET: List all subscriptions
app.get('/subscriptions', async (req, res) => {
    try {
        const allusers = await subscriptions.find().toArray();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).send("Error fetching subscriptions: " + err.message);
    }   
});

// POST: Add a new student
app.post('/subscriptions', async (req, res) => {
    try {
        // console.log("Request object: ",req)
        // console.log("Request body:",req.body)
        const newStudent = req.body;
        const result = await subscriptions.insertOne(newStudent);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

// PUT: Update a student completely
// app.put('/subscriptions/:subscriptionId', async (req, res) => {
//     try {
//         // console.log("Request params: ",req.params)
//         // console.log("Request body:",req.body)
//         const subscriptionId = parseInt(req.params.subscriptionId);
//         const updatedStudent = req.body;
//         const result = await subscriptions.replaceOne({ subscriptionId }, updatedStudent);
//         res.status(200).send(`${result.modifiedCount} document(s) updated`);
//     } catch (err) {
//         res.status(500).send("Error updating student: " + err.message);
//     }
// });


app.put('/subscriptions/:subscriptionId', async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId; // Extract the subscriptionId from the route parameter
        const updatedData = req.body; // Extract updated fields from the request body

        // Ensure there is data to update
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).send("No data provided to update.");
        }

        // Debugging logs
        console.log("Request parameter subscriptionId:", subscriptionId);
        console.log("Update query:", { subscriptionId: subscriptionId });
        console.log("Update data:", updatedData);

        // Perform the update operation
        const result = await subscriptions.updateOne(
            { subscriptionId: subscriptionId }, // Query: match the document by the "subscriptionId" field
            { $set: updatedData } // Update: only modify the specified fields
        );

        // Check if a document was matched and modified
        if (result.matchedCount === 0) {
            return res.status(404).send(`Video with subscriptionId "${subscriptionId}" not found.`);
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated.`);
    } catch (err) {
        // Handle any errors that occur during the update process
        res.status(500).send("Error updating video: " + err.message);
    }
});




// // PATCH: Partially update a student
// app.patch('/subscriptions/:subscriptionId', async (req, res) => {
//     try {
//         const subscriptionId = (req.params.subscriptionId);
//         const updates = req.body;
//         const result = await subscriptions.updateOne({ subscriptionId }, { $set: updates });
//         res.status(200).send(`${result.modifiedCount} document(s) updated`);
//     } catch (err) {
//         res.status(500).send("Error partially updating student: " + err.message);
//     }
// });


app.patch('/subscriptions/:subscriptionId', async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId; // Extract the subscriptionId from the route parameter
        const updates = req.body; // Extract the updates from the request body

        // Debugging logs
        console.log("Updating user with subscriptionId:", subscriptionId);
        console.log("Updates:", updates);

        // Ensure updates are not empty
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).send("No updates provided.");
        }

        // Perform the update operation
        const result = await subscriptions.updateOne(
            { subscriptionId: subscriptionId }, // Query: match the document by the subscriptionId field
            { $set: updates } // Update: set the provided fields
        );

        // Check if a document was matched and modified
        if (result.matchedCount === 0) {
            return res.status(404).send(`User with subscriptionId "${subscriptionId}" not found.`);
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating user: " + err.message);
    }
});






// DELETE: Remove a student
// app.delete('/subscriptions/:subscriptionId', async (req, res) => {
//     try {
//         console.log(req.params.subscriptionId);
//         const subscriptionId = (req.params.subscriptionId);
//         console.log(subscriptionId);
//         const result = await subscriptions.deleteOne({ subscriptionId });
//         res.status(200).send(`${result.deletedCount} document(s) deleted`);
//     } catch (err) {
//         res.status(500).send("Error deleting student: " + err.message);
//     }
// });


app.delete('/subscriptions/:subscriptionId', async (req, res) => {
    try {
        console.log(req.params);
        const subscriptionId = req.params.subscriptionId; 
        console.log({subscriptionId})
        const result = await subscriptions.deleteOne({ subscriptionId:subscriptionId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
}
});