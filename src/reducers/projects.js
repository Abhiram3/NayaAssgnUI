import {
  PROJECTS_FETCH,
  PROJECTS_FETCH_SUCCESS,
  PROJECTS_FETCH_FAIL,
  PROJECTS_FETCHBYID,
  PROJECTS_FETCHBYID_SUCCESS,
  PROJECTS_FETCHBYID_FAIL
} from "../actions/types";

const initialState = {
  projects: [],
  loading: true,
  selectedProject: {
    loading: true
  }
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PROJECTS_FETCH:
      return {
        ...state,
        loading: true
      };
    case PROJECTS_FETCH_SUCCESS:
      return {
        ...state,
        projects: payload.projects.data,
        loading: false
      };
    case PROJECTS_FETCH_FAIL:
      return {
        ...state,
        projects: [],
        loading: false
      };
    case PROJECTS_FETCHBYID:
      return {
        ...state,
        loading: true
      };
    case PROJECTS_FETCHBYID_SUCCESS:
      return {
        ...state,
        selectedProject: Object.assign({}, payload.selectedProject.data, {
          loading: false
        }),
      };
    case PROJECTS_FETCHBYID_FAIL:
      return {
        ...state,
        selectedProject: {
          loading: false
        },
      };
    default:
      return state;
  }
}
