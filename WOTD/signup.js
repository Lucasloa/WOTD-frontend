// server.js
const express = require('express');
const sql = require('mssql'); // Til Azure SQL forbindelse
const bodyParser = require('body-parser');
const cors = require('cors'); // Hvis din frontend er på en anden server

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Konfiguration til Azure SQL Database
const dbConfig = {
    user: 'your_username', // Dit Azure SQL brugernavn
    password: 'your_password', // Dit password
    server: 'your_server.database.windows.net', // Dit servernavn
    database: 'your_database_name', // Din database
    options: {
        encrypt: true, // Kryptering til Azure
        enableArithAbort: true
    }
};

// API route til sign-up
app.post('/api/signup', async (req, res) => {
    const { FName, Gender, Age, AvgPulse, Weight, Height, Username, Password } = req.body;

    try {
        // Opret forbindelse til databasen
        let pool = await sql.connect(dbConfig);

        // SQL INSERT-forespørgsel
        const query = `
            INSERT INTO Users (FName, Gender, Age, AvgPulse, Weight, Height, Username, Password)
            VALUES (@FName, @Gender, @Age, @AvgPulse, @Weight, @Height, @Username, @Password)
        `;

        // Udfør forespørgslen med brugerinput som parametre
        await pool.request()
            .input('FName', sql.NVarChar, FName)
            .input('Gender', sql.NVarChar, Gender)
            .input('Age', sql.Int, Age)
            .input('AvgPulse', sql.Int, AvgPulse)
            .input('Weight', sql.Decimal(10, 2), Weight)
            .input('Height', sql.Decimal(10, 2), Height)
            .input('Username', sql.NVarChar, Username)
            .input('Password', sql.NVarChar, Password) // Bemærk: Hash password i produktion
            .query(query);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
