import Home from './components/home.js';
import Blog from './components/blog.js';
import Profile from './components/profile.js';
import Search from './components/search.js';
import Login from './components/login.js';
import Signup from './components/signup.js';
import Logout from './components/logout.js';
import UserHome from './components/userhomepage.js';

const routes = [
    {
        path:'/',
        component:Home,
        children:[
            { path:'/',component:UserHome}
        ]
    },
    {path:'/new',component:Blog},
    {path:'/search',component:Search},
    {path:'/profile',component:Profile},
    {path:'/profile/:user_id',component:Profile, props:true},
    {path:'/login',component:Login},
    {path:'/signup',component:Signup},
    {path:'/logout',component:Logout}
]

const router = new VueRouter({
    routes
})

export default router