import axios from "axios";
import { useCallback, useState } from "react";
import { API_KEY } from "../contants/api";

const useFetchEpisodeVideos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchVideos = useCallback(async (series_id, season_number, episode_number) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/episode/${episode_number}/videos?api_key=${API_KEY}`);
            setLoading(false);
            setData(response.data.results);
        } catch (error) {
            console.error("Error fetching episode videos:", error);
            setLoading(false);
        }
    }, []);

    return { data, loading, fetchVideos };
}

export default useFetchEpisodeVideos;
