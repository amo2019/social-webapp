import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import AddEvent from "./components/AddEvent";
import EventsList from "./components/EventsList";
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import JoinEvent from "./components/JoinEvent"
import {auth} from "./firebase";
import {ShownProvider} from "./contexts/ShownContext"


export const ToggleContent = ({ content }) => {

  return (
    <React.Fragment>
      {/* {!shownChange && content(hide)}
      {shownChange && content(show)} */}
    </React.Fragment>
  );
}

export const Modal = ({ children }) => (
  ReactDOM.createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  )
);

function App() {
  const [user] = useAuthState(auth);
  return (
    <div>
      <ShownProvider>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to={"/Events"} className="navbar-brand">
      Events-App
            </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/Events"} className="nav-link">
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
        <SignOut />
      </nav>
      <section>
        {user ? <div className="container mt-3">
        
        <Switch>
          <Route exact path={["/", "/events"]} component={EventsList} />
          <Route exact path="/add" component={AddEvent} />
          <Route exact path="/joinevent" component={JoinEvent} />
        </Switch>
      
      </div> : <SignIn />}
      </section>
     {/* < JoinEvent /> */}
     <ToggleContent
      content={hide => (
        <Modal />
      )}
    />
    </ShownProvider> 
    </div>
  );
}

export default App;