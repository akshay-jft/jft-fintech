<template>
  <div class="pa-15">
    <div class="d-flex justify-end">
      <v-btn class="success" @click="showAddChildrenModal=true">Add Child</v-btn>
    </div>
    <h1 class="mb-5 display-1">Children</h1>
    <div class="children-body">
      <Child
        v-for="child in childrens"
        :key="child.ChildrenId"
        :child="child"
      />
    </div>
    <AddChildren
      v-if="showAddChildrenModal"
      @success="handleSuccessAddChild"
      @close="showAddChildrenModal=false"
    />
  </div>
</template>

<script>
import axios from "axios";
import { getToken, getUser } from "@/composables/login.js";
import Child from "@/components/Children/Child.vue";
import AddChildren from '@/components/Children/AddChildren.vue'
export default {
  components: { Child, AddChildren },
  data() {
    return {
      currentUser: "2",
      childrens: [], 
      showAddChildrenModal: false
    };
  },
  methods: {
    handleSuccessAddChild(){
      this.showAddChildrenModal = false
      this.fetchData()
    },
    fetchData(){
      axios
      .get(`http://localhost:3000/children/childrens/${this.currentUser}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then((res) => {
        this.childrens = res.data;
      });
    }
  },
  created() {
    this.currentUser = getUser();
    this.fetchData()
  }
};
</script>

<style scoped>
.children-body {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}
</style>
