import { lazy } from 'react';

// Lazy load all page components for code splitting
const Home = lazy(() => import("./Home/Home"));
const Login = lazy(() => import("./Login/Login"));
const SignupPage = lazy(() => import("./Signupform/Signupform"));
const PostForm = lazy(() => import("./PostForm/PostForm"));
const Profile = lazy(() => import("./Profile/Profile"));
const Post = lazy(() => import("./Post/Post"));
const EditPost = lazy(() => import("./EditPost/EditPost"));
const VerifyEmail = lazy(() => import("./VerifyEmail/VerifyEmail"));
const Search = lazy(() => import("./Search/Search"));
const Settings = lazy(() => import("./Settings/Settings"));
const ResetPassword = lazy(() => import("./ResetPassword/ResetPassword"));
const NotFound = lazy(() => import("./NotFound/NotFound"));

export {
    Home,
    Login,
    SignupPage,
    PostForm,
    Profile,
    Post,
    EditPost,
    VerifyEmail,
    Search,
    Settings,
    ResetPassword,
    NotFound
}