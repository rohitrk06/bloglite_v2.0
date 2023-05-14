import BlogComponent from "./blog_component.js"
import ProfileSidebar from "./profile_sidebar.js"
const Profile = Vue.component('profile',{
    props:['user_id'],
    template:
    `
    <div class="container-fluid mt-3">
        <div class="row justify-content-start align-items-center m-2">
            <div class="col-4">
                <div class="d-flex align-content-start">
                    <img src="/static/images/profile.webp" class="rounded-circle p-2" style="width:9rem;"/>
                    <div class="d-flex flex-column justify-content-center">
                        <p class="fs-3 font-monospace fw-medium m-1 text-primary">{{ getusername }}</p>
                        <p class="fs-5 font-monospace fst-italic fw-medium m-1">{{ getemail }}</p>
                    </div>
                </div>
            </div>
            <div class="col-2">
                <div class='d-flex flex-column'>
                    <p class="text-center fst-italic font-monospace fs-5">Following</p>
                    <p class="text-center display-6">{{getfollowing}}</p>
                </div>
            </div>
            <div class="col-2">
                <div class='d-flex flex-column'>
                    <p class="text-center fst-italic font-monospace fs-5">Follower</p>
                    <p class="text-center display-6">{{getfollowers}}</p>
                </div>
            </div>
            <div class="col-2">
                <div class='d-flex flex-column'>
                    <p class="text-center fst-italic font-monospace fs-5">Total Posts Created</p>
                    <p class="text-center display-6">{{getpost}}</p>
                </div>
            </div>
            <div class="col-2">
                <div class='d-flex flex-column'>
                    <button @click='exportReport' v-if="isCurrUser" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exportModal">Export CSV</button>
                </div>
            </div>
            
            <div class="modal fade" id="exportModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Export Blogs</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Export Status : {{ task_status }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" v-if='task_status==="SUCCESS"' @click='download'>Download</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <p class='fs-4 font-monospace fst-italic m-3'>User's Blog</p>
        <div class='row justify-content-start'>
            <div class="col-8">
                <div class="row m-3 justify-content-center" v-for="blog in blogs">
                    <div class="col-11">
                        <blog-component :blog="blog" :isCurrUser="isCurrUser" :user="user_id" class="shadow rounded m-2 p-1"></blog-component>
                    </div>
                </div>
            </div>
            <div class="col-4" v-if="isCurrUser">
                <profile-sidebar></profile-sidebar>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return {
            user:{
                username:'',
                email:'',
                following:[],
                followers:[],
                blogs:[],
                id:this.$store.state.logged_user.id
            },
            task_id:null,
            task_status:null,
        }
    },
    methods:{
        exportReport(){
            fetch(`/api/export/${this.user.id}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.auth_token
                }
            })
            .then((res)=>res.ok?res.json():new Error('HTTP Error for export job'))
            .then(data=>this.task_id = data.task_id).catch((error)=>console.error(error));

            let interval = setInterval(()=>{
                fetch(`/api/export_status`,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.auth_token
                    },
                    body: JSON.stringify({
                        'task_id':this.task_id
                    })
                })
                .then((res)=>res.ok?res.json():new Error('HTTP Error at fetching status for export job'))
                .then(data=>{
                    this.task_status = data.task_status;
                    if (data.task_status==='SUCCESS'){
                        clearInterval(interval)
                    }else{
                        console.log('Please Wait!!! export job in Progress')
                    }
                }).catch(error=>{
                    clearInterval(interval);
                    console.error(error)
                })
            },500)
        },
        download(){
            window.location.href = `/get_file/${this.user.id}`
        },
        fetchUser: function(){
            let fetch_success = false
            let id = this.user_id
            if (!id){
                id =  this.$store.state.logged_user.id
            }
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
        }
    },
    computed:{
        blogs (){
            return this.user.blogs.sort((a,b)=>(Date.parse(a.created)-Date.parse(b.created)?-1:1))
        },
        isCurrUser(){
            return this.$store.state.logged_user.id == parseInt(this.user_id) || (!this.user_id)
        },
        getusername(){
            return this.user.username
        },
        getemail(){
            return this.user.email
        },
        getfollowing(){
            return this.user.following.length
        },
        getfollowers(){
            return this.user.followers.length
        },
        getpost(){
            return this.user.blogs.length
        }
    },
    watch:{

    },
    mounted(){
        this.fetchUser()
        this.timer = setInterval(() => {
            this.fetchUser()
          }, 1000)
        // this.fetchUser()
    },
    beforeDestroy() {
        clearInterval(this.timer)
      }
})
export default Profile;