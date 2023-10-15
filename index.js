const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/',(req, res) => {
  res.status(200).send('Welcome to quiz app')
})

app.get('/questions', (req, res) => {
    res.status(200).json(questions);
});
  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




