import {
  PROJECTS_FETCH,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECTS_FETCH_SUCCESS,
  PROJECTS_FETCH_FAIL,
  PROJECTS_FETCHBYID_SUCCESS,
  PROJECTS_FETCHBYID_FAIL,
  SET_MESSAGE
} from "./types";
import EventBus from "../common/EventBus";
import ProjectsService from "../services/projects.service";

export const projectCreate = (title) => (dispatch) => {
  return ProjectsService.create(title).then(
    (response) => {
      dispatch({
        type: PROJECT_CREATE_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return projectsFetch();
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
        type: PROJECT_CREATE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const projectsFetch = () => (dispatch) => {
  dispatch({
    type: PROJECTS_FETCH
  });
  return ProjectsService.fetch().then(
    (data) => {
      dispatch({
        type: PROJECTS_FETCH_SUCCESS,
        payload: { projects: data },
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
        type: PROJECTS_FETCH_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const projectsFetchById = (id) => (dispatch) => {
  dispatch({
    type: PROJECTS_FETCH
  });
  return ProjectsService.fetchById(id).then(
    (data) => {
      dispatch({
        type: PROJECTS_FETCHBYID_SUCCESS,
        payload: { selectedProject: data },
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
        type: PROJECTS_FETCHBYID_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
