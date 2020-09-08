import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import titleMixin from './mixins/title';

const home = () => import('@/components/home')
const help = () => import('@/components/help')
const agenda = () => import('@/components/agenda')
const error404 = () => import('@/components/error404')

const routes = [
    {path: '/', component: home},
    {path: '/help', component: help},
    {path: '/agenda', component: agenda},
    {path: '/404', component: error404},
    {path: '*', redirect: '/404'}
]
Vue.component('Navbar', (resolve) => {
    import('@/components/Navbar')
        .then((AsyncComponent) => {
            resolve(AsyncComponent.default);
        });
});
Vue.component('Footer', (resolve) => {
    import('@/components/Footer')
        .then((AsyncComponent) => {
            resolve(AsyncComponent.default);
        });
});
Vue.component('Logo', (resolve) => {
    import('@/components/Logo')
        .then((AsyncComponent) => {
            resolve(AsyncComponent.default);
        });
});

const router = new VueRouter({
    routes,
    mode: "history" // Virer le #
})

Vue.mixin(titleMixin);
Vue.use(VueRouter);
Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
