import routes from './routes.js';

export const store = Vue.reactive({
    dark: localStorage.getItem('dark') !== 'false',
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', this.dark);
    },
    selected: null,
});

const app = Vue.createApp({
    data: () => ({ store }),
});
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');
