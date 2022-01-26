import axios from "axios";

import authHeader from "./auth-header";
import { API_URL } from '../constants';

class BoardService {

  create(title, projectId) {
    return axios.post(API_URL + 'boards', {
      title,
      projectId
    }, { headers: authHeader() });
  }

  fetch() {
    return axios.get(API_URL + 'boards', { headers: authHeader() });
  }

  fetchById(id) {
    return axios.get(`${API_URL}boards/${id}`, { headers: authHeader() });
  }

  updateById(id, updateDetails) {
    return axios.put(`${API_URL}boards/${id}`, updateDetails, { headers: authHeader() });
  }

  fetchUploadedImages() {
    return axios.get(`${API_URL}uploadedImagesList`, { headers: authHeader() });
  }

}

export default new BoardService();
