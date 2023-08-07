//Took loggedInUser.js from class that discussed using pinia for the login
//Similar code with few changes with them implementation of a visitor role that will be used as a button
import { defineStore } from 'pinia';
import axios from 'axios';

const apiURL = 'http://localhost:3000';

// data that was entered
async function getUserRole(username, password) {
  let data = { username, password };
  const response = await axios.post(`${apiURL}/roles/`, data);
  console.log('response data:', response.data);
  console.log(response);
  return response.data;
}

//used to export to the login.vue
export { getUserRole };

// Visitor Role
// defining a store
export const useVisitor = defineStore({
  id: 'visitor',
  state: () => {
    return {
      name: "",
      isVisitorLoggedIn: false,
    }
  },
  actions: {
    //sets role to visitor if the username and password match what is stored in the database
    async login(username, password) {
      try {
        const response = await getUserRole(username, password);
        console.log('login response', response);
        //changes role to visitor if successful
        if (response.success && response.user.role === "visitor") {
          this.$patch({
            isVisitorLoggedIn: true,
            name: response.name,
          })
          //routes user to homepage if found in database
          this.$router.push("/");
        } else {
          alert("Invalid Credentials.");
        }
      } catch(error) {
        console.log(error)
        alert("Invalid Credentials.");
      }
    },
    logout() {
      this.$patch({
        name: "",
        isVisitorLoggedIn: false
      });
    }
  }
});

// Editor Role
// defining a store
export const useEditor = defineStore({
  id: 'editor',
  state: () => {
    return {
      name: "",
      isEditorLoggedIn: false,
    }
  },
  actions: {
    //sets role to editor if the username and password match what is stored in the database
    async login(username, password) {
      try {
        const response = await getUserRole(username, password);
        console.log('login response', response);
        //changes role to editor if successful
        if (response.success && response.user.role === "editor") {
          this.$patch({
            isEditorLoggedIn: true,
            name: response.name,
          })
          //routes user to homepage if found in database
          this.$router.push("/");
        } else {
          alert("Invalid Credentials.");
        }
      } catch(error) {
        console.log(error)
        alert("Invalid Credentials.");
      }
    },
    logout() {
      this.$patch({
        name: "",
        isEditorLoggedIn: false
      });
    }
  }
});
