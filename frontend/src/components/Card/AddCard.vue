<template>
  <Backdrop>
    <h1 class="title">Add New Card</h1>
    <div class="form-container">    
      <v-text-field
        label="Card Number"
        v-model="formData.cardNumber"
      ></v-text-field>
      <v-row>
        <v-col>
          <v-text-field
            label="Type"
            v-model="formData.type"
          ></v-text-field>
        </v-col> 
        <v-col>
          <v-text-field
            label="Code"
            v-model="formData.code"
          ></v-text-field> 
        </v-col>
      </v-row>
      <v-text-field
        label="Expiration (MM/YYYY)"
        v-model="formData.expirationDate"
      ></v-text-field>
      <v-text-field
        label="Monthly Limit"
        v-model="formData.monthlyLimit"
      ></v-text-field>
      <p v-if="errorMessage" class="py-2 px-5 error white--text">{{ errorMessage }}</p>
      <div class="text-end">
        <v-btn outlined class="mt-5 mr-5" color="primary" @click="close">Cancel</v-btn>
        <v-btn class="primary mt-5" @click="handleAddCard">Add Card</v-btn> 
      </div>
      
    </div>
  </Backdrop>
</template>

<script>
import Backdrop from '@/components/UI/Backdrop.vue'
import { getToken } from '@/composables/login'
import axios from 'axios'
export default {
  components: { Backdrop },
  props: ['childrenId'],
  data(){
    return{
      formData: {
        cardNumber: ``,
        type: ``,
        expirationDate: ``,
        monthlyLimit: ``,
        childrenCardId: this.childrenId,
        code: ``
      },
      errorMessage: ``
    }
  },
  methods:{ 
    close(){
      this.$emit('close')
    },
     handleAddCard(){ 
       axios.post(`http://localhost:3000/card/create`, this.formData, {
         headers: {
           Authorization: `Bearer ${getToken()}`
         }
       })
       .then(response=>{
         this.$emit('cardAdded')
       })
       .catch(error=>{
         this.errorMessage = error.response.data.message 
         setTimeout(()=>{
           this.errorMessage = ``
         },2000)
       })
     }
  }
}
</script>

<style>

</style>