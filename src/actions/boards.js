import {
  BOARD_CREATE,
  BOARD_CREATE_SUCCESS,
  BOARD_CREATE_FAIL,
  SET_MESSAGE,
  BOARDS_FETCHBYID,
  BOARDS_FETCHBYID_SUCCESS,
  BOARDS_FETCHBYID_FAIL,
  BOARDS_UPDATEBYID,
  BOARDS_UPDATEBYID_SUCCESS,
  BOARDS_UPDATEBYID_FAIL
} from "./types";

import BoardService from "../services/board.service";
import { projectsFetchById } from "../actions/projects";

export const boardCreate = (title, projectId) => (dispatch) => {
  return BoardService.create(title, projectId).then(
    (response) => {
      dispatch({
        type: BOARD_CREATE_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return projectsFetchById(projectId);
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: BOARD_CREATE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const boardsFetchById = (id) => (dispatch) => {
  dispatch({
    type: BOARDS_FETCHBYID,
  });
  return BoardService.fetchById(id).then(
    (data) => {
      dispatch({
        type: BOARDS_FETCHBYID_SUCCESS,
        payload: { board: data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: BOARDS_FETCHBYID_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const updateBoardById = (id, updateDetails) => (dispatch) => {
  dispatch({
    type: BOARDS_UPDATEBYID,
  });
  return BoardService.updateById(id, updateDetails).then(
    (data) => {
      dispatch({
        type: BOARDS_UPDATEBYID_SUCCESS,
        payload: { board: data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: BOARDS_UPDATEBYID_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
