import React, { useState } from 'react';
import { TextField, IconButton, Button } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Typography from '@mui/material/Typography';
import MDBox from 'components/MDBox';
import { useCountries } from 'use-react-countries'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MDButton from 'components/MDButton';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Settings = () => {
    const { countries } = useCountries();
    const [editMode, setEditMode] = useState(false);
    const [delMode, setDelMode] = useState(false);
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [sys, setSys] = useState({
        lang: 'English',
    });
    const [editedSys, setEditedSys] = useState(sys);

    const handleChange = (e) => {
        setEditedSys({ ...editedSys, [e.target.name]: e.target.value });
    };

    const toggleEdit = () => {
        setEditMode(!editMode);
        setEditedSys(sys); // Reset edits if user cancels editing
    };

    const saveSys = () => {
        setSys(editedSys);
        setEditMode(false);
        // Here you would typically also send the updated user data back to your server
    };

    const deleteUser = () => {
        const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
        const token = localStorage.getItem('jwt-token');
        const myheaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        axios({
            method: 'post', url: `${server}/api/users/delete`,
            headers: myheaders 
        }).then((response) => {
            console.log('Success:', response.data);
            // Logout user
            logout(); // Call the logout function from the context
            navigate('/login'); // Navigate to login page after logout         
        }).catch((error) => {
            console.error('Error:', error);
            setError('Failed to Delete User');
        });
        // Here you would typically also send the updated user data back to your server
        console.log('User Deleted');
    }
    const languages = [ "English" ]


    return (
        <DashboardLayout>
            <Typography variant="h4" gutterBottom>
                System Settings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Configure your system settings.
            </Typography>
            <MDBox color="inherit" mb={{ xs: 20, md: -10 }} sx={{ maxWidth: 400, margin: 'auto', p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                {!editMode ? (
                    <>
                        <p>Language: {sys.lang}</p>
                        <IconButton onClick={toggleEdit} color="primary">
                            <EditIcon />
                        </IconButton>
                    </>
                ) : (
                        <>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    name="language"
                                    value={editedSys.lang}
                                    onChange={handleChange}
                                    label="Language"
                                    sx={{
                                        height: 50, // Adjust the height as needed
                                        '.MuiSelect-select': { // Targeting the inner select element for padding adjustment
                                            paddingTop: '10px', // Adjust top padding
                                            paddingBottom: '10px', // Adjust bottom padding
                                        }
                                    }}

                                >
                                    {languages.map((lang) => (
                                        <MenuItem key={lang} value={lang}>
                                            {lang}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        <MDBox color="inherit" mb={{ xs: 10, md: 0 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" startIcon={<SaveIcon />} >
                                Save
                            </Button>
                            <Button variant="outlined" onClick={toggleEdit}>
                                Cancel
                            </Button>
                        </MDBox>
                    </>
                )}
            </MDBox>

            <MDBox color="inherit" mb={{ xs: 100, md: 100 }} sx={{ maxWidth: 400, margin: 'auto', p: 5, border: '1px solid #ccc', borderRadius: '4px', mt: 10}}>
                {!delMode ? ( 
                    <MDBox>
                        <Typography component="h2">Delete Profile</Typography>
                        <Typography component="h3">Warning: This action cannot be undone.</Typography>
                        <Typography component="h4">Once you delete your profile, all your data will be lost.</Typography>
                        <MDButton onClick={() => setDelMode(true)} color="primary" >
                            Delete Profile
                        </MDButton>
                </MDBox>
                ) : (
                        <MDBox>
                            <Typography component="h4">Are you sure you want to proceed?</Typography>

                            <MDBox color="inherit" mb={{ xs: 10, md: 0 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <IconButton variant="outlined" onClick={deleteUser}>
                              Yes      
                    </IconButton>
                                    
                                <IconButton variant="outlined" onClick={() => { setDelMode(false) }}>
                        No
                                </IconButton>
                                
                    </MDBox>
                </MDBox>

                )}
                {error && <Typography color="error">{error}</Typography>}
            </MDBox>


        </DashboardLayout>
    );
};

export default Settings;
