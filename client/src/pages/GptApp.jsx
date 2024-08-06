import MDBox from "components/MDBox"
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { BubbleChat } from 'flowise-embed-react'
const Home = () => {
    return (
        <DashboardLayout>
            <DashboardNavbar />
        <MDBox py={3}>
                
                <BubbleChat chatflowid="b928b0a7-2f83-4ed9-862f-8989f7228a5f" apiHost="http://localhost:3000" />
            </MDBox>
        </DashboardLayout>
    )
}
export default Home
