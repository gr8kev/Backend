const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');





const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
});


app.get("/", (req, res) => {
    res.status(200).send("landing page");
});

// Attempt to connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    } else {
        console.log('Connected to database successfully!');
    }
});



// Define your Express routes and other server logic below
app.post(`/Signup`, (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received signup request with data:", { name, email, password });

    // Check if the email already exists in the database
    const checkEmailQuery = "SELECT * FROM login WHERE `email` = ?";
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.json("Error");
        }
        console.log("Result of checking email:", result);

        // If the email already exists, send a message indicating so
        if (result.length > 0) {
            console.log("Email already exists");
            return res.json("Email already exists, please login");
        }

        // If the email doesn't exist, proceed with signup
        const insertQuery = "INSERT INTO login (`name`, `email`, `password`) VALUES (?, ?, ?)";
        const values = [name, email, password];
        db.query(insertQuery, values, (err, data) => {
            if (err) {
                console.error("Error inserting new user:", err);
                return res.json("Error");
            }
            console.log("Signup successful");
            return res.json("Signup successful");
        });
    });
});




app.post(`/Login`, (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";

    db.query(sql, [req.body.email, req.body.password,], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json("success");
        }
        else {
            return res.json("Failed");
        }

    })
});



app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
