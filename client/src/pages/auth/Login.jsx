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

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
// Authentication layout components
import BasicLayout from "pages/auth/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import logo from "assets/images/feedgpt.png";
import { useAuth } from 'context/AuthContext'; // Adjust the path as necessary
import MDAlert from "components/MDAlert";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [validationMessages, setValidationMessages] = useState({
        email: '',
        password: '',
    });
    const { login } = useAuth(); // Destructure login method
    const navigate = useNavigate();

    const handleSetRememberMe = () => setRememberMe(!rememberMe);
    // Handle change in input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Reset validation messages on input change
        setValidationMessages((prevMessages) => ({
            ...prevMessages,
            [name]: '',
        }));
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    // Validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Other component logic remains the same

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        let messages = { email: '', password: '' };
        if (!isValidEmail(email)) {
            messages.email = 'Invalid email format.';
            isValid = false;
        }
        if (password.length < 6) {
            messages.password = 'Password must be at least 6 characters long.';
            isValid = false;
        }
        setValidationMessages(messages);

        if (isValid) {
            console.log('Logging in...');
            try {
                // Call the login method. This is where you might call an API.
                await login({ username: email, password: password }); // Adjust based on your login method's signature
                navigate('/dashboard'); // Navigate to the dashboard on successful login
            } catch (err) {
                // Handle login failure (e.g., invalid credentials)
                setError('Failed to log in. Please check your credentials.');
            }
        }
    };

    return (
        < BasicLayout image={bgImage} >
            {/* Image */}
            <MDBox
                display="flex"
                justifyContent="center"
                mb={6}
            >
            </MDBox>
        <Card>
            <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
            >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Sign in
                    </MDTypography>
                </MDBox>
            <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form" onSubmit={handleSubmit}>
                    {/* Display error message at the top of the form */}
                        {error && (
                            <MDAlert mb={2} textAlign="center" color="error">
                                <MDTypography color="white">{error}</MDTypography>
                        </MDAlert>
                    )}

                    <MDBox mb={2}>
                        <MDInput type="email" label="Email" name="email" fullWidth onChange={handleChange} error={!!validationMessages.email} />
                        {/* Display email validation message */}
                        {validationMessages.email && (
                            <MDTypography color="error" variant="caption" display="block">
                                {validationMessages.email}
                            </MDTypography>
                        )}
                    </MDBox>
                    <MDBox mb={2}>
                        <MDInput type="password" label="Password" name="password" fullWidth onChange={handleChange} error={!!validationMessages.password} />
                        {/* Display password validation message */}
                        {validationMessages.password && (
                            <MDTypography color="error" variant="caption" display="block">
                                {validationMessages.password}
                            </MDTypography>
                        )}
                    </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                            >
                                &nbsp;&nbsp;Remember me
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                                sign in
                            </MDButton>
                        </MDBox>

                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Don&apos;t have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/register"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign up
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Login;
