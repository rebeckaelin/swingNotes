const {Router} = require("express");
const verifyToken = require("./Middleware/authMiddleware");
const {getNotes, createNote, changeNote} = require("./Functions/noteFunctions");
const notes = Router();

notes.get("/notes", verifyToken, async (req, res) => {
  try {
    const notes = await getNotes();
    res.status(200).json({currentNotes: notes});
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
});

notes.post("/notes/add", verifyToken, async (req, res) => {
  const {title, text} = req.body;
  try {
    const newNote = await createNote(title, text);
    res.status(201).json({message: "Note added successfully!", added: newNote});
  } catch (error) {
    if (error.message.includes("should not exceed")) {
      res.status(400).json({message: error.message});
    } else if (error.message.includes("already exists")) {
      res.status(409).json({message: error.message});
    } else {
      res.status(500).json({message: "Internal server error"});
    }
  }
});

notes.put("/notes/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const {title, text} = req.body;
  try {
    const updatedNote = await changeNote(id, title, text);
    if (updatedNote === 0) {
      res.status(404).json({message: `No note with ${id} found.`});
    } else if (updatedNote === "No changes made") {
      res.status(200).json({message: "No changes were necessary."});
    } else {
      res.status(200).json({message: "Note updated successfully!"});
    }
  } catch (error) {
    if (
      error.message.includes("should not exceed") ||
      error.message.includes("cannot be")
    ) {
      res.status(400).json({message: error.message});
    } else {
      res.status(500).json({message: "Internal server error"});
    }
  }
});

notes.delete("/notes", verifyToken, (req, res) => {
  // Logik för att ta bort en anteckning
});

module.exports = notes;
