const nedb = require("nedb-promise");

const db = new nedb({filename: "Database/notes.db", autoload: true});

const getNotes = (userID) => {
  return db.find({user: userID});
};

const createNote = async (title, text, userID) => {
  if (title.length > 50) {
    throw new Error("Title should not exceed 50 characters");
  }
  if (text.length > 300) {
    throw new Error("Text should not exceed 300 characters");
  }
  const checkTitle = await db.find({title: title, user: userID});
  if (checkTitle.length > 0) {
    throw new Error(
      `a title with [${title}] already exists, choose another title.`
    );
  }
  const date = new Date().toLocaleString();

  const note = {
    title: title,
    text: text,
    createdAt: date,
    modifiedAt: date,
    user: userID,
  };
  return db.insert(note);
};

const changeNote = async (id, newTitle, newText, userID) => {
  if (
    id === null ||
    typeof id === "undefined" ||
    newTitle === null ||
    typeof newTitle === "undefined" ||
    newText === null ||
    typeof newText === "undefined"
  ) {
    throw new Error(
      "Invalid input: id, title, or text cannot be null or undefined."
    );
  }

  const currentTime = new Date().toLocaleString();

  const checkNote = await db.findOne({_id: id, user: userID});
  if (checkNote && newTitle === checkNote.title && newText === checkNote.text) {
    return "No changes made";
  } else {
    if (newTitle.length > 50) {
      throw new Error("Title should not exceed 50 characters");
    }
    if (newText.length > 300) {
      throw new Error("Text should not exceed 300 characters");
    }
    const updateNote = await db.update(
      {_id: id},
      {
        $set: {
          title: newTitle,
          text: newText,
          modifiedAt: currentTime,
        },
      },
      {}
    );
    return updateNote;
  }
};

const deleteNote = async (id, userID) => {
  const numRemoved = await db.remove({_id: id, user: userID}, {});
  return {deletedCount: numRemoved};
};

module.exports = {getNotes, createNote, changeNote, deleteNote};
