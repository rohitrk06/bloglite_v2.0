import followUsers from "./followUsers.js"

const UserSidebar = Vue.component('user-sidebar',{
    template:
    `
    <div >
        <div class="row justify-content-start align-middle mt-3 mb-3 me-0">
            <div class="col-3"> 
                <img src="static/images/profile.webp" class="rounded-circle w-75">
            </div>
            <div class="col-9 align-middle">
            <p class="fs-5  font-monospace fw-medium m-1">{{$store.state.logged_user.username}}</p>
            <p class=" fst-italic fw-lighter m-1">{{$store.state.logged_user.email}}</p>
            </div>
        </div>
        <div class="row p-2">
            <div class="container-fluid">
                <p><strong>Suggestions for you </strong></p>
            </div>

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
    computed:{
        nofollowingUser(){
            return this.$store.state.currUser_NonFollowing?this.$store.state.currUser_NonFollowing.slice(0,5):this.$store.state.currUser_NonFollowing
        }
    }   
})
export default UserSidebar