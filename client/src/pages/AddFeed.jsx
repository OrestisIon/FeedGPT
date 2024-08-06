// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";
import MDAlert from "components/MDAlert";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import axios from "axios";
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { postRequest } from "lib/util"; 
import { token } from "stylis";

function AddFeed() {
    const [feedurl, setFeedurl] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Handle change in input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Reset validation messages on input change

        if (name === 'feedurl') setFeedurl(value);
    };

    // Other component logic remains the same
    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        let messages = { url: '' };
        if (feedurl.length < 3) {
            messages.url = 'Url must be non-empty.';
            isValid = false;
        }
        if (isValid) {
            const token = localStorage.getItem('jwt-token');
            const myheaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
            axios({
                method: 'post', url: `${server}/api/feeds?feed_url=${feedurl}`,
                headers:  myheaders 
            }).then((response) => {
                console.log('Success:', response.data);
                setSuccess(true);
                setError('');
            }).catch((error) => {
                console.error('Error:', error);
                setError('Failed to add Feed');
                setSuccess(false);
            });
            // await postRequest('feeds', { 'feed_url': feedurl }, error);
        }
    };

    return (
        <DashboardLayout>
            <MDBox flexDirection='column' width="100%" alignItems='center' justifyContent='space-around'  py={6}>
                
                    <Grid container  direction="column" justifyContent='space-around'
                    alignItems="center">
                    <Card>

                        <Grid  item >
                        <MDBox
                        variant="gradient"
                        bgColor="transparent"
                        borderRadius="lg"
                        coloredShadow="primary"
                        opacity={1}
                        p={4}
                        mb={6}
                            textAlign="center"
                            sx={{ whiteSpace: 'nowrap' }}
                    >
                        <MDTypography variant="h2" textGradient={true} fontWeight="medium" color="dark" mt={1}>
                            Add New Feed
                        </MDTypography>
                            </MDBox >
                        </Grid>
                            
                        <MDBox component="form" role="form" onSubmit={handleSubmit}>
                            <Grid  item >
                        <MDBox   p={4} mb={1}>
                                <MDInput sx={{width: "100%" }} type="url" label="Feed URL" size="large" value={feedurl} onChange={(e) => setFeedurl(e.target.value)}  />
                                </MDBox>
                        </Grid>
                        
                            <Grid item p={4} textAlign="center"  mb={10} >
                                <MDButton  sx={{ width: "70%" }} size="large" type="submit" variant="gradient" color="info">
                                Press to Add
                            </MDButton>
                            </Grid>
                        </MDBox>
                            {/* Display error message at the top of the form */}
                            
                        <MDBox alignItems='center' textAlign="center" mx={50}  display="flex" justifyContent="center">
                            <MDTypography sx={{ textAlign: "center", width: "100%" }} variant="button" color="text">
                                {error && (
                                    <MDAlert textAlign="center" color="error">
                                        <MDTypography textAlign="center" fontWeight="bold" color="white">Failed to add Feed</MDTypography>
                                    </MDAlert>
                                )}
                                {success && (
                                <MDAlert  textAlign="center" color="success">
                                    <MDTypography textAlign="center" fontWeight="bold" color="white">Feed Added Successfully!</MDTypography>
                                </MDAlert>
                                )}
                                </MDTypography>
                        </MDBox>
                    </Card>
                    </Grid>
                
                </MDBox>
            
        </DashboardLayout>
    );
}

export default AddFeed;