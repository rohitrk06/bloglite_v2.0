import followUsers from "./followUsers.js"
const ProfileSidebar = Vue.component('profile-sidebar',{
    template:
    `
    <div >
        <div class="row justify-content-start align-middle mt-3 mb-3 me-0">
            <p class="fw-semibold">Following: </p>
        </div>
        <div class="row p-2">
            <div v-for="user in this.followUsers">
                <follow-user :fUser=user :isfollowing='true' v-if='$store.state.logged_user.id != user.id'></follow-user>
            </div>
        </div>
        <div class="row justify-content-start align-middle mt-3 mb-3 me-0">
            <p class="fw-semibold">Suggestions for you: </p>
        </div>
        <div class="row p-2">
            <div v-for="user in this.nofollowingUser">
                <follow-user :fUser=user v-if='$store.state.logged_user.id != user.id'></follow-user>
            </div>
        </div>
        <div class="row p-2">
            <p class="text-center fw-lighter" style="font-size:12px">
                <span>Indian Institute of Technology, Madras (IIT M).</span><br>
                <span>Copyright Reserved, © 2023.</span>
            </p>
        </div>
    </div>
    `,
    data:function(){
        return {
            followUsers:[],
            nofollowingUser:this.$store.state.currUser_NonFollowing,
        }
    },
    methods:{
        async fetchUser(user_id){
            try{
                let data = await fetch(`/api/user/${user_id}`,{
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'Authentication-Token': localStorage.auth_token
                    },
                }).then((response) =>{
                    if (!response.ok){
                        return null
                    }
                    else{
                        return response.json()
                    }
                }).then((data)=>{return data})
                this.followUsers.push(data)
            }catch(e){
                console.error(e)
            }

        }
    },
    mounted(){
        for (const user_id of this.$store.state.currUser_Following){
            this.fetchUser(user_id)
        }
    }  
})
export default ProfileSidebar