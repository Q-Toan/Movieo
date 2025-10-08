import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { removeFromWatchlist } from '../store/watchlistSlice';
import Card from '../components/Card';

import AlertDialog from '../components/AlertDialog';

const WatchlistPage = () => {
    const dispatch = useDispatch();
    const { sessionId, user } = useSelector(state => state.user);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (sessionId && user) {
                setLoading(true);
                try {
                    const moviesResponse = axios.get(`/account/${user.id}/watchlist/movies?api_key=${API_KEY}&session_id=${sessionId}`);
                    const tvShowsResponse = axios.get(`/account/${user.id}/watchlist/tv?api_key=${API_KEY}&session_id=${sessionId}`);

                    const [movies, tvShows] = await Promise.all([moviesResponse, tvShowsResponse]);

                    const watchlistData = [
                        ...movies.data.results.map(item => ({ ...item, media_type: 'movie' })),
                        ...tvShows.data.results.map(item => ({ ...item, media_type: 'tv' })),
                    ];

                    setWatchlist(watchlistData);
                } catch (error) {
                    console.error('Failed to fetch watchlist', error);
                }
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [sessionId, user]);

    const handleRemoveFromWatchlist = (mediaId, mediaType) => {
        dispatch(removeFromWatchlist({ sessionId, accountId: user.id, mediaType, mediaId }));
        setWatchlist(prev => prev.filter(item => item.id !== mediaId));
    };

    const handleRemoveClick = (item) => {
        setItemToRemove(item);
        setIsAlertOpen(true);
    };

    const handleConfirmRemove = () => {
        if (itemToRemove) {
            handleRemoveFromWatchlist(itemToRemove.id, itemToRemove.media_type);
        }
        setIsAlertOpen(false);
        setItemToRemove(null);
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">My Watchlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {watchlist.map(item => (
                        <div key={item.id} className="relative">
                            <Card data={item} media_type={item.media_type} />
                            <button
                                onClick={() => handleRemoveClick(item)}
                                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onConfirm={handleConfirmRemove}
                title="This operation is irreversible. Are you sure?"
                description={`Do you really want to remove ${itemToRemove?.title || itemToRemove?.name} from your watchlist?`}
            />
        </div>
    );
};

export default WatchlistPage;
