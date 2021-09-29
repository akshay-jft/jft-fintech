<template>
  <div class="login-body">
    <h1 class="text-center display-2 mt-10">Login</h1>
    <v-container class="login-container">
      <v-text-field
        label="Email"
        type="text"
        v-model="formData.email"
      ></v-text-field>
      <v-text-field
        label="Password"
        type="password"
        v-model="formData.password"
      ></v-text-field>
       <p v-if="errorMessage" class="error white--text px-5 py-2 my-5">{{ errorMessage }}</p>
      <v-btn @click="handleLogin" class="success">Login</v-btn>
     
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { setToken, getToken, setUser } from "@/composables/login";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      formData: {},
      errorMessage: ``
    };
  },
  methods: {
    handleLogin() {
      let data = {
        email: this.formData.email,
        password: this.formData.password
      };
      axios
        .post("http://localhost:3000/auth/login", data)
        .then((res) => {
          setToken(res.data.token);
          setUser(res.data.userId);
          this.$router.push("/children");
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message 
        });
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 600px;
}
</style>
