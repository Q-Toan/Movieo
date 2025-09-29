import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(endpoint)
            setLoading(false);
            setData(response.data.results)
        }catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [endpoint])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {data , loading}
}

export default useFetch;