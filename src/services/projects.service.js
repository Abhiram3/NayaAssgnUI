import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/";

class ProjectsService {

  create(title) {
    return axios.post(API_URL + "projects", {
      title
    }, { headers: authHeader() });
  }

  fetch() {
    return axios.get(API_URL + "projects", { headers: authHeader() });
  }

  fetchById(id) {
    return axios.get(`${API_URL}projects/${id}`, { headers: authHeader() });
  }

}

export default new ProjectsService();
