const Home = Vue.component('home', {
    template: `
    <div class="container-fluid mt-3">
        <div class="container-fluid" v-if="!$store.state.auth">
            <div class="row justify-content-center">
                <div class="col-8 m-3">
                    <p class="text-center fs-3">
                        <span class="font-monospace fw-semibold">Blog <span
                                class="bg-warning p-2 text-danger rounded">Lite</span></span>
                    </p>
                    <p class="text-center text-info font-monospace fs-5">
                        Create, publish, and share with ease on Blog Lite.
                    </p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-7 m-3">
                    <p class="text-center font-monospace lh-lg">
                        Welcome to our website! We're thrilled to have you here and can't wait for you to become a part of our community. By registering, you'll unlock exclusive features, gain access to our content, tools, and resources, and connect with like-minded individuals who share your passions. You'll also receive updates on our latest offerings, so you never miss a beat. So why wait? Join us today and start your journey with us. We're here to support you every step of the way!
                    </p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-2 m-3">
                    <div class="row justify-content-center me-5 ms-5 mb-3">
                        <router-link to='/login' class="button btn btn-primary m-2" >Login</router-link>
                    </div>
                </div>
                <div class="col-2 m-3">
                    <div class="row justify-content-center me-5 ms-5 mb-3">
                        <router-link to='/signup' class="button btn btn-primary m-2" >Sign Up</router-link>
                    </div>
                </div>
            </div>
        </div>
        <router-view v-else="!$store.state.auth"></router-view>
    </div>
    `
})
export default Home;