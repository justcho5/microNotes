import React, { useEffect } from "react";
import { NotesTable } from "../components/NotesTable";
import noteService from "../services/notes";
import { useState } from "react";
import { useStore } from "../store";
export const Community = () => {
  const { user, updateUser, updateErrorMessage, notes, updateNotes } =
    useStore();
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    // setNotes([{ ...responseBody, user: { name: user.name } }, ...notes]);

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        updateNotes(
          notes.map((note) => (note.id !== id ? note : returnedNote))
        );
      })
      .catch((error) => {
        if (error.error === "token expired") {
          updateUser(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
        updateErrorMessage(error.error);
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);
      });
  };
  const deleteNote = (id) => {
    noteService
      .remove(id)
      .then(() => {
        updateNotes(notes.filter((note) => note.id !== id));
      })
      .catch((error) => {
        updateErrorMessage(error.error);
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);

        if (error.error === "token expired") {
          updateUser(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
      });
  };
  // Add note handler
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then((responseBody) => {
        updateNotes([{ ...responseBody, user: { name: user.name } }, ...notes]);
      })
      .catch((error) => {
        updateErrorMessage(error.error);
        setTimeout(() => {
          updateErrorMessage(null);
        }, 5000);

        if (error.error === "token expired") {
          updateErrorMessage(null);
          noteService.setToken(null);
          window.localStorage.removeItem("loggedNoteappUser");
        }
      });
  };
  return (
    <div>
      <NotesTable
        notes={notes}
        toggleImportanceOf={toggleImportanceOf}
        deleteNote={deleteNote}
        addNote={addNote}
        canDelete={false}
      />
    </div>
  );
};
