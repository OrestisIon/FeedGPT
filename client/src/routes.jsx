
import Dashboard from "pages/dashboard";
import Login from "pages/auth/Login";
import Signup from "pages/auth/Signup";
import CategoriesFeeds from "pages/CategoriesFeeds";
import AllFeeds from "pages/AllFeeds";
import EditFeeds from "pages/EditFeeds";
import FeedIcon from '@mui/icons-material/Feed';
import AddLinkIcon from '@mui/icons-material/AddLink';// @mui icons
import Icon from "@mui/material/Icon";
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ForYou from "pages/ForYou";
import ViewFeed from "pages/ViewFeed";
import AddFeed from "pages/AddFeed";
import Reccom from "pages/Reccom";
import DiscoverFeed from "pages/DiscoverFeed";
import Profile from "pages/config/Profile";
import Settings from "pages/config/Settings";
const routes = [
    {
        type: "title",
        title: "Personailzed",
        name: "personailzed",
        key: "personailzed",
        to_dashboard: true,
        icon: <Icon fontSize="small">assignment</Icon>,
    },
    {
        type: "collapse",
        name: "For You",
        key: "dashboard",
        icon: <DashboardIcon fontSize="small"></DashboardIcon>,
        route: "/dashboard",
        to_dashboard: true,
        component: Reccom,
    },
    {
        type: "collapse",
        name: "My Subscriptions",
        key: "fyp",
        icon: <SubscriptionsIcon fontSize="small"></SubscriptionsIcon>,
        route: "/MyFeeds",
        to_dashboard: true,
        component: ForYou,
    },
    {
        type: "collapse",
        name: "Sign In",
        key: "sign-in",
        icon: <Icon fontSize="small">login</Icon>,
        route: "/login",
        to_dashboard: false,
        component: Login,
    },
    {
        type: "collapse",
        name: "Sign Up",
        key: "sign-up",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/register",
        to_dashboard: false,
        component: Signup,
    },
    {
        type: "collapse",
        name: "View Feed",
        key: "view-feed",
        route: "/view-feed",
        icon: <Icon fontSize="small">assignment</Icon>,
        to_dashboard: false,
        component: ViewFeed,
    },
    {
        type: "collapse",
        name: "Saved",
        key: "saved",
        icon: <BookmarksIcon fontSize="small"></BookmarksIcon>,
        route: "/categories-feeds",
        to_dashboard: true,
        component: CategoriesFeeds,
    },
    {
        type: "divider",
        key: "all-feeds-divider",
        to_dashboard: true,
        icon: <Icon fontSize="small">assignment</Icon>,
    },
    {
        type: "title",
        title: "All Feeds",
        name: "All Feeds",
        to_dashboard: true,
        key: "d1",
    },
    {
        type: "collapse",
        name: "All Feeds",
        key: "all-feeds",
        icon: <FeedIcon fontSize="small"></FeedIcon>,
        to_dashboard: true,
        route: "/all-feeds",
        component: AllFeeds,
    },
    {
        type: "collapse",
        name: "Add Feeds",
        key: "edit-feed",
        icon: <AddLinkIcon fontSize="small"></AddLinkIcon>,
        route: "/add-feed",
        to_dashboard: true,
        component: AddFeed,
    },
    {
        type: "collapse",
        name: "Discover Feeds",
        key: "discover-feeds",
        icon: <TravelExploreIcon fontSize="small"></TravelExploreIcon>,
        route: "/discover-feeds",
        to_dashboard: true,
        component: DiscoverFeed,
    },

    {
        type: "collapse",
        name: "My Profile",
        key: "my-profile",
        icon: <TravelExploreIcon fontSize="small"></TravelExploreIcon>,
        route: "/myprofile",
        to_dashboard: false,
        component: Profile,
    },
    {
        type: "collapse",
        name: "System Settings",
        key: "settings",
        icon: <TravelExploreIcon fontSize="small"></TravelExploreIcon>,
        route: "/settings",
        to_dashboard: false,
        component: Settings,
    },



];

export default routes;