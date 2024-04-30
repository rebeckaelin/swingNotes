const {Router} = require("express");
const {
  getNotes,
  createNote,
  changeNote,
  deleteNote,
  searchNote,
} = require("./Functions/noteFunctions");
const notes = Router();

notes.get("/notes", async (req, res) => {
  const userID = req.user.id;
  try {
    const notes = await getNotes(userID);
    res.status(200).json({currentNotes: notes});
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
});

notes.post("/notes", async (req, res) => {
  const {title, text} = req.body;
  const userID = req.user.id;
  try {
    const newNote = await createNote(title, text, userID);
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

notes.put("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const {title, text} = req.body;
  const userID = req.user.id;
  try {
    const updatedNote = await changeNote(id, title, text, userID);
    if (updatedNote === 0) {
      res.status(404).json({message: `No note with ${id} found.`});
    } else if (updatedNote === "No changes made") {
      res.status(200).json({message: "No changes were necessary."});
    } else {
      res
        .status(200)
        .json({message: "Note updated successfully!", updatedNote: id});
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

notes.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const userID = req.user.id;
  try {
    const result = await deleteNote(id, userID);
    if (result.deletedCount === 0) {
      res.status(404).json({message: `No note found with ID: ${id}.`});
    } else {
      res
        .status(200)
        .json({message: "Note successfully deleted.", deletedNoteID: id});
    }
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
});

notes.get("/notes/search", async (req, res) => {
  const title = req.query.title;
  const userID = req.user.id;

  try {
    const foundNote = await searchNote(title, userID);
    res.status(200).json(foundNote);
  } catch (error) {
    if (error.message.includes("No note found")) {
      res.status(404).json({message: error.message});
    } else if (error.message.includes("Title is required")) {
      res.status(400).json({message: error.message});
    } else {
      res.status(500).json({message: "Internal server error"});
    }
  }
});

module.exports = notes;
