<script>
import { useVisitor, useEditor } from "@/store/loggedInUser";
import { getUserRole } from "@/store/loggedInUser";

const apiURL = 'http://localhost:3000';

export default {
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    async onSubmit() {
      try {
        //From the loggedInUser.js file
        const response = await getUserRole(this.username, this.password);
        if (response.user.role === "visitor") {
          // Login as visitor
          const visitor = useVisitor();
          visitor.login(this.username, this.password, () => {
            this.$router.push("/"); //Pushes user to dashboard when login
          });
        } else if (response.user.role === "editor") {
          // Login as editor
          const editor = useEditor();
          editor.login(this.username, this.password, () => {
            this.$router.push("/"); //Pushes user to dashboard when login
          });
        } else {
          alert("Invalid Credentials.");
        }
      } catch (error) {
        console.log(error);
        alert("Invalid Credentials.");
      }
    },
  },
};
</script>


<template>
  <main class="login-background">
    <div class="login">
      <div class="login-header">
        <p><b>Login</b></p><br>
      </div>
      <div class="login-credentials">
        <form @submit.prevent="onSubmit" novalidate="true">
          <label>Username</label><br>
          <input type="text" v-model="username" placeholder="Enter Username" required>
          <br><br>
          <label>Password</label><br>
          <input type="password" v-model="password" placeholder="Enter Password" required>
          <br><br>
          <div class="button-container">
            <button class="login-button">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
