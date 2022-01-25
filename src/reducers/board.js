import {
  BOARDS_FETCHBYID,
  BOARDS_FETCHBYID_SUCCESS,
  BOARDS_FETCHBYID_FAIL,
} from "../actions/types";

const initialState = {
  loading: true,
  details: {}
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case BOARDS_FETCHBYID:
      return {
        ...state,
        loading: true
      };
    case BOARDS_FETCHBYID_SUCCESS:
      console.log('board data', payload.board);
      return {
        ...state,
        loading: false,
        details: payload.board.data,
      };
    case BOARDS_FETCHBYID_FAIL:
      return {
        ...state,
        loading: false,
        details: {}
      };
    default:
      return state;
  }
}
