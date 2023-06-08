import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotAssignedIcon from '@mui/icons-material/PendingActions';
import OnGoingIcon from '@mui/icons-material/Assignment';
import CompletedIcon from '@mui/icons-material/AssignmentTurnedIn';
import SocailWorkersIcon from '@mui/icons-material/Group';
import SocialWorkerDashboard from "../Pages/SocialWorkerDashboard";
import { useSelector } from "react-redux";
const SidebarData= [ 
    {
        title: "Dashboard",
        icon: <DashboardIcon/>,
        link: "/dashboard",
    },
    {
        title: "Pending Cases",
        icon: <NotAssignedIcon/>,
        link: "/pending",
    },{
        title: "On Going Cases",
        icon: <OnGoingIcon/>,
        link: "/child-table",
    },{
        title: "Completed Cases",
        icon: <CompletedIcon/>,
        link: "/child-table",
    },{
        title: "Social Workers",
        icon: <SocailWorkersIcon/>,
        link: "/child-table",
    },
]


export default  SidebarData;

