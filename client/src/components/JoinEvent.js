import React, { useRef, useState } from 'react';
import './JoinEvent.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from "firebase/app";
import {auth, firestore} from "../firebase";
import 'firebase/firestore';

function JoinEvent(props) {
 const {
    uid,
    currentEvent,
    eventOwnerId
  } = props.location.state;
    const dummy = useRef();
    const db = firestore.doc(`events/${currentEvent}`);
    const usersRef = firestore.collection(`users/${uid}/comments`);
  
    const commentsRef = firestore.collection(`events/${eventOwnerId}/${currentEvent}`);
    const query = commentsRef.orderBy('createdAt').limit(30);
    const [comments] = useCollectionData(query, { idField: 'id' });
    db.collection('events').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        return doc;
    })
  })
  
  
    
  
    const [formValue, setFormValue] = useState('');
   
  
    const sendComment = async (e) => {
      e.preventDefault();
  
      const { uid, photoURL } = auth.currentUser;
  
      await commentsRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        eventOwnerId,
        currentEvent,
        photoURL,
        like: false,
        likesCounter: 0
      })
  
      await usersRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        eventOwnerId,
        currentEvent,
        photoURL,
        like: false
      })
      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  
    return (<>
           <h4>Please be nice to our comunity..</h4>
      <main>
         
        {comments && comments.map(msg => <ChatComment key={msg.id} comment={msg} />)}
  
        <span ref={dummy}></span>
  
      </main>
  
      <form onSubmit={sendComment}>
  
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
  
        <button type="submit" disabled={!formValue}>tweet it 🐥️</button>
  
      </form>
  
    </>)
  }
  
  
  function ChatComment(props) {
    const { text, uid, photoURL } = props.comment;
  
    const commentClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`comment ${commentClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="User account" />
        <p>{text}</p>
      </div>
    </>)
  }
  
  export default JoinEvent;