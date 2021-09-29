<template>
  <div class="transaction-body pa-15">
    <div class="transaction headers">
      <p class="display-1">Amount</p>
      <p class="display-1">Transaction Date</p>
    </div> 
    <div class="transaction"
      v-for="transaction in transactions"
      :key="transaction.TransactionId"
    >
      <p>{{ transaction.Amount }}</p>
      <p>{{ transaction.createdAt}}</p>
    </div>
    <p v-if="transactions.length<1" class="my-10 title text-center">No transactions on this card found</p>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '@/composables/login'
export default {
  data(){
    return{
      cardId: '',
      transactions: []
    }
  },
  created(){
    this.cardId = this.$route.params.cardId
    this.fetchTransactions()
  },
  methods: {
    fetchTransactions(){
      axios.get(`http://localhost:3000/transactions/${this.cardId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(res=>{
        this.transactions = res.data
      })
      .catch(error=>{
        // this.$router.push('/children')
      })
    }
  }
}
</script>

<style scoped>
.transaction{
  display: grid;
  grid-template-columns: 30% 70%;
  align-items: center;
}
</style>