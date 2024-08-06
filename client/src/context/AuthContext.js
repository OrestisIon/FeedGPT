import  { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import axios from 'axios';
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const fetchUserData = async () => {
    const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
    const token = localStorage.getItem('jwt-token');
    const url = `${server}/api/users/me`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('User data fetched successfully', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error appropriately
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    // Load user from localStorage on initial load
    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
        }
    }, []);

    const login = async (userData) => {
        // Extract the username and password from userData
        const { username, password } = userData;
        console.log('Logging in', username);

        if (!username || !password) {
            // If username or password is missing, resolve to null immediately
            return Promise.resolve(null);
        }

        // Prepare the data for the request
        const data = {
            username: username,
            password: password,
        };

        // Define the URL for the login request
        const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
        const url = `${server}/api/token`; // Adjust this to your actual login URL
        try {
            const response = await axios({
                method: 'post',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            console.log('Login successful', response.data.access_token);
            localStorage.setItem('jwt-token', response.data.access_token);
            await fetchUserData();
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            // Handle error as needed
            return Promise.reject();
        }
        
    };



    const logout = () => {
        // Clear user from local storage on logout
        localStorage.clear();
        // Implement logout logic here
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
    };

    AuthProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
