import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import { apiCall } from 'lib/util';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { styled as st } from 'styled-components'

const Favico = st.img`
	width: 16px;
	height: 16px;
	vertical-align: middle;
`

const PREFIX = 'FORYOU';

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
// Assuming the sum function is used only in this component
const sum = (arr) => {
    return arr.reduce((a, b) => {
        return a + (b['unreads'] || 0);
    }, 0);
};

function ImageComponent({ imageData }) {
    // The imageData prop is expected to be an object like:
    // { data: "base64string", id: 3, mime_type: "image/x-icon" }

    // Construct the full src string
    const imageSrc = `data:${imageData.mime_type};base64,${imageData.data}`;

    return (
        <Favico
            src={imageData.data}
            alt="Icon"
        />
    );
}


ImageComponent.propTypes = {
    imageData: PropTypes.shape({
        data: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        mime_type: PropTypes.string.isRequired,
    }).isRequired,
};


function MySubscriptions() {
    const [error, setError] = useState(null);
    const [feeds, setFeeds] = useState([]);
    const [feedIcons, setFeedIcons] = useState({});
    const fetchFeedsCalled = useRef(false);
    let allicons = useRef([]);
    // create an array of feed ids and fetch icons for each feed
    let feedIds = feeds.map(feed => feed.icon.feed_id);


    const fetchIcon = async (iconid) => {
        try {
            const iconData = await apiCall('feeds/' + iconid + '/icon', setError);
            return iconData;
        } catch (error) {
            console.error('Error fetching feed icon:', error);
            setError(error);
        }
    };

    const fetchFeeds = async () => {
        if (fetchFeedsCalled.current) return;
        fetchFeedsCalled.current = true;
        try {
            const f = await apiCall('feeds', setError);
            // Then fetch icons for each feed
            const iconPromises = f.map(feed => {
                if (feed.icon) {
                    return fetchIcon(feed.icon.feed_id);
                }
                return Promise.resolve(null); // Return null for feeds without icons to keep the array aligned
            });

            // Wait for all icons to be fetched
            const icons = await Promise.all(iconPromises);
            // Filter out any nulls (in case some feeds didn't have icons)
            const validIcons = icons.filter(icon => icon !== null);
            allicons.current.push(...validIcons); // Spread operator to push each icon individually

            // Assuming you want to log the first valid icon
            console.log('feedIcons updated:', allicons.current[0]); // Adjusted index to 0 for the first element

            setFeeds(f); // Set the feeds first
        } catch (error) {
            console.error('Error fetching feeds:', error);
            setError(error);
        }
    };

    useEffect(() => {
        //make sure allicoins is empty first
        allicons.current = [];
        fetchFeeds();
    }, []);

    useEffect(() => {
        
    }, [allicons]);

    return (
        < StyledContainer className={classes.root} >
            <Typography variant="h4" gutterBottom>
                Today
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                The insights you need to keep ahead
            </Typography>
            <Grid container spacing={2}>
                {feeds.map((feed, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card className={classes.card}>
                            {allicons.current && (
                                
                                <ImageComponent imageData={allicons.current[index]} />
                            )}
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {feed.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {feed.feed_url}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </StyledContainer >
    );
}

export default MySubscriptions;