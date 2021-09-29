<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    <h1>Fintech</h1>
    <v-spacer></v-spacer> 
    <v-btn text @click="handleRedirectHome">Home</v-btn>  
    <v-btn text @click="handleSignOut">Sign Out</v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  methods:{
    handleSignOut(){
      localStorage.clear()
      this.$router.push('/')
    },
    handleRedirectHome(){
      this.$router.push('/children')
    }
  }
};
</script>
