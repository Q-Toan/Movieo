import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchGenres = (mediaType) => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`/genre/${mediaType}/list`);
                setGenres(response.data.genres);
            } catch (error) {
                console.error('Failed to fetch genres', error);
            }
        };

        if (mediaType) {
            fetchGenres();
        }
    }, [mediaType]);

    return genres;
};

export default useFetchGenres;
