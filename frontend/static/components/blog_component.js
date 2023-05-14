import editPost from "./edit_blog.js"
import deletePost from "./delete_blog.js"
const BlogComponent = Vue.component('blog-component',{
    props:['blog',"isCurrUser",'user'],
    template:
    `
    <div class="d-flex align-items-center border">
        <div class="container">
            <div class="m-2">
                <div class="row">
                    <div class="col-9">
                        <p class="display-6" >{{blog.title }} 
                            <br>
                            <span class="fst-italic" style="font-size:0.7rem;">
                                By : 
                                <router-link :to='getRouteLink(blog_id)' class="font-monospace  fst-italic text-dark"> {{username}} </router-link>
                            </span>
                        </p>
                        <p v-if="blog.updated" class="fst-italic" style="font-size:0.5rem;">Updated on: {{blog.updated}}</p>
                        <p v-else="blog.updated" class="fst-italic" style="font-size:0.5rem;">Created on: {{blog.created}}</p>
                    </div>
                    <div v-if="isCurrUser" class="col-3 d-flex flex-columns align-items-center justify-content-center">
                        <button class="btn btn-primary p-2 m-1" data-bs-toggle="modal" :data-bs-target="editBackdropIDhash">
                            <span class="navbar-text ">
                                <i class="bi bi-pencil-square"></i>
                                Edit
                            </span>
                        </button>
                        <edit-post :nameID="editBackdropID" :blog="blog" :user="user"></edit-post>
                        <button  class="btn btn-danger p-2 m-1" data-bs-toggle="modal" :data-bs-target="deleteBackdropIDhash" > 
                            <span class="navbar-text ">
                                <i class="bi bi-trash3"></i>
                                Delete
                            </span>
                        </button>
                        <delete-post :nameID="deleteBackdropID" :blog="blog" :user="user"></delete-post>
                    </div>
                </div>    
            </div>
            <hr>
            <div class="m-2">
                <p>{{blog.description}}</p>
            </div>
            <div :id="blog.blog_id" class="carousel slide" v-if="mediaPresent!=0">
                <div class="carousel-inner">
                    <div class="carousel-item" :class="active(index)" v-for="(image,index) in blog.b_media">
                        <div class="d-flex align-items-center object-fit-fill" >
                            <img :src="image.media_url"  style="max-height: 500rem; max-width:100rem">
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" :data-bs-target="ds_targer" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" :data-bs-target="ds_targer" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
    `,
    data:function(){
        return{
            username:null,
            blog_id : null
        }
    },
    methods:{
        active(index){
            return !index?'active':""
        },
        async fetchUser(user_id) {
            try {
                let data = await fetch(`/api/user/${user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.auth_token
                    },
                }).then((response) => {
                    if (!response.ok) {
                        return null
                    }
                    else {
                        return response.json()
                    }
                }).then((data) => { return data })
                this.username = data.username
                this.blog_id = data.id
            } catch (e) {
                console.error(e)
            }
        },
        getRouteLink(user_id){
            return `/profile/${user_id}`
        },
        
    },
    computed:{
        mediaPresent(){
            let count=0
            for(const image of this.blog.b_media){
                if (image.media_url){
                    // console.log(image.media_url)
                    count++
                }
            }
            return count
        },
        ds_targer(){
            return "#"+this.blog.blog_id
        },
        editBackdropID(){
            return "edit"+this.blog.blog_id
        },
        editBackdropIDhash(){
            return "#edit"+this.blog.blog_id
        },
        deleteBackdropID(){
            return "delete"+this.blog.blog_id
        },
        deleteBackdropIDhash(){
            return "#delete"+this.blog.blog_id
        }

    },
    mounted(){
        this.fetchUser(this.blog.user_id)
    }
   
})
export default BlogComponent;