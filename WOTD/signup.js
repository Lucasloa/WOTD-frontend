
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server.database.windows.net',
    database: 'your_database_name',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

app.post('/api/signup', async (req, res) => {
    const { FName, Gender, Age, AvgPulse, Weight, Height, Username, Password } = req.body;

    try {
        let pool = await sql.connect(dbConfig);

        const query = `
            INSERT INTO Users (FName, Gender, Age, AvgPulse, Weight, Height, Username, Password)
            VALUES (@FName, @Gender, @Age, @AvgPulse, @Weight, @Height, @Username, @Password)
        `;

        await pool.request()
            .input('FName', sql.NVarChar, FName)
            .input('Gender', sql.NVarChar, Gender)
            .input('Age', sql.Int, Age)
            .input('AvgPulse', sql.Int, AvgPulse)
            .input('Weight', sql.Decimal(10, 2), Weight)
            .input('Height', sql.Decimal(10, 2), Height)
            .input('Username', sql.NVarChar, Username)
            .input('Password', sql.NVarChar, Password)
            .query(query);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
