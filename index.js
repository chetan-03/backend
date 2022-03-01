const express = require('express');
var cors = require('cors')
const connectToMongo = require('./db.js')
const app = express();

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

app.listen(process.env.PORT || 2000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
