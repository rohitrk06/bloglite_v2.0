import UserSidebar from "./user_sidebar.js";
import NewBlog from "./newBlog.js";
const Blog = Vue.component('blog',{
    template:
        `
    <div class="container-fluid mt-3">
        <div class="row justify-content-between">
            <div class="col-9  p-3">
                <div class="row mb-4">
                    <p class="display-6 fst-italic">New Blog</p>
                </div>
                <div class="row justify-content-center">
                    <div class="col-9 bg-tertiary">
                        <newBlog></newBlog>
                    </div>
                </div>
            </div>
            <div class="col-3 ">
                <user-sidebar></user-sidebar>
            </div>
        </div>
    </div>
        `,
    
})
export default Blog;