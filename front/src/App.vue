<template>
  <v-app>
    <Navbar/>
    <v-main>
      <v-alert
          prominent
          text icon="mdi-alert"
          color="warning"
          class="mb-5 text-center"
          v-if="isLastFridayOfMonth">
        <strong>Avertissement - Maintenance Henallux</strong>
        <br/>
        Aujourd'hui, comme tous les derniers vendredis du mois, a lieu une maintenance du système informatique Henallux.<br/>La
        génération de calendrier sera perturbée le temps de cette maintenance.
      </v-alert>
      <v-container fluid class="main-container">
        <router-view/>
      </v-container>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    getLastDayOfMonth() {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() + 1, 0);
    },

    getLastFridayOfMonth() {
      let lastDayOfMonth = this.getLastDayOfMonth;
      while (lastDayOfMonth.getDay() !== 5) {
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
      }
      return lastDayOfMonth;
    },

    isLastFridayOfMonth() {
      const today = new Date();
      const lastFriday = this.getLastFridayOfMonth;
      return today.getDate() === lastFriday.getDate();
    }
  }
};
</script>

<style scoped>
.main-container {
  max-width: 1140px;
  width: 100%;
}
</style>
