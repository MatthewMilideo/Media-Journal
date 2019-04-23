import axios from 'axios';

export default axios.create({
    //baseURL: "http://localhost:3001/", 
    baseURL: process.env.REACT_APP_URL, 
})

