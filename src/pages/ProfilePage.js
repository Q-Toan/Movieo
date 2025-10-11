import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { fetchWatchlist, removeFromWatchlist } from '../store/watchlistSlice';
import { fetchFavorites, removeFromFavorites } from '../store/favoriteSlice';
import moment from 'moment';
import Card from '../components/Card';
import AlertDialog from '../components/AlertDialog';

import { FaRegSmile } from 'react-icons/fa';

const ProfilePage = () => {
    const { user, sessionId } = useSelector(state => state.user);
    const { items: watchlistItems, loading: watchlistLoading } = useSelector(state => state.watchlist);
    const { items: favoriteItems, loading: favoritesLoading } = useSelector(state => state.favorites);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [listTypeToRemove, setListTypeToRemove] = useState(null);
    const [activeTab, setActiveTab] = useState('watchlist');
    const [watchlistPage, setWatchlistPage] = useState(1);
    const [favoritesPage, setFavoritesPage] = useState(1);

    useEffect(() => {
        if (user && sessionId) {
            dispatch(fetchWatchlist({ sessionId, accountId: user.id }));
            dispatch(fetchFavorites({ sessionId, accountId: user.id }));
        }
    }, [user, sessionId, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleRemoveClick = (item, listType) => {
        setItemToRemove(item);
        setListTypeToRemove(listType);
        setIsAlertOpen(true);
    };

    const handleConfirmRemove = () => {
        if (itemToRemove && listTypeToRemove) {
            if (listTypeToRemove === 'watchlist') {
                dispatch(removeFromWatchlist({ sessionId, accountId: user.id, mediaType: itemToRemove.media_type, mediaId: itemToRemove.id }));
            } else if (listTypeToRemove === 'favorites') {
                dispatch(removeFromFavorites({ sessionId, accountId: user.id, mediaType: itemToRemove.media_type, mediaId: itemToRemove.id }));
            }
        }
        setIsAlertOpen(false);
        setItemToRemove(null);
        setListTypeToRemove(null);
    };

    return (
        <div className='bg-neutral-900 text-white min-h-screen mobile:p-8 lg:p-20'>
            <div className='container mx-auto'>
                <div className="flex items-center gap-4 mb-8 border-b border-neutral-700">
                    <button
                        onClick={() => setActiveTab('watchlist')}
                        className={`text-lg sm:text-xl font-bold py-2 px-4 ${activeTab === 'watchlist' ? 'border-b-2 border-primary text-white' : 'text-neutral-400'}`}
                    >
                        My Watchlist
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`text-lg sm:text-xl font-bold py-2 px-4 ${activeTab === 'favorites' ? 'border-b-2 border-primary text-white' : 'text-neutral-400'}`}
                    >
                        My Favorites
                    </button>
                </div>

                <div>
                    {activeTab === 'watchlist' && (
                        <div>
                            {watchlistLoading ? (
                                <p>Loading watchlist...</p>
                            ) : (
                                watchlistItems.length > 0 ? (
                                    <div className='flex flex-col gap-6'>
                                        {watchlistItems.slice((watchlistPage - 1) * 5, watchlistPage * 5).map(item => (
                                            <div key={item.id} className="bg-neutral-800 rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4">
                                                <div className="w-32 flex-shrink-0 mx-auto sm:mx-0">
                                                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="w-full h-auto object-cover rounded" />
                                                </div>
                                                <div className="flex-grow flex flex-col">
                                                    <div className="flex-grow">
                                                        <h3 className="text-lg sm:text-xl font-bold">{item.title || item.name}</h3>
                                                        <p className="text-neutral-400 text-sm sm:text-base">{moment(item.release_date).format('MMMM Do, YYYY')}</p>
                                                        <p className="text-neutral-400 text-sm sm:text-base">Rating: {item.vote_average}</p>
                                                        <p className="mt-2 text-xs sm:text-sm line-clamp-3">{item.overview}</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <button 
                                                            onClick={() => handleRemoveClick(item, 'watchlist')}
                                                            className="bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-center items-center gap-4 mt-4">
                                            <button onClick={() => setWatchlistPage(p => Math.max(p - 1, 1))} disabled={watchlistPage === 1} className="px-3 py-1 sm:px-4 sm:py-2 bg-neutral-700 rounded disabled:opacity-50 text-sm sm:text-base">Previous</button>
                                            <span>{watchlistPage} / {Math.ceil(watchlistItems.length / 5)}</span>
                                            <button onClick={() => setWatchlistPage(p => Math.min(p + 1, Math.ceil(watchlistItems.length / 5)))} disabled={watchlistPage === Math.ceil(watchlistItems.length / 5)} className="px-3 py-1 sm:px-4 sm:py-2 bg-neutral-700 rounded disabled:opacity-50 text-sm sm:text-base">Next</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-neutral-500">
                                        <p className="text-xl sm:text-2xl">Empty</p>
                                        <FaRegSmile className="text-3xl sm:text-4xl mx-auto mt-2" />
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div>
                            {favoritesLoading ? (
                                <p>Loading favorites...</p>
                            ) : (
                                favoriteItems.length > 0 ? (
                                    <div className='flex flex-col gap-6'>
                                        {favoriteItems.slice((favoritesPage - 1) * 5, favoritesPage * 5).map(item => (
                                            <div key={item.id} className="bg-neutral-800 rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4">
                                                <div className="w-24 flex-shrink-0 mx-auto sm:mx-0">
                                                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="w-full h-auto object-cover rounded" />
                                                </div>
                                                <div className="flex-grow flex flex-col">
                                                    <div className="flex-grow">
                                                        <h3 className="text-lg sm:text-xl font-bold">{item.title || item.name}</h3>
                                                        <p className="text-neutral-400 text-sm sm:text-base">{moment(item.release_date).format('MMMM Do, YYYY')}</p>
                                                        <p className="text-neutral-400 text-sm sm:text-base">Rating: {item.vote_average}</p>
                                                        <p className="mt-2 text-xs sm:text-sm line-clamp-3">{item.overview}</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <button 
                                                            onClick={() => handleRemoveClick(item, 'favorites')}
                                                            className="bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-center items-center gap-4 mt-4">
                                            <button onClick={() => setFavoritesPage(p => Math.max(p - 1, 1))} disabled={favoritesPage === 1} className="px-3 py-1 sm:px-4 sm:py-2 bg-neutral-700 rounded disabled:opacity-50 text-sm sm:text-base">Previous</button>
                                            <span>{favoritesPage} / {Math.ceil(favoriteItems.length / 5)}</span>
                                            <button onClick={() => setFavoritesPage(p => Math.min(p + 1, Math.ceil(favoriteItems.length / 5)))} disabled={favoritesPage === Math.ceil(favoriteItems.length / 5)} className="px-3 py-1 sm:px-4 sm:py-2 bg-neutral-700 rounded disabled:opacity-50 text-sm sm:text-base">Next</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-neutral-500">
                                        <p className="text-xl sm:text-2xl">Empty</p>
                                        <FaRegSmile className="text-3xl sm:text-4xl mx-auto mt-2" />
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onConfirm={handleConfirmRemove}
                title="This operation is irreversible. Are you sure?"
                description={`Do you really want to remove ${itemToRemove?.title || itemToRemove?.name} from your list?`}
            />
        </div>
    );
}

export default ProfilePage;
