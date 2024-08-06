
// @mui material components
import Grid from "@mui/material/Grid";
import * as React from 'react';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import { useState, useEffect } from "react";
import Divider from '@mui/material/Divider';

// react-router-dom components
import { Link } from "react-router-dom";
import MDAlert from "components/MDAlert";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { Typography, Container } from '@mui/material';
import { apiCall, getRequestWithAuth } from "lib/util";
import AutorenewIcon from '@mui/icons-material/Autorenew';
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import FeedGrid from "components/FeedGrid";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
const PREFIX = 'FORYOU';
import { styled } from '@mui/system';
import { clear } from "localforage";

const classes = {
    root: `${PREFIX}-root`,
    card: `${PREFIX}-card`,
    media: `${PREFIX}-media`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
    [`&.${classes.root}`]: {
        flexGrow: 1,
    },

    [`& .${classes.card}`]: {
        marginBottom: theme.spacing(2),
    },

    [`& .${classes.media}`]: {
        height: 140,
    },
}));

function Reccom() {
    const [feedurl, setFeedurl] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [alignment, setAlignment] = React.useState('web');
    const [loading, setLoading] = useState(false);
    const [dataA, setDataA] = useState([]);
    const [currentData, setCurrentData] = useState(0);
    const [dataB, setDataB] = useState([
        {
            "generalTitle": "Feed Title 1",
            "blogs": [
                { "title": "Blog 1-1", "description": "Description 1-1" },
                { "title": "Blog 1-2", "description": "Description 1-2" }
            ]
        },
        {
            "generalTitle": "Feed Title 2",
            "blogs": [
                { "title": "Blog 2-1", "description": "Description 2-1" },
                { "title": "Blog 2-2", "description": "Description 2-2" }
            ]
        }
    ]);
    let intervalId = null;

    const fetchFeeds = async (value) => {
        setLoading(true);
        if (value === 0) {
            const myfeeds = localStorage.getItem('recommendations');
            if (myfeeds !== null) {
                const parsedFeeds = JSON.parse(myfeeds); // Parse the string back into a JavaScript object
                setDataA(parsedFeeds);
                setLoading(false);
                return;
            }
        }
        const body = {
            isNew: value
        }
        const f = await apiCall('feeds/get_recommendations', setError, body);
        localStorage.setItem('recommendations', JSON.stringify(f));
        console.log(f);
        setDataA(f);
        setLoading(false);
    };

    const [isTokenAvailable, setIsTokenAvailable] = useState(false);

    useEffect(() => {
        // Function to check for JWT token
        const checkTokenAvailability = async () => {
            const token = localStorage.getItem('jwt-token');
            if (token) {
                await fetchFeeds(0);
                setIsTokenAvailable(true); // Update state based on token presence
                clearInterval(intervalId); // Clear interval once token is available
            }
        };
        // Set up an interval to check for the token periodically
        intervalId = setInterval(checkTokenAvailability, 100); // Adjust time as needed

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);


    const handleAlChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    
    // Handle change in input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Reset validation messages on input change

        if (name === 'feedurl') setFeedurl(value);
    };



    return (
        <DashboardLayout>
            {isTokenAvailable  ? ( <div>
                < StyledContainer className={classes.root} >
                 
            
            <Grid container spacing={1} p={10} direction="column" marginTop={-3}>
                        <Grid item mb={7}>

                        <Typography variant="h4" gutterBottom>
                            Today
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Discover new content based on your subscriptions and favourites
                            </Typography>
                        </Grid>
                   
                        <Grid item mb={3}>
                            <Grid container direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
                                <Grid  item>
                        <ToggleButtonGroup
                            sx={{
                                opacity: 1, borderRadius: 2, boxShadow: 1, marginBottom: -1, marginTop: 2,marginRight:15, fontWeight: 'bold'}}
                            color="info"
                            value={alignment}
                            exclusive
                            onChange={handleAlChange}
                            aria-label="Platform"
                            size="large"
                            
                        >
                            <ToggleButton value="web" sx={{ fontWeight: 'bold' }} onClick={() => setCurrentData(0)}>Based on your subscriptions</ToggleButton>
                            <ToggleButton value="android" sx={{ fontWeight: 'bold' }} onClick={() => setCurrentData(1)}>Based on your favourites</ToggleButton>
                                    </ToggleButtonGroup>
                                    </Grid>
                                <Grid item sx={{ cursor: "pointer" }} onClick={() => fetchFeeds(1)} >
                                    <AutorenewIcon fontSize="large" color="info"  />
                                </Grid>
                                </Grid>
                        <Divider sx={{ color: 'blue' }} orientation="horizontal" variant="fullWidth" />


                        </Grid>
                      {currentData ===0 ?( 
                     dataA.map((feed, index) => (
                    <Grid  key={index} >
                            <FeedGrid gridTitle={feed.generalTitle} blogs={feed.blogs} />
                    </Grid>
                    ))
                            
                        ) : (
                             dataB.map((feed, index) => (
                                <Grid  key={index} >
                                        <FeedGrid gridTitle={feed.generalTitle} blogs={feed.blogs} />
                                </Grid>
                                ))
                            
                        )}
                        
                    </Grid>
                </StyledContainer >

            </div>
            ) : (
                <div>Loading or waiting for token...</div>
            )}
        </DashboardLayout>
        
    );
}

export default Reccom;