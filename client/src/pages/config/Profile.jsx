import React, { useState } from 'react';
import {TextField, IconButton, Button } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Typography from '@mui/material/Typography';
import MDBox from 'components/MDBox';
import { useCountries } from 'use-react-countries'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { fetchUserData } from 'context/AuthContext';

const UserProfile = () => {
    const { countries } = useCountries();
    const [editMode, setEditMode] = useState(false);
    // const [user, setUser] = useState(null);
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'johndoe@example.com',
        age: 30, // Adding age
        gender: 'male', 
        country: 'Neverland', // Adding country
        job: 'Developer' // Adding job
    });
    const [editedUser, setEditedUser] = useState({});
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const toggleEdit = () => {
        setEditMode(!editMode);
        setEditedUser({}); // Reset edits if user cancels editing
    };

    useEffect(() => {
        // Fetch user data from the local storage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.occupation === null) user.occupation = 'Other';
            setUser(user);
        }
    }, []);
    // const saveUser = () => {
    //     setUser(editedUser);
    //     setEditMode(false);
    //     // Here you would typically also send the updated user data back to your server
    // };

    const validateUserData = (userData) => {
        let errors = {};

        // Validate age (assuming age should be between 0 and 120)
        if (userData.age !== undefined && (isNaN(userData.age) || userData.age < 0 || userData.age > 120)) {
            errors.age = "Age must be a valid number between 0 and 120";
        }

        // Validate gender
        if (userData.gender && !gender.includes(userData.gender)) {
            errors.gender = "Please select a valid gender option";
        }

        // Validate job (occupation must be one of the predefined occupations)
        if (userData.occupation && !occupations.includes(userData.occupation)) {
            errors.job = "Please select a valid occupation";
        }

        return errors;
    };

    const saveUser = () => {
        // Validate user data before saving
        const errors = validateUserData(editedUser);
        if (Object.keys(errors).length > 0) {
            // Handle errors (e.g., show them in the UI)
            console.error('Validation errors:', errors);
            // Render the validation error message in the UI
            setError(Object.values(errors).join('.\n') + '.');
            setEditMode(false);   // Exit edit mode
            return; // Stop the save operation
        }
        console.log('Edit User Data:', editedUser);

        // Send the updated user data to the server
        const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
        const token = localStorage.getItem('jwt-token');
        const myheaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        axios({
            method: 'put',
            url: `${server}/api/users/me`,
            headers: myheaders,
            data: JSON.stringify(editedUser)  // Add the editedUser as the request payload
        }).then((response) => {
            console.log('Success:', response.data);
            // Update the user data in the local storage with the updated user data
            // Only update the fields that were edited
            const updatedUser = { ...user, ...editedUser };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);  // Update the user state with the updated user data
            setError(null);  // Clear any previous error message
            toggleEdit();  // Exit edit mode (toggle back to view mode)
        }).catch((error) => {
            console.error('Error:', error);
            setError('Failed to update user details');  // Set an error message if the update fails
        });
        console.log('User Details Updated');
    }

    // List of predefined occupations
    const occupations = [
        "Accountant", "Actor", "Architect", "Artist", "Attorney",
        "Chef", "Civil Engineer", "Dentist", "Designer", "Doctor",
        "Economist", "Editor", "Educator", "Electrician", "Engineer",
        "Farmer", "Financial Analyst", "Firefighter", "Graphic Designer", "Historian",
        "Journalist", "Lawyer", "Librarian", "Mechanic", "Musician",
        "Nurse", "Occupational Therapist", "Pharmacist", "Photographer", "Physician",
        "Pilot", "Plumber", "Police Officer", "Politician", "Professor",
        "Programmer", "Psychologist", "Real Estate Agent", "Registered Nurse", "Scientist",
        "Social Worker", "Software Developer", "Student", "Surgeon", "Teacher",
        "Translator", "Veterinarian", "Web Developer", "Writer", "Zoologist", "Other"
    ];
    // List of predefined Gender options
    const gender = ['Male', 'Female', 'Other', 'Prefer not to say'];

    return (
        <DashboardLayout>   
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                View and edit your profile details.
            </Typography>
            <MDBox color="inherit" mb={{ xs: 20, md: -10 }} sx={{ maxWidth: 400, margin: 'auto', p: 2, border: '1px solid #ccc', borderRadius: '4px' } }>
            {!editMode ? (
                <>
                        <h2>{user.username}</h2>
                        <p>Email: {user.email}</p>
                        <p>Age: {user.age}</p>
                        <p>Gender: {user.gender}</p>
                        <p>Country: {user.country}</p>
                        <p>Job: {user.occupation}</p>
                    <IconButton onClick={toggleEdit} color="primary">
                        <EditIcon />
                        </IconButton>
                        {error && <Typography color="error">{error}</Typography>}
                </>
            ) : (
                <form noValidate>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="username"
                        value={ user.username}
                        onChange={handleChange}
                        disabled
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled
                    />
                            <TextField // Add TextField for age
                                margin="normal"
                                fullWidth
                                label="Age"
                                name="age"
                                type="number" // To ensure numeric input
                                value={editedUser.age !== undefined ? editedUser.age : user.age}

                                onChange={handleChange}
                            />
                            <FormControl component="fieldset" margin="normal" fullWidth>
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={editedUser.gender !== undefined ? editedUser.gender : user.gender}

                                    onChange={handleChange}
                                >
                                    {gender.map((g, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={g}
                                            control={<Radio />}
                                            label={g}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Country</InputLabel>
                                <Select
                                    name="country"
                                    value={editedUser.country !== undefined ? editedUser.country : user.country}

                                    onChange={handleChange}
                                    label="Country"
                                    sx={{
                                        height: 50, // Adjust the height as needed
                                        '.MuiSelect-select': { // Targeting the inner select element for padding adjustment
                                            paddingTop: '10px', // Adjust top padding
                                            paddingBottom: '10px', // Adjust bottom padding
                                        }
                                    }}

                                >
                                    {countries.map((country) => (
                                        <MenuItem key={country.code} value={country.name}>
                                            {country.emoji} {country.name} 
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Occupation</InputLabel>
                                <Select
                                    name="occupation"
                                    value={editedUser.occupation !== undefined ? editedUser.occupation : user.occupation}
                                    onChange={handleChange}
                                    label="job"
                                    sx={{
                                        height: 50, // Adjust the height as needed
                                        '.MuiSelect-select': { // Targeting the inner select element for padding adjustment
                                            paddingTop: '10px', // Adjust top padding
                                            paddingBottom: '10px', // Adjust bottom padding
                                        }
                                    }}
                                >
                                    {occupations.map((occupation, index) => (
                                        <MenuItem key={index} value={occupation}>
                                            {occupation}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <MDBox color="inherit" mb={{ xs: 10, md: 0 }} sx={{ display: 'flex', justifyContent: 'space-between' } }>
                        <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={saveUser}>
                            Save Changes
                        </Button>
                                <Button variant="outlined" onClick={() => { setError(null); toggleEdit(); }}>
                            Cancel
                        </Button>
                        
                    </MDBox>
                </form>
            )}
            </MDBox>
            </DashboardLayout>  
    );
};

export default UserProfile;
