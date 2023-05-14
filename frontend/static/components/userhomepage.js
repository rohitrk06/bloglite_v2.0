import UserSidebar from "./user_sidebar.js";
import BlogComponent from "./blog_component.js";
const UserHome = Vue.component('blog', {
    data: function () {
        return {
            blogs: [],
            followUsers:[],
            currUser:{}
        }
    },
    template:
        `
    <div class="row justify-content-between">
        <div class="col-9 ">
            <div class='row justify-content-center'>
                <div class="col-8" v-for="blog in sorted_blogs">
                   
                <blog-component :blog="blog"  class="shadow rounded m-2 p-1"></blog-component>
                        
                </div>
            </div>
        </div>
        <div class="col-3 ">
            <user-sidebar></user-sidebar>
        </div>
    </div>
        `,
    methods: {
        async fetchUser(user_id) {
            try {
                fetch(`/api/user/${user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.auth_token
                    },
                }).then((response) => {
                    if (!response.ok) {
                        new Error('HTTP Error while fetching user details')
                    }
                    else {
                        return response.json()
                    }
                }).then((data) => this.followUsers.push(data))
                
            } catch (e) {
                console.error(e)
            }
        },
        get(user_id){
            this.followUsers.find((user)=>user.id==user_id)
        },
    
        all_blogs(){
            this.blogs=[]
            for (const user of this.followUsers){
                for (const blog of user.blogs){
                    this.blogs.push(blog)
                }
            }
        },
    },
    computed:{
        sorted_blogs(){
            this.all_blogs();
            let sorted_blog = this.blogs.sort((a,b)=>(Date.parse(a.created)-Date.parse(b.created)?-1:1))
            console.log(sorted_blog)
            return this.blogs.sort((a,b)=>(Date.parse(a.created)-Date.parse(b.created)?-1:1))
        }
    },
    beforeMount() {
        for (const user_id of this.$store.state.currUser_Following) {
            this.fetchUser(user_id)
        }
    },
   
})


export default UserHome;