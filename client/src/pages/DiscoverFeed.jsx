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
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

function DiscoverFeed() {


    const [feedurl, setFeedurl] = useState('');
    const [success, setSuccess] = useState({});
    const [error, setError] = useState('');
    const [feedResults, setFeedResults] = useState([]);
    const [searchMade, setSearchMade] = useState(false); // To track if a search has been made
    const [resultsValue, setResultsValue] = useState(''); // To store the search results
    const handleAddFeed = async (feed) => {
        let isValid = true;
        let messages = { url: '' };
        if (feed.url.length < 3) {
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
                method: 'post', url: `${server}/api/feeds?feed_url=${feed.url}`,
                headers: myheaders
            }).then((response) => {
                console.log('Success:', response.data);
                setSuccess(prev => ({ ...prev, [feed.id]: true }));
                setError('');
            }).catch((error) => {
                console.error('Error:', error);
                setSuccess(prev => ({ ...prev, [feed.id]: false }));
            });
            // await postRequest('feeds', { 'feed_url': feedurl }, error);
        }
    };


    // Other component logic remains the same
    const handleSubmit = async (event) => {
        event.preventDefault();
        setResultsValue('Loading...');
        setSearchMade(true); // Indicate that a search has been made
        setSuccess({});
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
                method: 'post', url: `${server}/api/discover?website_url=${feedurl}`,
                headers: myheaders,
            }).then((response) => {
                console.log('Success:', response.data);
                setResultsValue('No Results Found. Try again with a different url.');
                setFeedResults(response.data);
            }).catch((error) => {
                console.error('Error:', error);
                setFeedResults([]);
                setError('Failed to add Feed');
            });
        }
    };

    return (

        <DashboardLayout>

            <MDBox flexDirection='column' width="100%" alignItems='center'  justifyContent='space-around' py={6}>

                <Grid container direction="column"  justifyContent='space-around'
                    alignItems="stretch">
                    <Card>

                        <Grid item >
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
                                    Discover new RSS Feeds
                                </MDTypography>
                            </MDBox >
                        </Grid>


                        <Grid item container justifyContent="center">

                                <MDBox p={4} mb={1} textAlign="center">
                                    <Paper
                                        component="form"
                                        onSubmit={handleSubmit}
                                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                                    >
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search Website URL"
                                        value={feedurl} // Bind the input to the feedurl state
                                        onChange={(e) => setFeedurl(e.target.value)} // Directly update feedurl state on change
                                        name="feedurl"
                                        />
                                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                            <SearchIcon />
                                        </IconButton>
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
                                        onClick={() => window.open(feedurl, '_blank')} // Add this line
                                    >
                                            <DirectionsIcon />
                                        </IconButton>
                                    </Paper>
                                </MDBox>
                            
                            </Grid>
                        {/* Display error message at the top of the form */}
                    

                    <Grid item container justifyContent="center">
                            <MDBox p={4} mb={1} textAlign="center" sx={{ maxHeight: '450px', overflow: 'auto', width: '80%' }}>
                            {searchMade ? (
                                feedResults.length > 0 ? (
                                    <List>
                                        {feedResults.map((feed) => (
                                            <ListItem key={feed.id}
                                                divider>
                                                <Grid container justifyContent="space-between" alignItems="center" sx={{
                                                    backgroundColor: success[feed.id] === true ? 'lightgreen' : success[feed.id] === false ? 'red' : 'none',
                                                }}  >
                                                    <Grid item >
                                                        <Typography variant="body1">{feed.title}</Typography>
                                                        <Typography variant="caption">{feed.url}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        {success[feed.id] === undefined && (
                                                            <MDButton variant="contained" color="primary" onClick={() => handleAddFeed(feed)}>
                                                                ADD
                                                            </MDButton>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                            <Typography variant="subtitle1">{resultsValue}</Typography>
                                    )
                                    ) : null}
                        </MDBox>
                    </Grid>

                    </Card>        
                </Grid>

            </MDBox>

        </DashboardLayout>
    );
}

export default DiscoverFeed;