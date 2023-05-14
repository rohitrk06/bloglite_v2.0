const store = new Vuex.Store({
    state: {
        auth: null,
        logged_user: {
            username: null,
            id: null,
            email: null
        },
        alluser: null,
        currUser_Following:null,
        currUser_NonFollowing:null,
    },
    mutations: {
        isAuth(state) {
            if (!localStorage.auth_token) {
                state.auth = false
            }
            else {
                state.auth = true
            }
        },
        changeLoggedUser(state, user) {
            state.logged_user = user
        },
        changeAllUser(state, users) {
            state.alluser = users
        },
        changeCurrUserFollowing(state,followings){
            state.currUser_Following = followings
        },
        changeCurrUserNonFollowing(state,non_followings){
            state.currUser_NonFollowing = non_followings
        },
    },
    actions: {
        async fetch_user(context) {
            context.commit('isAuth')
            if (context.state.auth) {
                try {
                    let res = await fetch("http://127.0.0.1:8000/api/logged_user", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': localStorage.auth_token
                        }
                    })
                    let data = await res.json()
                    context.commit('changeLoggedUser', data)
                }
                catch (error) {
                    console.error(error)
                }
            }
            else {
                context.commit('changeLoggedUser', {
                    username: null,
                    id: null,
                    email: null
                })
            }
        },
        async fetch_alluser(context) {
            if (context.state.auth) {
                try{
                    let res = await fetch("http://127.0.0.1:8000/api/user", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': localStorage.auth_token
                        }
                    })
                    let data = await res.json()
                    context.commit('changeAllUser', data)
                }catch(error){
                    console.log(error)
                }

                let following = []
                for (let f of store.state.logged_user.following) {
                    following.push(f.user_id)
                }
                context.commit('changeCurrUserFollowing',following);

                let nonFollowing = []
                // console.log(store.state.alluser)
                for (let f of store.state.alluser) {
                    if (!(store.state.currUser_Following.includes(f.id))) {
                        nonFollowing.push(f)
                    }
                }
                context.commit("changeCurrUserNonFollowing",nonFollowing)
            }   
        }

    },
    plugins: [createPersistedState()]
})

export default store;