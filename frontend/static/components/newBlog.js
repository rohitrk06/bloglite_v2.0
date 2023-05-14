const NewBlog = Vue.component('newBlog', {
    template:
        `
    <div class="container-fluid">
        <div v-if='!addSuccess' class="bg-secondary-subtle p-3 rounded">
            <div id="errors" v-if='errors.length != 0' class="mb-1">
                <ul>
                    <li v-for="error in errors" class="text-danger">{{error}}</li>
                </ul>
            </div>
            <div class="row">
                <form method="POST" id="newBlog-formData" enctype="multipart/form-data">
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
                    <div class="row mb-2">
                        <div class="col-10">
                            <div class="row mb-3">
                                <label for="blogmedia" class="col-form-label col-sm-3">Upload images: </label>
                                <div class="col-sm-9">
                                    <input type="file" class="form-control-file form-control mb-2 me-sm-2" id="blogmedia" name="blogmedia" multiple
                                    accept="image/*">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-2 d-flex justify-content-center">
                        <div class="col-1">
                            <button type="button" class="btn btn-primary mb-2" @click="createNew">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div v-else='!addSuccess'>
            <div class='row justify-content-center'>
                <div class='col-10'>
                    <p class='text-success fw-semibold fs-4 fst-italic text-center'> Your blog has been posted successfully.<br> You can now manage your blogs from your profile page. </p>
                </div>
            </div>
            <div class="row justify-content-center d-flex m-5">
                <div class='col-3 justify-content-center'>
                    <router-link to="/" class="btn btn-primary p-2 m-1">
                        <span class="navbar-text ">
                            <i class="bi bi-house-door-fill p-1 "></i>
                            Home
                        </span>
                    </router-link>
                </div>
                <div class='col-3 justify-content-center'>
                    <router-link to="/profile" class="btn btn-primary p-2 m-1">
                        <span class="navbar-text ">
                            <i class="bi bi-person-fill"></i>
                            Profile
                        </span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            title:null,
            description:null,
            addSuccess:false,
            errors:[]
        }
    },
    methods: {
        createNew(){
            this.errors=[]
            if (!this.title){
                this.errors.push('title required')
            }
            if(!this.description){
                this.errors.push('description required')
            }
            if (this.errors.length === 0){
                let formData = new FormData(document.getElementById('newBlog-formData'))
                try{
                    fetch(`/api/user/${this.$store.state.logged_user.id}/blog`,{
                        method:'POST',
                        headers:{
                            'Authentication-Token': localStorage.auth_token
                        },
                        body:formData
                    })
                    .then(res => {
                        res.ok?this.addSuccess=true:this.addSuccess=false;
                        if (!this.addSuccess){
                            res.json()
                            new Error('HTTP Error')
                        }
                    })       
                    .catch(error=>console.error(error))
                }catch(error){
                    console.error(error)
                }
            }
        }
    },
    computed: {
        
    }

})
export default NewBlog