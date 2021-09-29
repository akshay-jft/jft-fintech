<template>
  <Backdrop>
    <div class="d-flex justify-space-between align-center">
      <h1 class="title">Add Children</h1>
      <v-icon @click="close">mdi-close</v-icon>
    </div>
    
    <div class="form-container">
      <v-text-field
        label="Name"
        v-model="formData.name"
      ></v-text-field>
      <v-text-field
        label="Age"
        v-model="formData.age"
      ></v-text-field>
      <p class="my-5 pa-2 error white--text" v-if="errorMessage">{{ errorMessage }}</p>
      <v-btn class="success mt-5" @click="handleAddChildren">Add Child</v-btn>
    </div>
  </Backdrop>
</template>

<script>
import Backdrop from '@/components/UI/Backdrop.vue'
import { getUser, getToken } from '@/composables/login'
import axios from 'axios'
export default {
  components: { Backdrop },
  data(){
    return{
      formData: {
        name: ``,
        age: ``,
        parentid: getUser()
      },
      errorMessage: ``
    }
  },
  methods:{ 
    handleAddChildren(){
      axios.post('http://localhost:3000/children/create', this.formData, {
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      })
      .then(response=>{
        this.$emit('success')
      })
      .catch(error=>{
        this.errorMessage = error.response.data.message
        this.$emit('failure')
        setTimeout(()=>{
          this.errorMessage =``
        },2000)
      })
    },
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>