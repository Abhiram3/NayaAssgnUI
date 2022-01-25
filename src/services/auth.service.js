import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(name, password) {
    return axios
      .post(API_URL + "signin", { name, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, email, password) {
    return axios.post(API_URL + "signup", {
      name,
      email,
      password,
    });
  }
}

export default new AuthService();
