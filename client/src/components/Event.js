import React, { useState } from "react";
import EventDataService from "../services/EventService";
import {auth, firestore} from "../firebase";

const Event = (props) => {
  const initialEventState = {
    key: null,
    eventOwnerId: null,
    title: "",
    description: "",
    like: false,
    likesCounter: 0
  };
  const uid = auth.currentUser.uid;
  let currentLikesCounter = 0;
  const [currentEvent, setCurrentEvent] = useState(initialEventState);
  const [currentUserReact, setCurrentUserReact] = useState(false);
  const [setMessage] = useState("");
  const db = firestore.collection(`/events`);

  const { Event } = props;
  if (currentEvent.id !== Event.id) {
    setCurrentEvent(Event);
    setMessage("");
  }

  firestore.collection(`reactions`).doc(`${currentEvent.id}`).collection(`users-reactions`).doc(`${auth.currentUser.uid}`).get()
        .then((user) => {
          const reacted = user?.data()?.reacted || false;
          setCurrentUserReact(reacted)
            console.log("Document successfully read!", user.data());
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
  };

  const updatelike = (status) => {
    setCurrentEvent(Event);
    setCurrentUserReact(status)
  firestore.collection(`reactions`).doc(`${currentEvent.id}`).collection(`users-reactions`).doc(`${auth.currentUser.uid}`).set({
    eventId: currentEvent.id,
    reacted: status,
        })
        .then((user) => {
            console.log("Document successfully written!", user);
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
      
        firestore.collection('events').get().then((snapshot) => {
          snapshot.docs.forEach(doc => {
              return doc;
          })
        })
        firestore.collection(`events`).doc(`${currentEvent.id}`).get()
              .then((currentEvent) => {
                  currentLikesCounter = currentEvent.data().likesCounter;
    
                  EventDataService.update(db, currentEvent.id, { like: status, likesCounter: status ? currentLikesCounter + 1 : currentLikesCounter - 1 })
                   .then(() => {
                       setCurrentEvent({ ...currentEvent, like: status, likesCounter: status ? currentLikesCounter + 1 : currentLikesCounter - 1 });
                       setMessage("The status was updated successfully!");
                    }).then((user) => {})
                     .catch((e) => {
                       console.log(e);
                     }); 

              }).catch((error) => {
                  console.error("Error writing document: ", error);
              });   
    
  };

  const updateEvent = () => {
    const data = {
      title: currentEvent.title,
      description: currentEvent.description,
    };

    EventDataService.update(db, currentEvent.id, data)
      .then(() => {
        setMessage("The Event was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteEvent = () => {
    EventDataService.remove(db, currentEvent.id)
      .then(() => {
        props.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentEvent ? (
        <div className="edit-form">
          <div className="main-h">
          <h4>Event</h4> {/* <h2>{currentEvent.likesCounter}</h2> */}
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentEvent.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentEvent.description}
                onChange={handleInputChange}
              />
            </div>

          </form>

          {currentUserReact ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatelike(false)}
            >
              dislike
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatelike(true)}
            >
              like
            </button>
          )}
        {uid === currentEvent.eventOwnerId ? ( 
        <>
        <button className="badge badge-danger mr-2" onClick={deleteEvent}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateEvent}
          >
            Update
          </button>

          </>
          ):(<div></div>)}
         
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Event...</p>
        </div>
      )}
    </div>
  );
};

export default Event;
