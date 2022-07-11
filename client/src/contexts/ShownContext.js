import React, { createContext } from "react";
import useSetShown from "../hooks/useSetShown";

export const isShownContext = createContext();

export function ShownProvider(props) {
  const [shownChange, setShownChange] = useSetShown();
  return (
    <isShownContext.Provider value={{ shownChange, setShownChange }}>
      {props.children}
    </isShownContext.Provider>
  );
}
