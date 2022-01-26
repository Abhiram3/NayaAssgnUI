import {
  BOARD_CREATE_SUCCESS,
  BOARD_CREATE_FAIL,
  SET_MESSAGE,
  BOARDS_FETCHBYID,
  BOARDS_FETCHBYID_SUCCESS,
  BOARDS_FETCHBYID_FAIL,
  BOARDS_UPDATEBYID,
  BOARDS_UPDATEBYID_SUCCESS,
  BOARDS_UPDATEBYID_FAIL,
  UPLOADED_IMAGES_FETCH,
  UPLOADED_IMAGES_FETCH_SUCCESS,
  UPLOADED_IMAGES_FETCH_FAIL
} from "./types";

import BoardService from "../services/board.service";
import EventBus from "../common/EventBus";
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
      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
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
      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
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
      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
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

export const fetchUploadedImages = () => (dispatch) => {
  dispatch({
    type: UPLOADED_IMAGES_FETCH,
  });
  return BoardService.fetchUploadedImages().then(
    (data) => {
      dispatch({
        type: UPLOADED_IMAGES_FETCH_SUCCESS,
        payload: { uploadedImages: data },
      });

      return Promise.resolve();
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: UPLOADED_IMAGES_FETCH_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
