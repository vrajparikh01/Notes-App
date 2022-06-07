const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the user notes using GET "api/notes/fetchnotes"
// Login required
router.get('/fetchnotes', fetchuser, async(req, res)=>{
    try {
        // we have to fetch notes from the user id
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal error occured");
    }
})

// ROUTE 2: Add a new note using POST "api/notes/addnote" 
// Login required
router.post('/addnote', fetchuser,[
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be at least 5 characters").isLength({ min: 5 }),],
    async(req, res)=>{
        try {
            // using destructuring method od JS
            const {title, description, tag} = req.body;

            // if there are errors, return error with a bad request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // New note object
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            // Saving the note
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Internal error occured");
        }
})

// ROUTE 3: Update an exixting note using PUT "api/notes/updatenote" 
// Login required
// We have to provide the id of the note, which we would like to update. 
router.put('/updatenote/:id', fetchuser, async(req, res)=>{
    const {title, description, tag} = req.body;

    try{

        // Creating a newNote
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note and update it
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }

        // matching exixting user id with the logged in user id
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json(note);
    } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Internal error occured");
}

})
    
// ROUTE 4: Delete existing note using DELETE: "api/notes/deletenote"
// Login required
router.delete('/deletenote/:id', fetchuser, async(req, res)=>{
    try {
        // If user owns this note then only he can delete
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }
    
        // matching exixting user id with the logged in user id
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not allowed");
        }
    
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success": "The note has been deleted", note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal error occured");
    } 
    
    })

module.exports = router;