<template>
  <v-container fluid class="text-center">
    <h1 class="blue-grey--text text--lighten-1 font-weight-light">Utilisation du site</h1>
    <p id="pAccroche">
      Hello ! 😄
      <v-col sm="5" xl="6" md="6" class="margin-auto">
        Pour générer ton calendrier (.ics) perso, rien de plus simple : indique le(s) groupe(s) que tu suis ainsi que
        les cours présents dans ton PAE puis génère le lien et utilise le pour créer un calendrier Google !
      </v-col>
    </p>
    <v-row justify="center" align="center">
      <v-col sm="5" xl="6" md="6">
        <v-row align="center" justify="center">
          <v-icon x-large color="blue">mdi-autorenew</v-icon>
          <h3>Mise à jour automatique</h3></v-row>
        Horaire toujours à jour sur PC, tablette etc sans passer par le portail !
      </v-col>
      <v-col sm="5" xl="6" md="6">
        <v-row align="center" justify="center">
          <v-icon x-large color="teal">mdi-pencil-outline</v-icon>
          <h3>100% Personnalisable</h3></v-row>
        Possibilité de choisir uniquement les cours de votre PAE !
      </v-col>
    </v-row>
    <v-alert text type="info" class="mt-5 mb-5">Besoin d'aide ? Consulte la page
      <router-link to="/help" class="text-decoration-none">Help</router-link>
      !
    </v-alert>
    <v-form>
      <v-expansion-panels accordion focusable flat hover v-model="showAccordion">
        <v-expansion-panel>
          <v-expansion-panel-header>Bloc 1</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-skeleton-loader
                :loading="groupsBloc1.length === 0"
                type="card-heading"
            >
              <v-select
                  multiple
                  chips
                  deletable-chips
                  persistent-hint
                  hint="Choisis ton/tes groupes"
                  v-model="selectedGroups"
                  label="Groupe"
                  :items="groupsBloc1"
                  prepend-inner-icon="mdi-account-group"
                  clearable
              >
              </v-select>
            </v-skeleton-loader>
            <v-skeleton-loader
                :loading="classesBloc1.length === 0"
                type="card-heading"
            >
              <v-autocomplete
                  multiple
                  chips
                  :small-chips="selectedClassesBloc1.length > 5"
                  deletable-chips
                  persistent-hint
                  hint="Choisis ton/tes cours"
                  v-model="selectedClassesBloc1"
                  label="Cours"
                  :items="classesBloc1"
                  prepend-inner-icon="mdi-school-outline"
                  class="mt-5"
                  clearable
                  @input="searchInput=null"
                  :search-input.sync="searchInput"
              >
                <v-list-item
                    slot="prepend-item"
                    ripple
                    @click="toggleCours1"
                    v-if="!searchInput"
                >
                  <v-list-item-action>
                    <v-icon>{{ iconSelected(selectedClassesBloc1, classesBloc1) }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>{{ labelSelect(selectedClassesBloc1, classesBloc1) }}</v-list-item-title>
                </v-list-item>
                <v-divider
                    slot="prepend-item"
                    class="mt-2"
                    v-if="!searchInput"
                />
              </v-autocomplete>
            </v-skeleton-loader>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel >
          <v-expansion-panel-header>Bloc 2</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-skeleton-loader
                :loading="groupsBloc2.length === 0"
                type="card-heading"
            >
            <v-select
                multiple
                chips
                deletable-chips
                persistent-hint
                hint="Choisis ton/tes groupes"
                v-model="selectedGroups"
                label="Groupe"
                :items="groupsBloc2"
                prepend-inner-icon="mdi-account-group"
            />
            </v-skeleton-loader>
            <v-skeleton-loader
                :loading="classesBloc2.length === 0"
                type="card-heading"
            >
            <v-autocomplete
                multiple
                chips
                :small-chips="selectedClassesBloc2.length > 5"
                deletable-chips
                persistent-hint
                hint="Choisis ton/tes cours"
                v-model="selectedClassesBloc2"
                label="Cours"
                :items="classesBloc2"
                prepend-inner-icon="mdi-school-outline"
                class="mt-5"
                clearable
                @input="searchInput=null"
                :search-input.sync="searchInput"
                v-if="!searchInput"
            >
              <v-list-item
                  slot="prepend-item"
                  ripple
                  @click="toggleCours2"
              >
                <v-list-item-action>
                  <v-icon>{{ iconSelected(selectedClassesBloc2, classesBloc2) }}</v-icon>
                </v-list-item-action>
                <v-list-item-title>{{ labelSelect(selectedClassesBloc2, classesBloc2) }}</v-list-item-title>
              </v-list-item>
              <v-divider
                  slot="prepend-item"
                  class="mt-2"
                  v-if="!searchInput"
              />
            </v-autocomplete>
            <v-radio-group
                row
                prepend-icon="mdi-account-voice"
                v-model="selectedLangBloc2"
                class="mt-5"
                label="Seconde langue"
                hint="Choisis ta 2ème langue"
                persistent-hint
                dense
            >
              <v-radio label="Anglais renforcement" value="EN2"></v-radio>
              <v-radio label="Allemand / Néerlandais" value="ALNL2"></v-radio>
            </v-radio-group>
            </v-skeleton-loader>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel >
          <v-expansion-panel-header>Bloc 3</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-skeleton-loader
                :loading="groupsBloc3.length === 0"
                type="card-heading"
            >
            <v-select
                multiple
                chips
                deletable-chips
                persistent-hint
                hint="Choisis ton/tes groupes"
                v-model="selectedGroups"
                label="Groupe"
                :items="groupsBloc3"
                prepend-inner-icon="mdi-account-group"
            />
            </v-skeleton-loader>
            <v-skeleton-loader
                :loading="classesBloc3.length === 0"
                type="card-heading"
            >
            <v-autocomplete
                multiple
                chips
                :small-chips="selectedClassesBloc3.length > 5"
                deletable-chips
                persistent-hint
                hint="Choisis ton/tes cours"
                v-model="selectedClassesBloc3"
                label="Cours"
                :items="classesBloc3"
                prepend-inner-icon="mdi-school-outline"
                class="mt-5"
                clearable
                @input="searchInput=null"
                :search-input.sync="searchInput"
            >
              <v-list-item
                  slot="prepend-item"
                  ripple
                  @click="toggleCours3"
                  v-if="!searchInput"
              >
                <v-list-item-action>
                  <v-icon>{{ iconSelected(selectedClassesBloc3, classesBloc3.filter(cours => cours.value)) }}</v-icon>
                </v-list-item-action>
                <v-list-item-title>{{ labelSelect(selectedClassesBloc3, classesBloc3.filter(cours => cours.value)) }}</v-list-item-title>
              </v-list-item>
              <v-divider
                  slot="prepend-item"
                  class="mt-2"
                  v-if="!searchInput"
              />
            </v-autocomplete>
            <v-radio-group
                row
                prepend-icon="mdi-account-voice"
                v-model="selectedLangBloc3"
                class="mt-5"
                label="Seconde langue"
                hint="Choisis ta 2ème langue"
                persistent-hint
                dense
            >
              <v-radio label="Anglais renforcement" value="EN3"></v-radio>
              <v-radio label="Allemand / Néerlandais" value="ALNL3"></v-radio>
            </v-radio-group>
            </v-skeleton-loader>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-row justify="end" class="mt-5">
        <v-btn
            color="primary"
            class="mr-4"
            depressed
            @click="generateURL"
        >
          <v-icon>mdi-link-variant</v-icon>
          Générer le lien
        </v-btn>
      </v-row>
    </v-form>
    <v-scroll-y-reverse-transition>
      <v-row justify="center" align="center" v-if="urlGenerated">
        <v-col sm="9" xl="11" md="11">
          <v-text-field id="urlGenerated" v-model="urlGenerated" readonly persistent-hint hint="URL Générée" prepend-inner-icon="mdi-link-variant" full-width>
          </v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-tooltip right v-model="showConfirmTiptool">
            <template v-slot:activator="{ on: tooltipSuccess }">
              <v-tooltip right>
                <template v-slot:activator="{ on: attrs }">
                  <v-btn v-bind="attrs"
                         v-on="{...tooltipSuccess, ...attrs}"
                         @click="confirmCopyTooltip"
                         text><v-icon>mdi-content-copy</v-icon></v-btn>
                </template>
                <span>Clique ici pour copier Gilles</span>
              </v-tooltip>
            </template>
            <span>URL Copiée !</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-scroll-y-reverse-transition>

    <v-snackbar
        v-model="showToast"
        :color="colorToast"
        timeout="2000"
    >
      {{ textToast }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  title: 'Accueil',
  name: "home",
  data() {
    return {
      showAccordion: null,
      selectedGroups: [],
      selectedClassesBloc1: [],
      selectedClassesBloc2: [],
      selectedClassesBloc3: [],
      selectedLangBloc2: '',
      selectedLangBloc3: '',
      urlGenerated: "",
      showConfirmTiptool: false,
      showToast: false,
      textToast: '',
      colorToast: '',
      groupsBloc1: [],
      groupsBloc2: [],
      groupsBloc3: [],
      classesBloc1: [],
      classesBloc2: [],
      classesBloc3: [],
      searchInput: null
    }
  },
  async created() {
    this.groupsBloc1 = (await axios.get('http://192.168.0.3:8181/api/groups/1')).data
    this.groupsBloc2 = (await axios.get('http://192.168.0.3:8181/api/groups/2')).data
    this.groupsBloc3 = (await axios.get('http://192.168.0.3:8181/api/groups/3')).data
    this.classesBloc1 = (await axios.get('http://192.168.0.3:8181/api/classes/1')).data
    this.classesBloc2 = (await axios.get('http://192.168.0.3:8181/api/classes/2')).data
    this.classesBloc3 = (await axios.get('http://192.168.0.3:8181/api/classes/3')).data
  },
  computed: {
    selectedAllOptions() {
      return (selectedArray, fullArray) => {
        return selectedArray.length === fullArray.length
      }
    },
    selectedSomeOptions() {
      return (selectedArray, fullArray) => {
        return selectedArray.length > 0 && !this.selectedAllOptions(selectedArray, fullArray)
      }
    },
    iconSelected() {
      return (selectedArray, fullArray) => {
        if (this.selectedAllOptions(selectedArray, fullArray)) return 'mdi-close-box'
        if (this.selectedSomeOptions(selectedArray, fullArray)) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      }
    },
    labelSelect() {
      return (selectedArray, fullArray) => {
        if (!this.selectedAllOptions(selectedArray, fullArray))
          return "Tout sélectionner"
        else
          return "Tout désélectionner"
      }
    },
    checkGroupsNotEmpty(){
      return this.selectedGroups.length !== 0;
    },
    getLanguagesArray(){
      return (groups) => {
        let languages = [];
        if (this.selectedLangBloc2 && groups.filter(group => group.charAt(0) === '2').length > 0)
          languages.push(this.selectedLangBloc2);
        if (this.selectedLangBloc3 && groups.filter(group => group.charAt(0) === '3').length > 0)
          languages.push(this.selectedLangBloc3);
        return languages;
      }
    },
    getFullParamsURL(){
      return (obj) => {
        /*
        Parcours des cours sélectionnés pour la génération des String pour les paramètres URL
            - A revoir ?
        */
        let tempCrs1 = obj.classes.filter(crs => crs === "1" || (crs >= 100 && crs <= 199));
        let paramCrs1 = `${obj.allClassesBloc1 ? 'crs1[]=all' : tempCrs1.map(crs => `crs1[]=${crs}`).join('&')}`;
        let tempCrs2 = obj.classes.filter(crs => crs === "2" || (crs >= 200 && crs <= 299));
        let paramCrs2 = `${obj.allClassesBloc2 ? 'crs2[]=all' : tempCrs2.map(crs => `crs2[]=${crs}`).join('&')}`;
        let tempCrs3 = obj.classes.filter(crs => crs === "3" || (crs >= 300 && crs <= 399));
        let paramCrs3 = `${obj.allClassesBloc3 ? 'crs3[]=all' : tempCrs3.map(crs => `crs3[]=${crs}`).join('&')}`;
        let tempLanguage2 = obj.languages.filter(lang => lang.substring((lang.length - 1)) === "2");
        let paramLang2 = tempLanguage2.map(lang => `optl2=${lang}`).join('&');
        let tempLanguage3 = obj.languages.filter(lang => lang.substring((lang.length - 1)) === "3");
        let paramLang3 = tempLanguage3.map(lang => `optl3=${lang}`).join('&');

        /*
            Concatenation des paramètres précédemment créés
                - A revoir?
         */
        let paramCrsFull = (paramCrs1 && paramCrs1.length > 0) ? '&' + paramCrs1 : '';
        paramCrsFull += (paramCrs2 && paramCrs2.length > 0) ? '&' + paramCrs2 : '';
        paramCrsFull += (paramCrs3 && paramCrs3.length > 0) ? '&' + paramCrs3 : '';
        paramCrsFull += (paramLang2 && paramLang2.length > 0) ? '&' + paramLang2 : '';
        paramCrsFull += (paramLang3 && paramLang3.length > 0) ? '&' + paramLang3 : '';
        return paramCrsFull
      }
    }
  },
  methods: {
    toggleCours1() {
      this.$nextTick(() => {
        if (this.selectedAllOptions(this.selectedClassesBloc1, this.classesBloc1)) {
          this.selectedClassesBloc1 = []
        } else {
          this.selectedClassesBloc1 = this.classesBloc1.slice()
        }
      })
    },
    toggleCours2() {
      this.$nextTick(() => {
        if (this.selectedAllOptions(this.selectedClassesBloc2, this.classesBloc2)) {
          this.selectedClassesBloc2 = []
        } else {
          this.selectedClassesBloc2 = this.classesBloc2.slice()
        }
      })
    },
    toggleCours3() {
      this.$nextTick(() => {
        if (this.selectedAllOptions(this.selectedClassesBloc3, this.classesBloc3.filter(cours => cours.value))) {
          this.selectedClassesBloc3 = []
        } else {
          this.selectedClassesBloc3 = this.classesBloc3.filter(cours => cours.value).map(cours => cours.value).slice()
        }
      })
    },
    confirmCopyTooltip(){
      this.showConfirmTiptool = true;
      if(navigator.clipboard){
        navigator.clipboard.writeText(this.urlGenerated);
      }else{
        const input = document.getElementById('urlGenerated');
        input.focus();
        input.select();
        document.execCommand('copy');
      }
      setTimeout(()=>{
        this.showConfirmTiptool = false
      },1000);
    },
    generateURL(){
      this.showAccordion = false;
      if(!this.checkGroupsNotEmpty){
        this.textToast = "Aucun groupe n'a été sélectionné";
        this.colorToast = 'error';
        this.showToast = true;
        this.urlGenerated = '';
      }else{
        let generatedObject = {
          classes: this.selectedClassesBloc1.concat(this.selectedClassesBloc2).concat(this.selectedClassesBloc3),
          groups: this.selectedGroups,
          languages: this.getLanguagesArray(this.selectedGroups),
          allClassesBloc1: this.selectedClassesBloc1.length === this.classesBloc1.length,
          //pas nécessaire de mettre crs1[] = all si aucun cours n'est sélectionné (en backend, si aucun cours sélectionné => tous les cours sont pris en charge
          //allClassesBloc1: (this.selectedClassesBloc1.length === this.classesBloc1.length) || (this.selectedGroupsBloc.filter(group => group.charAt(0) === '1').length > 0 && this.selectedClassesBloc1.length === 0),
          allClassesBloc2: this.selectedClassesBloc2.length === this.classesBloc2.length,
          allClassesBloc3: this.selectedClassesBloc3.length === this.classesBloc3.filter(cours => cours.value).length
        }

        const fullParams = this.getFullParamsURL(generatedObject);
        let baseURL = 'https://iesn.thibaultclaude.be/';
        this.urlGenerated = `${baseURL}calendar?${generatedObject.groups.map(group => `grp[]=${group}`).join('&')}${fullParams}`;
        this.textToast = "URL générée avec succès";
        this.colorToast = 'success';
        this.showToast = true;
      }
    }
  }
}
</script>

<style scoped>
.margin-auto {
  margin: auto;
}

#pAccroche {
  margin-top: 15px;
}

.v-icon {
  margin-right: 5px;
}
</style>
