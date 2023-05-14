const Logout = Vue.component(`logout`,{
    template:`
    <div class="container-fluid mt-5">
        <div class="row justify-content-center">
            <div class="col-4 justify-content-center shadow-lg rounded">
                <h3 class='text-center display-6 m-4'>Logout</h3>
                <div class='row justify-content-center'> 
                    <p v-if='success' class="text-center text-success"> Logout Successfully </p>
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
            success: null,
            errors:[]
        }
    },
    beforeMount(){
        fetch('http://127.0.0.1:8000/logout')
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
            this.$store.dispatch('fetch_user');
            this.$parent.$forceUpdate();
        }
        })
    }
})
export default Logout;