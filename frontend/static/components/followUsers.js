const followUsers = Vue.component('follow-user',{
    props:['fUser',"isfollowing"],
    data:function(){
        return{
            following:this.isfollowing,
        }
    },
    template:
        `
        <div class="mt-2 rounded-pill bg-danger-subtle">
            <div class="row g-0 align-items-center justify-content-around m-1">
                <div class="col-md-1 m-2">
                    <img src="/static/images/profile.webp" class="rounded-circle w-100">
                </div>
                <div class="col-md-5 align-middle m-2">
                    <router-link :to='getRouteLink(fUser.id)' class="font-monospace  fst-italic text-dark nav-link">{{fUser.username}}</router-link>
                </div>
                <div class="col-md-4 align-middle m-2">
                    <button type='button' @click="follow" class='text-success fw-semibold bg-transparent border border-0' v-if='!isfollow'>
                        <i class="bi bi-person-plus fw-semibold"></i>
                        Follow
                    </button>
                    <button type='button' @click="follow" class='text-success fw-semibold bg-transparent border border-0' v-if='isfollow'>
                        <i class="bi bi-person-check"></i>
                        Following
                    </button>
                </div> 
            </div>
        </div>
        `,
        methods:{
            follow(){
                // console.log(this.$store.state.logged_user.id, this.fUser.id)
                if (!this.isfollow){
                    //fetch API to follow user
                    if (this.$store.state.logged_user.id!=this.fUser.id){
                        fetch(`http://127.0.0.1:8000/api/user/follow/${this.$store.state.logged_user.id}/${this.fUser.id}`,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authentication-Token': localStorage.auth_token
                            }
                        }).then(res=> res.ok?this.following=true:this.following=false).catch(error=>console.error(error))
                    }
                }
                else{
                    //Fetch API to unfollow user
                    if (this.$store.state.logged_user.id!=this.fUser.id){
                        fetch(`http://127.0.0.1:8000/api/user/unfollow/${this.$store.state.logged_user.id}/${this.fUser.id}`,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authentication-Token': localStorage.auth_token
                            }
                        }).then(res=> res.ok?this.following=false:this.following=true).catch(error=>console.error(error))
                    }
                }
            },
            getRouteLink(user_id){
                return `/profile/${user_id}`
            },
        },
        computed:{
            
            isfollow(){
                // console.log('Baba yeh to execute hua')
                if (this.following ){
                    // console.log(this.count)
                    // this.count++
                    return true
                }
                else{
                    return false
                }
            }
        }
    
})
export default followUsers