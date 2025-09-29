import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useFetchDetails = (endpoint) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(endpoint)
            setLoading(false);
            setData(response.data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [endpoint])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading }
}

export default useFetchDetails;