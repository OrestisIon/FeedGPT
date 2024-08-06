import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import { apiCall, getRequestWithAuth } from 'lib/util';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loading from 'pages/loading';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
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
function ForYou() {
    const navigate = useNavigate();
    // const { pathname } = useLocation();
    const [error, setError] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
    // const [, updateState] = React.useState();
    // const forceUpdate = useCallback(() => updateState({}), []);

    const fetchFeeds = async () => {
      try {
        setLoading(true);
        const f = await apiCall('feeds', setError)
        // const categories = f.map(feed => feed.category).filter((v, i, a) => a.indexOf(v) === i); // Unique categories

        // let feedTree = [
        //   { id: -1, title: 'All', fetch_url: 'entries', unreads: 0 },
        //   { id: -2, title: 'Starred', fetch_url: 'entries?starred=true', unreads: 0 },
        //   // Add categories and feeds to feedTree...
        // ];
        // console.log(feedTree);
        // console.log(f);
        // console.log(JSON.stringify(f));

        // Add feeds to categories...
        // Omitted for brevity
        // Fetch icons for each feed
        const fetchIcons = async () => {
          const icons = await Promise.all(
            f.filter(feed => feed.icon) // Filter out feeds without an icon
              .map(async feed => {
                const icon = await apiCall(`icons?icon_id=${feed.icon.icon_id}`, setError).catch(() => null);

                return { ...feed, "icon_data": icon || null }; // Append icon to feed, or set it to null if there was an error
              })
          );
          setFeeds(icons); // Update state with feeds including icons
          return icons;
        };

        const nfeeds = await fetchIcons(); // Fetch icons after fetching feeds
        // After fetching and processing, save the feeds to local storage
        localStorage.setItem('feeds', JSON.stringify(nfeeds));
        
      } catch (error) {
        console.error('Error fetching feeds:', error);
        setError(error);
      }
      finally {
        setLoading(false);

      }
    };

    useEffect(() => {
      const cachedTime = localStorage.getItem('feedsLastCached');
      const currentTime = new Date().getTime();

      // Invalidate cache after a certain period,30 Minutes (1800000 milliseconds)
      if (!cachedTime || currentTime - cachedTime > 1800000) {
        fetchFeeds();
        localStorage.setItem('feedsLastCached', currentTime.toString());
      } else {
        // Load from local storage if within cache period
        const feedsFromStorage = localStorage.getItem('feeds');
        if (feedsFromStorage) {
          console.log('Feeds loaded from cache:' + feedsFromStorage);
          setFeeds(JSON.parse(feedsFromStorage));
          setLoading(false);
        } else {
          // Fallback to fetching if for some reason the data isn't in local storage
          fetchFeeds();
          localStorage.setItem('feedsLastCached', currentTime.toString());
        }
      }
    }, []);
  
    // Function to transform the base64 string into a usable image source URL
    const getImageSrcFromBase64 = (icon) => {
      const { data, mime_type } = icon;
      // Assuming `data` includes the format 'image/png;base64,'; if not, adjust accordingly
      const base64String = data.split('base64,')[1];
      return `data:${mime_type};base64,${base64String}`;
    };

  const handleCardClick = (feed, event) => {
    event.preventDefault(); // Prevent default action
    navigate("/view-feed", { state: feed });
    console.log('Card clicked:', feed);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      < StyledContainer className={classes.root} >
      <Typography variant="h4" gutterBottom>
        All My Subscriptions
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        View all your subscriptions in one place
        </Typography>
        <IconButton onClick={fetchFeeds}>
          <RefreshIcon />
        </IconButton>
      <Grid container spacing={2}>
        {feeds.map((feed, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card className={classes.card} onClick={(event) => handleCardClick(feed, event)}>
              {feed.icon_data && (
                <CardMedia
                  sx={{
                    height: 140, // Adjust the height as needed
                    objectFit: 'contain', // Ensure the image fits within the box without being cut off
                    width: '100%', // Ensure the image takes the full width of the container
                  }}
                  component="img" // Specify that the CardMedia is an image
                  className={classes.media}
                  image={getImageSrcFromBase64(feed.icon_data)}
                  title={feed.title}
                />
              )}
              <CardContent>
                <Typography variant="h5"  component="h2">
                  {feed.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" onClick={(e) => e.stopPropagation()}>
                  <Link to={feed.site_url} onClick={(e) => e.stopPropagation()}>{feed.site_url}</Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </StyledContainer >
      </DashboardLayout>

    );
}

export default ForYou;



