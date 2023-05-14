const Signup = Vue.component('signup',{
    template:
        `
        <div class="container-fluid mt-5">
            <div class="row justify-content-center" v-if='!success'>
                <div class="col-6 justify-content-center shadow-lg rounded">
                    <h3 class='text-center display-6 m-4'>Register</h3>
                    <div class='row justify-content-center'>
                    <form method="POST" class='col-11'>
                        <div id="errors" v-if='errors.length != 0'>
                            <ul>
                                <li v-for="error in errors" class="text-danger">{{error}}</li>
                            </ul>
                        </div>
                        <div class="form-group m-1">
                            <label for="username" class="form-label">Username: </label>
                            <span class="text-danger">*</span>
                            <input type="text" v-model="username" class="form-control" id="username" >
                        </div>
                        <div class="form-group m-1">
                            <label for="email" class="form-label">Email Id: </label>
                            <span class="text-danger">*</span>
                            <input type="text" v-model="email" class="form-control" id="email" >
                        </div>
                        <div class="form-group m-1">
                            <div class="row justify-content-center"> 
                                <div class="col-6">
                                    <label for="password" class='form-label'>Password: </label>
                                    <span class="text-danger">*</span>
                                    <input type="password" v-model="password" id="password"  class='form-control'>
                                </div>
                                <div class="col-6">
                                    <label for="re_password" class='form-label'>Confirm Password: </label>
                                    <span class="text-danger">*</span>
                                    <input type="password" v-model="re_password" id="re_password"  class='form-control'>
                                </div>
                            </div>                            
                        </div>
                        <div class="row justify-content-center m-5 ">
                            <button type="button" class="button btn btn-primary m-2" @click='signup' >Sign Up</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center" v-if='success'>
                <div class="col-4 justify-content-center shadow-lg rounded">
                    <h3 class='text-center display-6 m-4'>Register</h3>
                    <div class='row justify-content-center'> 
                        <p v-if='success' class="text-center text-success"> Hooray! Your registration is complete. We're excited to have you join us. </p>
                        <div class="row justify-content-center me-5 ms-5 mb-3">
                            <router-link to='/login' class="button btn btn-secondary m-2" >Login</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `,
    data: function(){
        return {
            email:null,
            password:null,
            re_password:null,
            username:null,
            errors:[],
            comfirm_password:true,
            success:false,
            registerd:false,
        }
    },
    methods:{
        passwordCheck: function(){
            if (this.password === this.re_password){
                return true
            } 
            return false
        },

        signup: async function(){
            this.errors = [];
            let confirmPassword = this.passwordCheck()
            if (!this.isValidEmail){
                this.errors.push('Invalid Email. Email Should contain "@" symbol')
            }
            if (!this.isValidUsername){
                this.errors.push('Invalid Username. Username should be atleast 5 digit long')
            }
            if (!this.isValidPassword){
                this.errors.push('Invalid Password. Password should be atleast 8 digit long')
            }
            if(!confirmPassword){
                this.errors.push('The password and confirm password fields must match. Please check your entries and try again.')
            }
            if (this.isValidEmail && this.isValidPassword && this.isValidUsername && confirmPassword){
                try{
                    let response = await fetch("/register?include_auth_token",{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({
                            "username":this.username,
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
                        this.registerd = true
                    }

                    try{
                        if(this.registerd){
                            fetch('/api/welcomeMail',{
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                body:JSON.stringify({
                                    'username':this.username,
                                    'email':this.email
                                })
                            }).then(res => res.ok?res.json():new Error('HTTP Error while sending mail')).then(data=>console.log(data)).catch(error=>console.error(error))
                        }
                    }
                    catch(error){
                        console.log(error)
                    }

                    if (this.registerd){
                        fetch('/logout')
                        .then((res)=>{
                            if (res.ok){
                                // console.log('Response OK')
                                this.success = true;
                            }
                        })
                        .catch((error)=>this.errors.push(error)).finally(()=>{
                        if (this.success){
                            // console.log('Remove authToken')
                            localStorage.removeItem('auth_token')
                            this.$store.dispatch('fetch_user')
                            this.$parent.$forceUpdate();
                        }
                        })
                    }
                }catch(e){
                    this.errors.push(e)
                }
            }
        },
    },
    computed:{
        isValidUsername: function(){
            if (!this.username || this.username.length < 5){
                return false
            }
            return true;
        },        
        isValidEmail: function(){
            if (!this.email || !(this.email.includes('@'))){
                return false
            }
            return true;
        },
        isValidPassword: function(){
            if ( !this.password || this.password.length < 8){
                return false
            }
            return true;
        },
    }
})
export default Signup;