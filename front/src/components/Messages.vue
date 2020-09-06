<template>
  <div>
    <v-list>
      <v-list-item
          v-for="msg in msgs"
          :key="msg">
        <v-list-item-content>
          <v-list-item-title v-text="msg"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: `Messages`,
  data(){
    return{
      msgs:["Salut", "hihi", "coucoucoucou"]
    }
  }
}
</script>

<style scoped>

</style>
