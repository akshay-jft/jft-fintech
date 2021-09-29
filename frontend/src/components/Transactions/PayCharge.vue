<template>
  <Backdrop>
    <div class="d-flex justify-space-between align-center">
      <h1 class="title">Pay Charges</h1>
      <v-icon color="error" @click="close">mdi-close-thick</v-icon>
    </div> 
    <v-text-field
      label="Enter charges to pay"
      v-model="formData.amount"
    ></v-text-field>
    <v-text-field
      type="date"
      v-model="formData.transactionDate"
    ></v-text-field>  
    <p v-if="errorMessage" class="error white--text">{{ errorMessage }}</p>
    <div class="text-end">
      <v-btn class="error" dark @click="handlePayment">Pay</v-btn>
    </div>
  </Backdrop>
</template>

<script>
import Backdrop from '@/components/UI/Backdrop.vue'
import axios from 'axios'
import { getToken } from '@/composables/login'
export default {
  components: { Backdrop },
  props: ['cardId', 'childrenId'],
  data(){
    return{
      formData: {
        cardId: this.cardId,
        amount: ``,
        childrenId: this.childrenId,
        transactionDate: ``
      },
      errorMessage: ``
    }
  },
  methods:{
    close(){
      this.$emit('close')
    },
    handlePayment(){
      axios.post(`http://localhost:3000/transactions/checkout`, this.formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(res=>{
        this.$emit('paymentSuccess')
      })
      .catch(error=>{
        this.$emit('paymentFailure', error.response.data.message)
      })
    }
  }
}
</script>

<style>

</style>