import React, { useEffect, useContext, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { Button, Modal } from "react-bootstrap";

const Notes = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
  };

  const handleClick = (e)=>{
    editNote(note.id, note.etitle, note.edescription, note.etag)
    refClose.current.click();
}

  const [note, setNote] = useState({id:"", etitle:"", edescription:"", etag:""});
  const onChange = (e)=>{
      setNote({...note, [e.target.name]: e.target.value})
  }

  return (
    <>
      <AddNote/>
      <Button variant="primary d-none" onClick={handleShow} ref={ref}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className='my-3'>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" onChange={onChange} value={note.etitle} minLength={3} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="edescription" name='edescription' onChange={onChange} value={note.edescription} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="etag" name='etag' onChange={onChange} value={note.etag}/>
        </div>
        
      </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} ref={refClose}>
            Close
          </Button>
          <Button disabled={note.etitle.length<3 || note.edescription.length<5} variant="primary" onClick={()=>{handleClose(); handleClick();}}>
            Update Note
          </Button>
        </Modal.Footer>
      </Modal>
      
      <div className="row my-3">
        <h2>Your notes</h2>
        <div className="container">
            {notes.length === 0 && "No notes to display"}
        </div>
        {notes.map((note) => {
          // passing the prop: note
          return (
            <NoteItem key={note._id} updateNote={updateNote} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
