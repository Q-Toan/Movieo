import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import Card from '../components/Card';

const WatchlistPage = () => {
    const { sessionId, user } = useSelector(state => state.user);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (sessionId && user) {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`/account/${user.id}/watchlist/movies?api_key=${API_KEY}&session_id=${sessionId}`);
                    setWatchlist(data.results);
                } catch (error) {
                    console.error('Failed to fetch watchlist', error);
                }
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [sessionId, user]);

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">My Watchlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {watchlist.map(movie => (
                        <Card key={movie.id} data={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatchlistPage;
