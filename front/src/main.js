import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

const home = () => import('@/views/home')
const help = () => import('@/views/help')
const agenda = () => import('@/views/agenda')
const error404 = () => import('@/views/error404')
const bug = () => import('@/views/bug')

const routes = [
    {path: '/', component: home},
    {path: '/help', component: help},
    {path: '/agenda', component: agenda},
    {path: '/bug', component: bug},
    //{path: '/section/:id', component: home},
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

Vue.use(VueRouter);
Vue.use(VueMeta);
Vue.config.productionTip = false;

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
