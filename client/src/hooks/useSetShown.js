import { useState } from "react";
function useSetShown(newState) {
  // call useState, "reserve piece of state"
  const [newstate, setNewState] = useState(false);
  const setShown = (newState) => {
    setNewState(newState);
  };
  // return piece of state AND a function to change it
  return [newstate, setShown];
}
export default useSetShown;
