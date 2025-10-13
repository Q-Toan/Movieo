import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_KEY } from '../contants/api';

const useFetchSeasonDetails = (tvId, seasonNumber) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSeasonDetails = useCallback(async () => {
        if (!tvId || seasonNumber === null || seasonNumber === undefined) {
            setData(null);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching season details:', error);
        } finally {
            setLoading(false);
        }
    }, [tvId, seasonNumber]);

    useEffect(() => {
        fetchSeasonDetails();
    }, [fetchSeasonDetails]);

    return { data, loading };
};

export default useFetchSeasonDetails;
