import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

import { Grid, Typography } from '@mui/material';
import FeedCard from './FeedCard'; // Adjust the import path as necessary


const FeedGrid = ({ blogs, gridTitle }) => {
    return (
            <>
    <Grid container spacing={0}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ margin: 0 }}>
                    
        {gridTitle}
                </Typography>
    </Grid>
        <Grid container spacing={1}>
            {blogs.map((blog, index) => (
                <Grid item xs={10} key={index}> {/* Ensure full width for each blog card, adjust as needed */}
                    <FeedCard title={blog.title} description={blog.description} url={ blog.rss_url} />
                </Grid>
            ))}
            </Grid>
    </>
    );
};

FeedGrid.propTypes = {
    blogs: PropTypes.array.isRequired, // Add prop type validation for 'blogs'
    gridTitle: PropTypes.string.isRequired, // Add prop type validation for 'gridTitle'
};

export default FeedGrid;