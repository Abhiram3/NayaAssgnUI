import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/boards";

class BoardService {

  create(title, projectId) {
    return axios.post(API_URL, {
      title,
      projectId
    }, { headers: authHeader() });
  }

  fetch() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  fetchById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  updateById(id, updateDetails) {
    return axios.put(`${API_URL}/${id}`, updateDetails, { headers: authHeader() });
  }

}

export default new BoardService();
