<template>
  <div class="child-body pa-15">
    <AddCard
      v-if="showAddCard"
      :childrenId="childDetails.id"
      @cardAdded="cardAdded"
      @close="showAddCard = false"
    />
    
    <p class="px-5 py-2 error white--text" v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p class="px-5 py-2 success white--text" v-if="successMessage">
      {{ successMessage }}
    </p>
    <v-text-field label="Name" v-model="childDetails.Name"></v-text-field>
    <v-text-field label="Age" v-model="childDetails.Age"></v-text-field>
    <v-btn class="primary" @click="handleUpdateProfile">Update Details</v-btn>
    <v-btn class="error ml-5" @click="handleDeleteProfile">Delete</v-btn>
    <div class="header-card d-flex justify-space-between align-center">
      <h1 class="mt-10 display-1">Cards</h1>
      <v-btn class="primary" @click="showAddCard=true">Add Card</v-btn>
    </div>
    <!-- Card Details -->
    <div class="cards">
      <Card
        v-for="card in cards"
        :key="card.CardId"
        :card="card"
        @updateCard="updateCard"
        @error="updateError"
        @paymentFailure="updateError"
        @paymentSuccess="updateCard"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken, getUser } from "@/composables/login";
import AddCard from "@/components/Card/AddCard.vue";
import Card from '@/components/Card/Card.vue'
export default {
  components: { AddCard, Card },
  created() {
    this.childDetails.id = this.$route.params.childId;
    this.fetchData();
  },
  data() {
    return {
      childDetails: {
        id: ``,
        Name: ``,
        Age: ``,
        ParentId: getUser()
      },
      cards: [],
      errorMessage: ``,
      successMessage: ``,
      showAddCard: false,
    };
  },
  methods: {
    fetchData() {
      axios
        .get(`http://localhost:3000/children/${this.childDetails.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        .then((response) => {
          this.childDetails.Name = response.data.Name;
          this.childDetails.Age = response.data.Age;
        })
        .catch((err) => {
          this.$router.push("/children");
        });

      axios
        .get(`http://localhost:3000/card/list/${this.childDetails.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        .then((res) => {
          this.cards = res.data;
        });
    },
    handleDeleteProfile() {
      const data ={
        parentId: `${getUser()}`
      }
      axios
        .delete(`http://localhost:3000/children/${this.childDetails.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          },
          data:data
        })
        .then((res) => {
          this.$router.push("/children");
        })
        .catch((error) => {
          this.errorMessage = error.response.message;
        });
    },
    handleUpdateProfile() {
      axios
        .put(
          `http://localhost:3000/children/${this.childDetails.id}`,
          this.childDetails,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        )
        .then((res) => {
          this.successMessage = `Updated Details`;
          setTimeout(() => {
            this.successMessage = ``;
          }, 2000);
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          setTimeout(() => {
            this.errorMessage = ``;
          }, 4000);
        });
    },
    cardAdded() {
      this.showAddCard = false;
      this.fetchData();
    },
    updateCard(){
      this.fetchData()
      this.successMessage = `Operation Successful`
      setTimeout(()=>{
        this.successMessage = ``
      }, 2000)
    },
    updateError(err){
      this.errorMessage = err
      setTimeout(()=>{
        this.errorMessage = ``
      }, 2000)
    }
  }
};
</script>

<style scoped>
.cards{
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  align-items: center;
  grid-gap: 2rem;
}
</style>
