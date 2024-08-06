// Create a ViewFeed component that will display entries of the feed.
// It will take the feed as a prop and call the API to fetch the entries. 
// The entries will be displayed in a list with the title, date, and URL.
import React, { useState, useEffect } from 'react';
import { apiCall, getRequestWithAuth } from 'lib/util';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { MDBContainer, MDBRow, MDBCol, MDBRipple } from 'mdb-react-ui-kit';
import { Typography } from '@mui/material';
import MDTypography from "components/MDTypography";
import { Link } from 'react-router-dom'
import { Grid } from '@mui/material';
import MDButton from 'components/MDButton';
import MDBadge from 'components/MDBadge';
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MDPagination from 'components/MDPagination';
import MDInput from "components/MDInput";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import MDBox from 'components/MDBox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewFeed = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [entries, setEntries] = useState([]);
    const [total, setTotal] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();
    const [offset, setOffset] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [query, setQuery] = useState('');
    const [totalQ, setTotalQ] = useState(0);
    const [showQuery, setShowQuery] = useState(false);
    const location = useLocation();
    const [data, setData] = useState(location.state);
    const [starredEntries, setStarredEntries] = useState([]);
    const [changeStar, setChangeStar] = useState([]);

    const interval = 30;
    const addStarred = (entries) => {
        setStarredEntries(entries.filter(entry => entry.starred === true).map(entry => entry.id));
    };

    useEffect(() => {
        // Call the API to update the starred entries
        changeStar.forEach(async entryId => {
            //call the API to PUT the entry as starred
            await apiCall(`entries/${entryId}/bookmark`, setError, { id: entryId });
        });
        setChangeStar([]);
    }, [navigate, offset, showQuery]);

    useEffect(() => {
        setLoading(true);
        setStarredEntries([]);
        //check if the data is type of object feed
        if (!data || typeof data !== 'object' || !Object.prototype.hasOwnProperty.call(data, 'id') || !Object.prototype.hasOwnProperty.call(data, 'title')) {
            setEntries([]);
            setTotal([]);
            navigate('/ForYou');
            return;
        }
        const fetchEntries = async () => {
            try {
                const response = await getRequestWithAuth(`feeds/${data.id}/entries?limit=${interval}&order=published_at&direction=desc&offset=${offset*interval}`, setError);
                console.log("The total: ", response);
                setTotal(response.total);
                if (response.total > 0) {
                    setEntries(response.entries);
                    addStarred(response.entries);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, [data, offset, navigate]);
    
    const handleQuery = async () => {
        if (searchValue !== '') {
            try {
                const response = await apiCall(`feeds/${data.id}/entries?limit=${interval}&order=published_at&direction=desc&search=${searchValue}`, setError);
                setTotalQ(response.total);
                if (response.total > 0) {
                    setQuery(response.entries);
                    setShowQuery(true);
                    return;
                }
        
            } catch (error) {
                setTotalQ(0);
                setShowQuery(true);
                setError(error);
            }
        } 
        setTotalQ(0);
        setQuery(searchValue);
        setShowQuery(true);
    }

    const handleStarClick = (entryId, starred) => {
        if (starredEntries.includes(entryId)) {
            if (starred === true) {
                setChangeStar(changeStar.filter(id => id !== entryId));
            }
            else {
                setChangeStar(prevStarredEntries => [...prevStarredEntries, entryId]);
            }
            return;
        }
        if (starred === false) {
            setChangeStar(changeStar.filter(id => id !== entryId));
        }
        else {
            setChangeStar(prevStarredEntries => [...prevStarredEntries, entryId]);
        }    
    };
// TODO: Correct the handleRead function to call the API to update the entry as read, unsure about the API endpoint
    const handleRead = async (entryId) => {
        const id = entryId;
        console.log(id);
        await apiCall("entries/", setError, {
            entry_ids: [id],
            status: "read"
        }).catch((err) => { 
            console.log(err);
        }
        );
    }
    
    return (
                <DashboardLayout>
            <Grid container={true} spacing={1} justifyContent="center"> {/* Add justifyContent="flex-end" */}
                <MDTypography variant="h3" component="h1" color="info" textGradient gutterBottom>
                    {data.title}
                </MDTypography>
            </Grid>
            
            <Grid container={true} spacing={1} justifyContent="flex-start">
                <Grid item={true} md={0} xs={1}  >
                        <MDButton circular={true} color="info"disabled={refreshing} iconOnly={true}>
                            <RefreshIcon />
                        </MDButton>
                    </Grid>
                <Grid item md={12 } xs={1}>
                        <MDBox component="form" role="form" onSubmit={(e) => {
                            e.preventDefault();
                            handleQuery();
                            // handle the form submission here
                        }}> 
                        <MDInput
                            type="text"
                            variant="outlined"
                            label="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <MDButton
                            circular={true}
                            type="submit"
                            color="info"
                        >
                            <SearchIcon />
                        </MDButton>
                        </MDBox>
                </Grid>
                {total > interval && showQuery===false && (
                <Grid item xs={12} >
                    <MDPagination variant="gradient">
                        <MDPagination item onClick={() => offset > 0 && setOffset(offset - 1)}>
                            <KeyboardArrowLeftIcon />
                        </MDPagination>
                        {Array.from({ length: Math.ceil(total / interval) }, (_, index) => (
                            <MDPagination item key={index + 1} onClick={() => offset !== index && setOffset(index)} active={index === offset}>
                                {index + 1}
                            </MDPagination>
                        ))}
                        <MDPagination item>
                            <KeyboardArrowRightIcon onClick={() => offset < Math.ceil(total / interval) - 1 && setOffset(offset + 1)} />
                        </MDPagination>
                        </MDPagination>
                    </Grid>
                )}
                </Grid>

            {total > 0 ? ( showQuery===false ? (
                <Grid container={true} spacing={1} > {/* Add justifyContent="flex-end" */}
                        {entries.map((entry, index) => (
                            <Grid item xs={12} md={6} key={index} justifyContent="center">

                                <SimpleBlogCard
                                    title={entry.title}
                                    description={entry.content ?entry.content.slice(0, 200) + '...' : ''}
                                    action={{ type: "external", route: entry.url, color: "info", label: "Read More" }}
                                    readtime={entry.reading_time}
                                    starred={entry.starred}
                                    status={entry.status}
                                    onStarClick={handleStarClick}
                                    onRead={handleRead}
                                    entryId={entry.id} 
                                />
                            
                            </Grid>
                        ))}
                </Grid>) : (<Grid container={true} spacing={-5} justifyContent="flex-start"  > 
                    <Grid item={true} spacing={1} justifyContent="flex-start" >
                        <MDButton
                        circular={false}
                        onClick={() => setShowQuery(false)}
                        color="info"
                        > <ArrowBackIcon />
                    </MDButton>
                    </Grid>
                    {totalQ>0 ? ( query.map((entry, index) => (
                        <Grid item xs={1} md={12} key={index} justifyContent="flex-start">
                            <SimpleBlogCard
                                title={entry.title}
                                description={entry.content ? entry.content.slice(0, 200) + '...' : ''}
                                action={{ type: "internal", route: entry.url, color: "info", label: "Read More" }}
                                readtime={entry.reading_time}
                            />
                        </Grid>
                    ))) : (<h2>No entries found</h2>)}
                    
                </Grid> )
            ) : (
                <h2>Feed {data.title} has no entries</h2>
                    )}
                </DashboardLayout>
    );
}
export default ViewFeed;