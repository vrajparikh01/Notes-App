import React from 'react';
import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';

function About() {
  const a = useContext(noteContext);
  return (
    <div>
      About {a.name} and age is {a.age}
    </div>
  )
}

export default About
