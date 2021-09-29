<template>
  <v-card class="my-5 pa-5 child-card" @click="viewChild"> 
    <h1 class="title">{{ child.Name }}</h1>
    <h1 class="title">{{ child.Age }}</h1>
  </v-card>
</template>

<script>
export default {
  props: ["child"],
  data() {
    return {
      isEditing: false
    };
  },
  methods: {
    viewChild() { 
      this.$router.push(`/child/${this.child.ChildrenId}`)
    }
  }
};
</script>

<style scoped> 
.child-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
input {
  border-bottom: 1px solid black;
}
input:focus {
  outline: none;
}
</style>
