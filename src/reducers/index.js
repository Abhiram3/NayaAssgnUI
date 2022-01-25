import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import projects from "./projects";
import board from './board';

export default combineReducers({
  auth,
  message,
  projects,
  board
});
