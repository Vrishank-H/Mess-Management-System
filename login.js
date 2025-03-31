const mysql = require("mysql2/promise");            // using promise-based MySQL2
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.json());

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Vrish-12', 
    database: 'student_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Handle login request for admin

/*app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, redirectUrl: 'mess-homepage.html' });   // Put another url instead to redirect to admin access page
        console.log('I am in Adnin login module');
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});*/


// API to fetch messes
app.get("/api/messes", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT mess_name AS name, vacant_seats FROM messes");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching messes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch student records
app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching student data:', err);
            res.status(500).send('Error fetching student data');
        } else {
            res.json(results);
        }
    });
});

// Fetch student registrations
app.get('/api/registrations', (req, res) => {
    const query = `SELECT * FROM registrations`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching registrations:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);
    });
});

//Add mess selection into registrations table 
app.post('/api/register-mess', async (req, res) => {
    console.log("✅ Received request at /api/register-mess");

    const { student_id, mess_name } = req.body;

    if (!student_id || !mess_name) {
        console.log("❌ Missing student ID or mess name");
        return res.status(400).json({ message: 'Missing student ID or mess name' });
    }

    console.log(`🔹 Student ID: ${student_id}, Mess Name: ${mess_name}`);

    try {
        const connection = await db.getConnection();

        // ✅ Step 1: Get the mess_id for the new mess
        const [newMessResults] = await connection.query(
            'SELECT mess_id, vacant_seats FROM messes WHERE mess_name = ?', [mess_name]
        );

        if (newMessResults.length === 0) {
            connection.release();
            console.log("❌ Mess not found in database");
            return res.status(404).json({ error: "Mess not found" });
        }

        const newMessId = newMessResults[0].mess_id;
        let newVacantSeats = newMessResults[0].vacant_seats;

        console.log(`✅ Found Mess ID: ${newMessId}, Vacant Seats: ${newVacantSeats}`);

        if (newVacantSeats <= 0) {
            connection.release();
            console.log("❌ No vacant seats available");
            return res.status(400).json({ error: "No vacant seats available" });
        }

        await connection.beginTransaction();

        // ✅ Step 2: Check if the student is already registered in another mess
        const [existing] = await connection.query(
            'SELECT mess_id FROM registrations WHERE student_id = ?', [student_id]
        );

        let previousMessId = null;
        if (existing.length > 0) {
            previousMessId = existing[0].mess_id;
        }

        // ✅ Step 3: If previously registered, increase vacant seats for old mess
        if (previousMessId) {
            console.log(`🔄 User was previously in Mess ID: ${previousMessId}, freeing a seat...`);
            await connection.query(
                'UPDATE messes SET vacant_seats = vacant_seats + 1 WHERE mess_id = ?', [previousMessId]
            );

            await connection.query(
                'DELETE FROM registrations WHERE student_id = ?', [student_id]
            );
        }

        // ✅ Step 4: Register the user in the new mess
        await connection.query(
            'INSERT INTO registrations (student_id, mess_id) VALUES (?, ?)', [student_id, newMessId]
        );

        // ✅ Step 5: Reduce vacant seats for the new mess
        await connection.query(
            'UPDATE messes SET vacant_seats = vacant_seats - 1 WHERE mess_id = ?', [newMessId]
        );

        await connection.commit();
        connection.release();

        console.log("✅ Registration completed successfully!");
        res.json({ message: "Registration successful", updatedVacantSeats: newVacantSeats - 1 });

    } catch (error) {
        console.error("❌ Database Error:", error);
        res.status(500).json({ error: "Database error during registration" });
    }
});


// Setting the route for /
app.get('/', (req, res) => {
    res.send('Welcome to the Mess Management System! 🚀');
});

function login() {
    const regNumber = document.getElementById("regNumber").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    const validUsers = [
        { regNumber: "2310037", password: "akshaj123" },
        { regNumber: "2310047", password: "vrishank123" },
        { regNumber: "2310885", password: "vamshi123" },
        { regNumber: "2310932", password: "dhruv123" }
    ];

    const user = validUsers.find(u => u.regNumber === regNumber && u.password === password);


    if (user) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("student_id", regNumber); // Store student ID
        console.log("Stored student_id:", regNumber); // Debugging
        window.location.href = "mess-homepage.html";
        return false;
    } else {
        errorMessage.textContent = "Invalid Registration Number or Password";
        return false;
    }
}

// Server listening
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
