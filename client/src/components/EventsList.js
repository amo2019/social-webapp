import React, { useState, useContext,useCallback} from "react";
import { useHistory } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import EventDataService from "../services/EventService";
import {auth, firestore} from "../firebase";
import {Modal} from "../App"
import Event from "./Event";
import {isShownContext} from "../contexts/ShownContext"

const EventsList =  (props) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  let history = useHistory();

  const { shownChange, setShownChange } = useContext(isShownContext);
  const [search, setSearch] = useState("");
  const onSetSearch = useCallback(
    (search) => {
      setSearch(search.toLocaleLowerCase());
    },
    [setSearch]
  );
  const uid = auth.currentUser.uid;
  const db = firestore.collection(`/events`);
  const [Events, loading, error] =  useCollection(EventDataService.getAll(db).orderBy("title", "asc"));
 
  const refreshList = () => {
    setCurrentEvent(null);
    setCurrentIndex(-1);
  
  };

  const setActiveEvent = (Event, index) => {
    const { eventOwnerId, title, description, like, likesCounter } = Event.data();
    
    setShownChange(!shownChange);
    setCurrentEvent({
      eventOwnerId,
      id: Event.id,
      title,
      description,
      like,
      likesCounter,
    });

  };

  function chatRoom(Event, index){
    setCurrentIndex(index);
    const { eventOwnerId} = Event.data();
    history.push("/joinevent", {
       eventOwnerId,
       uid,
       currentEvent: Event.data().title,
   } ); 
  }

  const handleShownChange =()=>{
    setShownChange(!shownChange);
  }

  return (
    <div className="list row">
        <div className="">
        <input
        type="text"
        placeholder="Search.."
        value={search}
        onChange={(evt) => onSetSearch(evt.target.value)}
        className="search p-2 text-xl  rounded-lg max-w-md w-96"
        />
       </div>
      <div className="col-md-6">
        <div className={"main-h"}>
        <h5>Events List</h5> <h5>click on an Event</h5>
        </div>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Loading...</span>}
        <ul className="list-group">
          { !loading &&
            Events && (Events?.docs ?? []).filter(
              (event) =>
                event.data().title.toLocaleLowerCase() 
                  .includes(search) || event.data().description
                  .toLocaleLowerCase()
                  .includes(search)).map((Event, index) => ( /* Events.map */
              <li
                
                className={"list-group-item " + (index === currentIndex ? "active" : "")}
                onClick={() => setActiveEvent(Event, index)}
                key={Event.id}
              >
            <h3 > { Event.data().title }</h3>
            <h3 style={{color:"green"}}>👍️({Event.data().likesCounter})</h3>
            <button
              key={Event.id}
              className="badge badge-primary mr-2"
              onClick={() => chatRoom(Event, index)}
            >
              Ener chat Room
            </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="col-md-6">
        {currentEvent && shownChange ? (
          <Modal hide={props.hide}><Event Event={currentEvent} refreshList={refreshList} currentEvent={currentEvent} />  <button style={{display:"inline-block"}} onClick={handleShownChange}>Close</button></Modal>
          
        ) : (
          <div>
            <p>Please click on an Event...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
