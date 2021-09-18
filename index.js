const express = require('express');
var cors = require('cors')
const connectToMongo = require('./db.js')
const app = express();
const port = 8000
connectToMongo();
require('dotenv').config();
//  To get api calls in fornt end
app.use(cors())
app.use(express.json())
// Available Routes
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`iNotebook app listening at http://localhost:${port}`)
});
