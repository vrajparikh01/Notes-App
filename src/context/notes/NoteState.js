import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=>{
    const host = "http://localhost:5000";
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial);

      const getNotes = async()=>{
        // API call 
        const response = await fetch(`${host}/api/notes/fetchnotes`, {
            method: 'GET', 
            
            headers: {
              'Content-Type': 'application/json',
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NzliOWI5YmM5MGMxOWVkODUyYzc1In0sImlhdCI6MTY1MjAyOTY4OH0.76JnWZLWDntyDbO1spbbyzLI9Uo9wgLG8jRzlAfe_Q0"
            },
          });
          const json = await response.json();
          setNotes(json);
      }

      // Add a note
      const addNote = async(title, description, tag)=>{
        // API call 
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST', 
            
            headers: {
              'Content-Type': 'application/json',
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NzliOWI5YmM5MGMxOWVkODUyYzc1In0sImlhdCI6MTY1MjAyOTY4OH0.76JnWZLWDntyDbO1spbbyzLI9Uo9wgLG8jRzlAfe_Q0"
            },
            body: JSON.stringify({title, description, tag})
          });
          const note =  await response.json();
        // concat adds the value in array ywhile push updates the array
        setNotes(notes.concat(note));
      }

    // Delete a note
    const deleteNote = async(id)=>{
        // API call 
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE', 
            
            headers: {
              'Content-Type': 'application/json',
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NzliOWI5YmM5MGMxOWVkODUyYzc1In0sImlhdCI6MTY1MjAyOTY4OH0.76JnWZLWDntyDbO1spbbyzLI9Uo9wgLG8jRzlAfe_Q0"
            },
          });
          const json =  response.json(); 
        const newNotes = notes.filter((note)=>{return note._id!==id});
        setNotes(newNotes)
    }

    // Edit a note
    const editNote = async(id, title, description, tag)=>{
        // API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT', 
            
            headers: {
              'Content-Type': 'application/json',
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI3NzliOWI5YmM5MGMxOWVkODUyYzc1In0sImlhdCI6MTY1MjAyOTY4OH0.76JnWZLWDntyDbO1spbbyzLI9Uo9wgLG8jRzlAfe_Q0"
            },
            
            body: JSON.stringify({title, description, tag})
          });
          const json = await response.json(); 

          let newNotes = JSON.parse(JSON.stringify(notes))
          for (let index = 0; index < notes.length; index++) {
              const element = newNotes[index];
              if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
              } 
          }
          setNotes(newNotes);
    }

    return (
        // export notes and also add, edit and delete notes so that we can update notes whenever we want
        <NoteContext.Provider value={{notes, addNote, editNote, deleteNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;