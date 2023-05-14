import router from './routes.js';
import store from './store.js';

let app = new Vue({
    el: '#app',
    router: router,
    data: function () {
        return {
           
        }
    },
    store: store,
    delimiters: ["${", "}"],
    beforeMount() {
        store.dispatch('fetch_user')
        store.dispatch('fetch_alluser')
    },
    computed:{
        curr_user (){
            return store.state.logged_user.username
        }
    },    
})
