import React from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
// export function signUpCall(username, email, password, errorHandler) {
//     const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL
//     const url = server + '/api/users'
//     // post request to create a new user
//     const data = {
//         username: username,
//         email: email,
//         first_name: '',
//         last_name: '',
//         hashed_password: password,
//         is_superuser: false,
//     }
//     const options = {
//         method: 'POST',
//         mode: 'no-cors',  // add this line
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     }

//     const err = (s) => errorHandler(s + ' (' + url + ')')

//     return fetch(url, options)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log('Success:', data)
//             return data
//         })
//         .catch((e) => {
//             if (e instanceof TypeError) {
//                 err(e.message)
//             } else if (e instanceof Response) {
//                 const contentType = e.headers.get('content-type')
//                 if (
//                     contentType &&
//                     contentType.indexOf('application/json') !== -1
//                 ) {
//                     e.json().then((msg) => err(msg['error_message']))
//                 } else {
//                     e.text().then((msg) => err(msg))
//                 }
//             } else {
//                 err(String(e))
//             }
//             return Promise.reject()
//         })
// }

export function signUpCall(username, email, password, errorHandler) {
    const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
    const url = `${server}/api/register`;
    const user = {
        username: username,
        email: email,
        first_name: '',
        last_name: '',
        hashed_password: password,
        is_superuser: false,
    };

    const err = (s) => errorHandler(s + ' (' + url + ')');

    return axios({
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: user
    })
        .then((response) => {
            console.log('Success:', response.data);
            return response.data;
        })
        .catch((error) => {
            console.log('Error:', error);
            err(error.message); // Pass the error message to the errorHandler function
            return Promise.reject();
        });
}

export function postRequest(endpoint, data, errorHandler) {
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        errorHandler('Unauthorized access. Please log in.');
        return Promise.reject();
    }

    const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
    const url = `${server}/api/${endpoint}`;

    const err = (message) => errorHandler(`${message} (${url})`);

    return axios({
        url: url,
        data: data,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.data)
        .catch(error => {
            if (error.response) {
                const contentType = error.response.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {
                    err(error.response.data['error_message']);
                } else {
                    err(error.response.data);
                }
            } else if (error.request) {
                err('The request was made but no response was received');
            } else {
                err('Error', error.message);
            }
            return Promise.reject();
        });
  
}

export function apiCall(s, errorHandler, body = null) {
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        errorHandler('Unauthorized access. Please log in.');
        return Promise.reject();
    }

    const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
    const url = `${server}/api/${s}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Set up the Axios request configuration
    const config = {
        method:'GET', // Choose method based on body parameter
        url: url,
        headers: headers,
        params: body ? body: null, // Include body if present
    };

    // Handle errors uniformly
    const err = (message) => errorHandler(`${message} (${url})`);

    // Perform the request
    return axios(config)
        .then(response => {
            // Check for 204 No Content explicitly, if necessary
            if (response.status === 204) {
                return response;
            }
            return response.data; // Directly return the response data
        })
        .catch(error => {
            console.log('Error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const contentType = error.response.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {
                    err(error.response.data['error_message']);
                } else {
                    err(error.response.data);
                }
            } else if (error.request) {
                // The request was made but no response was received
                err('The request was made but no response was received');
            } else {
                // Something happened in setting up the request that triggered an Error
                err(error.message);
            }
            return Promise.reject();
        });
}

export function getRequestWithAuth(endpoint, errorHandler) {
    const server = import.meta.env.VITE_REACT_APP_MINIFLUX_API_URL;
    const url = `${server}/api/${endpoint}`;
    const token = localStorage.getItem('jwt-token');

    if (!token) {
        console.error('Unauthorized access. Please log in.');
        errorHandler('Unauthorized access. Please log in.');
        return Promise.reject('Unauthorized access. Please log in.');
    }
    const myheaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    return axios({
        method: 'get',
        url: url,
        headers: myheaders,
   })
        .then(response => {
            console.log('Success:', response.data);
            return response.data;
        })
        .catch(error => {
            console.log(error.message);
        });
}

export function relaTimestamp(t) {
    const d = (Date.now() - Date.parse(t)) / 1000
    if (d > 60 * 60 * 24) {
        return Math.floor(d / (60 * 60 * 24)) + 'd'
    } else if (d > 60 * 60) {
        return Math.floor(d / (60 * 60)) + 'h'
    } else {
        return Math.floor(d / 60) + 'm'
    }
}

export function formatDate(t) {
    return dayjs(t).format('D MMM HH:mm')
}

export function linkNewTab(title, link, stripStyle) {
    return (
        <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            style={stripStyle && { textDecoration: 'none', color: 'inherit' }}>
            {title}
        </a>
    )
}

function hashCode(s) {
    var hash = 0
    for (var i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}

export function createFeedIcon(feedName) {
    var canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    var context = canvas.getContext('2d')

    const color = hashCode(feedName) % 360

    context.beginPath()
    context.rect(0, 0, 16, 16)
    context.fillStyle = 'hsl(' + color + ', 50%, 25%)'
    context.fill()

    context.fillStyle = 'hsl(' + (360 - color) + ', 100%, 75%)'
    context.font = 'bold 14px sans-serif'
    context.textBaseline = 'middle'
    context.textAlign = 'center'
    context.fillText(feedName[0], canvas.width / 2, canvas.height / 2 + 1)

    return canvas.toDataURL()
}