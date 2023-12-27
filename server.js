const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // Require the 'fs' module for file operations
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

const timeZone = 'Europe/Kiev';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer transporter setup (replace with your SMTP configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testfeedback850@gmail.com',
        pass: 'vvfl swbr rwxb vbqp'
    }
});

// API route
app.post('/submit-form', async (req, res) => {
    // Access form data from req.body
    const { topic, message, email, phone, history, agree } = req.body;

    try {
        // Process the data as needed (e.g., save to a database)

        // For now, just log the data
        console.log('Received form data:');
        console.log('Тема звернення:', topic);
        console.log('Текст звернення:', message);
        console.log('Електронна пошта:', email);
        console.log('Телефон:', phone);
        console.log('Тип звернення:', history);
        console.log('Згода з умовами:', agree);

        // Save the form data to a JSON file
        const formData = {
            topic,
            message,
            email,
            phone,
            history,
            agree,
            timestamp: new Date().toLocaleString('en-US', { timeZone }) // Add a timestamp for reference
        };

        // Specify the path to the JSON file
        const filePath = path.join(__dirname, 'data.json');

        // Read existing data from the file (if any)
        let existingData = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            existingData = JSON.parse(fileContent);
        }

        // Add the new form data to the existing data
        existingData.push(formData);

        // Write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');

        // Send a success response back to the client
        res.json({ message: 'Form submitted successfully!' });

        // Send feedback email to the user
        const feedbackMessage = `
            Дякую за ваше звернення, воно вже в обробці. Чекайте на повідомлення від працівника.

            Інформація про ваше повідомлення:
            Тема звернення: ${topic}
            Текст звернення: ${message}
            Електронна пошта: ${email}
            Телефон: ${phone}
            Тип звернення: ${history}
            Згода з умовами: ${agree}
            
            Якщо це були не Ви зверніться до служби підтримки,
            з повагою Vladyslav Nesterov
        `;

        const mailOptions = {
            from: 'testfeedback850@gmail.com',
            to: email,
            subject: 'Дякуємо за звернення!',
            text: feedbackMessage
        };

        await transporter.sendMail(mailOptions);
        console.log('Feedback email sent to:', email);
    } catch (error) {
        console.error('Error processing form data:', error);
        // Send an error response back to the client
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve the single-page application for all other routes
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root URL
app.get('/', (req, res) => {
    // Assuming your HTML file is named "index.html"
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
