const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser.js');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// router 4: GET request: retriving all notes of logged in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        const usernotes = await notes;
        res.json(usernotes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server error occured!')
    }
})

// router 5: POST request: adding all notes to logged-in user
router.post('/addnote', fetchuser, [
    body('title', 'Enter title of atleast 3 charecters').isLength({ min: 3 }),
    body('description', 'description should be atleast 5 charecters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const savednnote = await note.save();
        res.json(savednnote)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server error occured!')
    }

})

// router 6: Put request: update existing notes of logged in user
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send('Not Found!') }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server error occured!')
    }

});
// router 6: Put request: update existing notes of logged in user
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send('Not Found!') }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ Success: "Note Deleted Successful", note });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server error occured!')
    }
});
module.exports = router;