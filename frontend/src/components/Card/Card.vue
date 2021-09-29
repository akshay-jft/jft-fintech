<template>
  <div class="card-body elevation-5 mt-5">
    <PayCharge 
      v-if="showPayCharge"
      @close="showPayCharge=false"
      @paymentSuccess="paymentSuccess"
      @paymentFailure="paymentFailure"
      :cardId="card.CardId"
      :childrenId="card.ChildrenCardId"
    />
    <div class="d-flex mb-2 justify-space-between">
      <h1 class="display-1">{{ card.Type }}</h1>
      <h1 class="title">{{ card.ExpirationDate }}</h1>
    </div>
    <h1 class="title">{{ maskedCard }}</h1>
    <div v-if="isEditing" class="d-flex">
      <v-icon class="mr-2" @click="saveLimit">mdi-content-save</v-icon>
      <input type="text" v-model="limit" class="input-limit" />
      <v-icon class="ml-2" @click="isEditing = false">mdi-close</v-icon>
    </div>
    <div v-else class="d-flex justify-space-between">
      <div>
        <h1 class="title">Monthly Limit: $ {{ card.MonthlyLimit }}</h1>
        <h1 class="title">Balance Left : $ {{ card.Balance }}</h1>
      </div> 
      <v-icon @click="isEditing = true">mdi-pencil</v-icon>
    </div>
    <div class="text-end mt-5">
      <v-btn color="error" class="mr-5" @click="redirectTransaction">Transactions</v-btn>
      <v-btn color="error" class="mr-5" outlined @click="showPayCharge=true">Pay Charge</v-btn>
      <v-btn class="error" @click="handleDeleteCard">Remove</v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken, getUser } from "@/composables/login";
import PayCharge from '@/components/Transactions/PayCharge.vue'
export default {
  props: ["card"],
  components: {PayCharge},
  data() {
    return {
      isEditing: false,
      limit: ``,
      showPayCharge: false ,
      maskedCard: ``
    };
  },
  created() {
    this.limit = this.card.MonthlyLimit;
    this.maskedCard = this.getMaskedCard(this.card.Number)
  },
  methods: {
    redirectTransaction(){
      this.$router.push(`/transactions/${this.card.CardId}`)
    },
    handleDeleteCard() {
      const data = {
        childrenId: getUser()
      };
      axios
        .delete(`http://localhost:3000/card/${this.card.CardId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          },
          data: data
        })
        .then((response) => {
          this.$emit("updateCard");
        })
        .catch((error) => {
          this.$emit("error", error.response.data.message);
        });
    },
    saveLimit() {
      const data = {
        monthlyLimit: this.limit,
        childrenId: this.card.ChildrenCardId
      };
      axios
        .put(`http://localhost:3000/card/${this.card.CardId}`, data, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        .then((response) => {
          this.isEditing = false;
          this.$emit("updateCard");
        })
        .catch((error) => {
          this.$emit("error", error.response.data.message);
        });
    },
    paymentFailure(error){
      this.$emit('paymentFailure', error)
    },
    paymentSuccess(){
      this.showPayCharge=false
      this.$emit('paymentSuccess')
    },
    getMaskedCard(card){
      let maskedCard = card.split("-")
      return `XXXX-XXXX-XXXX-${maskedCard[3]}` 
    }
  } 
};
</script>

<style scoped>
.card-body {
  padding: 15px;
  border-radius: 5px;
}
.input-limit {
  width: 100%;
  border-bottom: 1px solid black;
}
</style>
