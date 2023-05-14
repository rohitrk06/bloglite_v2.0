// import router from "../routes.js"
const Login = Vue.component('login', {
    template:
        `
    <div class="container-fluid mt-5">
        <div class="row justify-content-center">
            <div class="col-4 justify-content-center shadow-lg rounded">
                <h3 class='text-center display-6 m-4'>Login</h3>
                <div class='row justify-content-center'>
                <form method="POST" class='col-9'>
                    <div id="errors" v-if='errors.length != 0'>
                        <ul>
                            <li v-for="error in errors" class="text-danger">{{error}}</li>
                        </ul>
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">Email Id: </label>
                        <input type="text" v-model="email" class="form-control" id="email" >
                    </div>
                    <div class="form-group">
                        <label for="password" class='form-label'>Password: </label>
                        <input type="password" v-model="password" id="password"  class='form-control'>
                    </div>
                    <div class="row justify-content-center me-5 ms-5 mt-3">
                        <button type="button" class="button btn btn-primary m-2" @click='login' >Login</button>
                    </div>
                    <div class="row justify-content-center">
                        <p class='text-center m-2'>OR</p>
                    </div>
                    <div class="row justify-content-center me-5 ms-5 mb-3">
                        <router-link to='/signup' class="button btn btn-secondary m-2" >Sign Up</router-link>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return {
            errors:[],
            email:null,
            password:null
        }
    },
    methods:{
        login: async function(){
            if (this.isValidEmail && this.isValidPassword){
                this.errors = []
                try{
                    let response = await fetch("http://127.0.0.1:8000/login?include_auth_token",{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({
                            "email":this.email,
                            "password":this.password
                        })
                    })
                    if (!response.ok){
                        let data = await response.json()
                        console.log(data.response.errors)
                        for (const error in data.response.errors) {
                            this.errors.push(data.response.errors[error])
                        }
                    }
                    else{
                        let data = await response.json()
                        localStorage.auth_token = data.response.user.authentication_token
                        this.$store.dispatch('fetch_user');
                    }
                }catch(e){
                    this.errors.push(e)
                }
            
                if (this.errors.length == 0){
                    this.$router.push({path:'/'})
                }
            }
            else{
                this.errors.push('Invalid Username or Password');
            }
            this.$parent.$forceUpdate();
        }
    },
    computed:{
        isValidEmail(){
            if (!this.email || !(this.email.includes('@'))){
                return false
            }
            return true;
        },

        isValidPassword(){
            if (!this.password || this.password.length < 8 ){
                return false
            }
            return true;
        },
    }
})
export default Login;