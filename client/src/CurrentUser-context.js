import React from "react";
import { useState, createContext, useContext } from "react";
import authService from "./services/auth-service";

const CurrentUserContext = createContext();
export const CurrentUserProvider = ({ children }) => {
  let [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
export default CurrentUserContext;
