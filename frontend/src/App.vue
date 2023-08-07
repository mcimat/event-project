<script>
//used the v-if on the different routerlinks to allow for user role tabs. The idea was used from pinia class

import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API
import { useVisitor, useEditor} from "@/store/loggedInUser";


export default {
  name: 'App',
  data() {
    return {
      orgName: 'Dataplatform'
    }
  },
  created() {
    axios.get(`${apiURL}/org`).then((res) => {
      this.orgName = res.data.name
    })
  },
    setup() {
    const visitor = useVisitor();
    const editor = useEditor();
    return { visitor, editor };
  },
}

</script>
<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li v-if="(!visitor.isVisitorLoggedIn) && (!editor.isEditorLoggedIn)">
              <router-link to="/login">
                <button class="dash-login">Login</button>
              </router-link>
            </li>
            <li v-if="visitor.isVisitorLoggedIn">
              <a href="/">
                <span @click="store.logout()"><button class="dash-login">Logout</button></span>
              </a>
            </li>
            <li v-if="editor.isEditorLoggedIn">
              <a href="/">
                <span @click="store.logout()"><button class="dash-login">Logout</button></span>
              </a>
            </li>
            <br>
            <li>
              <router-link to="/">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >dashboard</span
                >
                Dashboard
              </router-link>
            </li>
            <li v-if="editor.isEditorLoggedIn">
              <router-link to="/intakeform">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >people</span
                >
                Client Intake Form
              </router-link>
            </li>
            <li v-if="editor.isEditorLoggedIn">
              <router-link to="/eventform">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >event</span
                >
                Create Event
              </router-link>
            </li>
            <li v-if="(visitor.isVisitorLoggedIn) || (editor.isEditorLoggedIn)">
              <router-link to="/findclient">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Find Client
              </router-link>
            </li>
            <li v-if="(visitor.isVisitorLoggedIn) || (editor.isEditorLoggedIn)">
              <router-link to="/findevents">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Find Event
              </router-link>
            </li>
            <li v-if="editor.isEditorLoggedIn">
              <router-link to="/manageservices">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons"
                  >search</span
                >
                Manage Services
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <h1 class="mr-20 text-3xl text-white">{{ this.orgName }}</h1>
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>
<style>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>