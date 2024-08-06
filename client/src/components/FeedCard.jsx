
import { Card, CardContent, Typography, Grid } from '@mui/material';

import PropTypes from 'prop-types';

const FeedCard = ({ title, description, url }) => {
    return (
        <Card sx={{ margin: 0, padding: 0.5 }}>
            <Grid container>
                <Grid item xs={12} container direction="column" justifyContent="center">
                    <CardContent>
                        {title && (<Typography variant="h5" component="div">
                            {title}
                        </Typography>
                        )}
                        {url && (<Typography variant="h5" component="div">
                            {url}
                        </Typography>
                        )}
                        {description && (
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        )}

                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
};

FeedCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
};

export default FeedCard;