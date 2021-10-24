<template>
  <v-footer padless app absolute>
    <v-row
        justify="center"
        no-gutters
    >
      <v-btn
          color="grey"
          text
          rounded
          class="my-2"
          href="https://github.com/Section-IG/IG-Scheduler"
          target="_blank"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="grey"
              text
              rounded
              class="my-2"
              @click="copyToClipboard"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-discord</v-icon>
          </v-btn>
        </template>
        <span>tiiBz#1337</span>
      </v-tooltip>
      <v-col           
          class="pb-4 text-center grey--text"
          cols="12">
        IG-Scheduler n'est aucunement affilié à l'Hénallux
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText("tiiBz#1337");
    }
  }
}

</script>

<style scoped>

</style>
