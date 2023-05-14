const deletePost = Vue.component('delete-post',{
    props:["nameID","blog",'user'],
    template:
    `
    <div class="modal fade" :id="nameID" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete Post</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="!success">
                        <p class="text-center fw-semibold text-danger"> Do you want to delete this post ?</p>
                    </div>
                    <div v-if="success">
                        <p class="text-center"> Successfully Deleted </p>
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
    data: function(){
        return{
            success:false
        }
    },
    methods:{
        editPost(){
            let user = this.user
            if (!user){
                user = this.$store.state.logged_user.id
            }
            fetch(`/api/user/${user}/blog/${this.blog.blog_id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':"application/json",
                    'Authentication-Token': localStorage.auth_token
                },
            })
            .then((res)=>{
                if(res.ok){
                    this.success=true
                }else{
                    this.success=false
                    throw new Error('HTTP Error')
                }
            })
            .catch((error)=> console.error(error))
        },
        go(){
            this.$router.push('/')
        }
    }
})
export default deletePost;