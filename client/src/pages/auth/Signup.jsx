/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "pages/auth/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
// Handle form submission with validation
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { signUpCall } from 'lib/util'

function Signup() {
    // Initialize state for input fields and validation messages
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState()
    const [validationMessages, setValidationMessages] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigateTo = useNavigate();

    // Validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Handle change in input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Reset validation messages on input change
        setValidationMessages((prevMessages) => ({
            ...prevMessages,
            [name]: '',
        }));

        if (name === 'username') setUsername(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };
        const handleSubmit = async (event) => {
            event.preventDefault();
            let isValid = true;
            let messages = { username: '', email: '', password: '' };

            if (!username) {
                messages.username = 'Username is required.';
                isValid = false;
            }
            if (!isValidEmail(email)) {
                messages.email = 'Invalid email format.';
                isValid = false;
            }
            if (password.length < 6) {
                messages.password = 'Password must be at least 6 characters long.';
                isValid = false;
            }
            console.log('Validation messages:', messages);
            setValidationMessages(messages);

            if (isValid) {
                console.log('Submitted:', { username, email, password });
                // Proceed with form submission actions, e.g., API call
                await signUpCall(username, email, password, setError)
                    .catch(error => {
                        // Handle the error here
                        console.error('User could not be created', error);
                        // You can also update the error state if needed
                        setError(error.message);
                        return;
                    });
                console.log('User created successfully');
                // Redirect to login page
                navigateTo('/login');
            }
        };
    return (
        <CoverLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    p={3}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Join us today
                    </MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                        Enter your email and password to register
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form" onSubmit={handleSubmit}>
                        <MDBox mb={2}>
                            {validationMessages.username && <div style={{ color: 'red' }}>{validationMessages.username}</div>}
                            <MDInput type="text" label="Username" name="username" variant="standard" value={username} onChange={handleChange} fullWidth />
                        </MDBox>
                        <MDBox mb={2}>
                            {validationMessages.email && <div style={{ color: 'red' }}>{validationMessages.email}</div>}
                            <MDInput type="email" label="Email" name="email" variant="standard" value={email} onChange={handleChange} fullWidth />
                        </MDBox>
                        <MDBox mb={2}>
                            {validationMessages.password && <div style={{ color: 'red' }}>{validationMessages.password}</div>}
                            <MDInput type="password" label="Password" name="password" variant="standard" value={password} onChange={handleChange} fullWidth />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Checkbox />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                            >
                                &nbsp;&nbsp;I agree the&nbsp;
                            </MDTypography>
                            <MDTypography
                                component="a"
                                href="#"
                                variant="button"
                                fontWeight="bold"
                                color="info"
                                textGradient
                            >
                                Terms and Conditions
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                                Sign Up
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Already have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/login"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign In
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </CoverLayout>
    );
}

export default Signup;
