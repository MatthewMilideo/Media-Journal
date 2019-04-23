import axios from 'axios';

const KEY = process.env.REACT_APP_IGDB_KEY; ;

export default axios.create({
    baseURL: "https://api.themoviedb.org/3", 
    params: {
        'user-key': KEY,
    
    }
})

