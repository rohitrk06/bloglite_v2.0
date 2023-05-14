const editPost = Vue.component('edit-post',{
    props:["nameID","blog",'user'],
    template:
    `
    <div class="modal fade" :id="nameID" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Post</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <ul>
                            <p class="text-danger text-center" v-for="error in errors">{{error}}</p>
                        </ul>
                    </div>
                    <form method="POST" id="editBlog-formData" enctype="multipart/form-data" v-if="!success">
                        <div class="row mb-2">
                            <div class="col-10">
                                <div class="form-floating">
                                    <input type="text" class="form-control mb-2 me-sm-2" id="title" name='title'  v-model="title" placeholder="Blog Title">
                                    <label for="title" class="form-label">Title</label>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col">
                                <div class="form-floating">
                                    <textarea class="form-control mb-2 me-sm-2" id="description"
                                        placeholder="Enter Blog content here" style="height: 12rem" v-model="description" name='description'> </textarea>
                                    <label class="form-label" for="description">Description</label>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div v-if="success">
                        <p class="text-center"> Successfully Edited </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-if="!success">Close</button>
                    <button type="button" class="btn btn-primary" @click="editPost" v-if="!success">Proceed</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-if="success" @click="go">Go to Home</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data:function(){
        return{
            description:this.blog.description,
            title: this.blog.title,
            success:false,
            errors:[]
        }
    },
    methods:{
        editPost(){
            let user = this.user
            if (!user){
                user = this.$store.state.logged_user.id
            }
            fetch(`/api/user/${user}/blog/${this.blog.blog_id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':"application/json",
                    'Authentication-Token': localStorage.auth_token
                },
                body:JSON.stringify({
                    "title":this.title,
                    "description":this.description
                })
            })
            .then((res)=>{
                if(res.ok){
                    this.success=true
                }else{
                    this.success=false;
                }
                res.json()
            })
            .catch((error)=> console.error(error))
        },
        go(){
            this.$router.push('/')
        }
    }
})
export default editPost;