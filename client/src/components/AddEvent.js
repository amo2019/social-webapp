import React, { useState } from "react";
import EventDataService from "../services/EventService";
import {auth, firestore} from "../firebase";

const AddEvent = () => {
  const initialEventState = {
    eventOwnerId: null,
    title: "",
    description: "",
    like: false,
    likesCounter: 0

  };

  const [Event, setEvent] = useState(initialEventState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    flag1: false,
    event: "",
    description: "",
  });

  const styles = {
    fontSize: 15,
    marginTop: "2px",
    paddingTop: "2px",
    color: "red",
    alignSelf: "center",
  };

  const uid = auth.currentUser.uid;
  const handleInputChange = event => {
    const { name, value } = event.target;
    setEvent({ ...Event, [name]: value });
  };

  const saveEvent = () => {
    var data = {
      eventOwnerId: uid,
      title: Event.title,
      description: Event.description,
      like: false,
      likesCounter: 0
    };

    if (Event.title.length < 1 || Event.description.length < 1) {
      setErrors({
        ...errors, flag1: true, event: "both Event Name & description are required",
      });
      
      setTimeout(() => {
        setErrors({
          ...errors, flag1: false, event: "",
        });
      }, 1000);
      return;
    } else {
      setErrors({
        ...errors, flag1: false, event: "",
      });
    }

    const db = firestore.collection(`events`);

    EventDataService.create(db, data)
      .then(() => {
        setSubmitted(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newEvent = () => {
    setEvent(initialEventState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newEvent}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              placeholder="Add your public event"
              value={Event.title}
              onChange={handleInputChange}
              name="title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              className="form-control text-area"
              id="description"
              required
              placeholder="describe your event"
              value={Event.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>
          {errors.flag1 && (
                <label style={styles}>both Event and description are required!</label>
              )}
          <button onClick={saveEvent} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEvent;
