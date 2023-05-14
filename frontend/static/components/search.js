import followUsers from "./followUsers.js";
const Search = Vue.component('search',{
    template:`
    <div class='container-fluid'>
        <div class='row justify-content-center'>
            <div class='col-8'>
                <div class='row m-3'>
                    <input type='search' name='search' v-model='search' class='form-control border border-primary rounded-pill p-3' placeholder='Search'>
                </div>
                <div class='row justify-content-center'>
                    <div class='col-9'>
                        <div v-for="user in this.alluser" class='m-4'>
                            <follow-user :fUser=user :isfollowing='isUserFollowing(user.id)' v-if='$store.state.logged_user.id != user.id'></follow-user>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return {
            search:null,
            alluser:this.$store.state.alluser,
            user:this.$store.state.logged_user
        }
    },
    beforeMount(){
        this.fetchUser()
        this.timer = setInterval(() => {
            this.fetchUser()
          }, 10000)
        // this.fetchUser()
    },
    methods:{
        fetchUser: function(){
            let fetch_success = false
            let id = this.$store.state.logged_user.id
            fetch(`/api/user/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.auth_token
                }
            })
            .then((res)=>res.ok?res.json():new Error('HTTP Error')
            )
            .then(data=>this.user=data).catch((error)=>console.error(error))
        },
        isUserFollowing(user_id){
            // console.log(user_id)
            // console.log(this.user.following[0].user_id)
            // console.log(this.user.following.filter(e => e.user_id == user_id).length)
            if (this.user.following.find(e => e.user_id === user_id)){
                // console.log(true)
                return true
            }
            else{
                // console.log(false)
                return false
            }
        }
    },
    watch:{
        search(newVal){
            fetch("/api/search", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authentication-Token': localStorage.auth_token
                },
                body: JSON.stringify({ search_param: newVal }),
            })
            .then((res) => {
                if (!res.ok) {
                throw new Error("HTTP Error");
                }
                return res.json()
            })
            .then((data) => {
                this.alluser = data
            })
            .catch((error) => {
                alert("Something went wrong.")
                console.log(error)
            })
        }
    }
})
export default Search;   