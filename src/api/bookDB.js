import axios from 'axios';

const KEY = process.env.REACT_APP_GBOOKS_KEY; 

export default axios.create({
    baseURL: 'https://www.googleapis.com/books/v1/volumes?', 
    params: {
        key: KEY,
    }
})


