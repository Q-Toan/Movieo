import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment/moment';
import axios from 'axios';

import useFetchDetails from '../hooks/useFetchDetails';
import useFetch from '../hooks/useFetch';
import useFetchSeasonDetails from '../hooks/useFetchSeasonDetails';

import Divider from '../components/Divider';
import HorizonSrollCard from '../components/HorizonSrollCard';
import AlertDialog from '../components/AlertDialog';
import Rating from '../components/Rating';
import Breadcrumb from '../components/Breadcrumb';

import { API_KEY } from '../contants/api';
import { addToWatchlist, removeFromWatchlist } from '../store/watchlistSlice';
import { addToFavorites, removeFromFavorites } from '../store/favoriteSlice';
import { submitRating } from '../store/ratingSlice';

const DetailPage = () => {
    const params = useParams();
    const imageURL = useSelector(state => state.movieoData.imageURL);
    const { isAuthenticated, sessionId, user } = useSelector(state => state.user);
    const trendingData = useSelector(state => state.movieoData.bannerData);
    const dispatch = useDispatch();

    // Main data fetching
    const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`);
    const { data: castData } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`);
    const { data: similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`);
    const { data: Recommendations } = useFetch(`/${params?.explore}/${params?.id}/recommendations`);
    const datamock = useMemo(() => data || {}, [data]);

    // Component state
    const [visibleCast, setVisibleCast] = useState(10);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [listTypeToRemove, setListTypeToRemove] = useState(null);

    const [isExpanded, setIsExpanded] = useState(false);

    // User interaction state (watchlist, favorites, ratings)
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [userRating, setUserRating] = useState(0);

    // TV Show State
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodePage, setEpisodePage] = useState(1);
    const { data: seasonData, loading: seasonLoading } = useFetchSeasonDetails(params.explore === 'tv' ? params.id : null, selectedSeason);

    // Effect to check account states (watchlist, favorites, rating)
    useEffect(() => {
        const checkAccountStates = async () => {
            if (isAuthenticated && sessionId && params.id) {
                try {
                    const response = await axios.get(`/${params.explore}/${params.id}/account_states?api_key=${API_KEY}&session_id=${sessionId}`);
                    setIsInWatchlist(response.data.watchlist);
                    setIsInFavorites(response.data.favorite);
                    if (response.data.rated) {
                        setUserRating(response.data.rated.value);
                    }
                } catch (error) {
                    console.error('Error checking account states', error);
                }
            }
        };
        checkAccountStates();
    }, [isAuthenticated, sessionId, params.id, params.explore]);

    // Effect to auto-select first season for TV shows
    useEffect(() => {
        if (params.explore === 'tv' && datamock?.seasons?.length > 0 && selectedSeason === null) {
            const firstSeason = datamock.seasons.find(s => s.season_number > 0) || datamock.seasons[0];
            if (firstSeason) {
                setSelectedSeason(firstSeason.season_number);
            }
        }
    }, [datamock, params.explore, selectedSeason]);

    // Handlers for user actions
    const handleAddToWatchlist = () => {
        if (isAuthenticated && user) {
            dispatch(addToWatchlist({ sessionId, accountId: user.id, mediaType: params.explore, mediaId: params.id }));
            setIsInWatchlist(true);
        }
    };

    const handleRemoveFromWatchlist = () => {
        if (isAuthenticated && user) {
            dispatch(removeFromWatchlist({ sessionId, accountId: user.id, mediaType: params.explore, mediaId: params.id }));
            setIsInWatchlist(false);
        }
    };

    const handleAddToFavorites = () => {
        if (isAuthenticated && user) {
            dispatch(addToFavorites({ sessionId, accountId: user.id, mediaType: params.explore, mediaId: params.id }));
            setIsInFavorites(true);
        }
    };

    const handleRemoveFromFavorites = () => {
        if (isAuthenticated && user) {
            dispatch(removeFromFavorites({ sessionId, accountId: user.id, mediaType: params.explore, mediaId: params.id }));
            setIsInFavorites(false);
        }
    };

    const handleRatingSubmit = (rating) => {
        if (isAuthenticated && user) {
            dispatch(submitRating({ sessionId, mediaType: params.explore, mediaId: params.id, rating }));
        }
    };

    // Handlers for UI interaction
    const handleRemoveClick = (item, listType) => {
        setItemToRemove(item);
        setListTypeToRemove(listType);
        setIsAlertOpen(true);
    };

    const handleConfirmRemove = () => {
        if (itemToRemove && listTypeToRemove) {
            if (listTypeToRemove === 'watchlist') {
                handleRemoveFromWatchlist();
            } else if (listTypeToRemove === 'favorites') {
                handleRemoveFromFavorites();
            }
        }
        setIsAlertOpen(false);
        setItemToRemove(null);
        setListTypeToRemove(null);
    };

    const handleShowMore = () => setVisibleCast(prev => prev + 10);
    const handlehide = () => setVisibleCast(10);
    const handleSeasonChange = (e) => {
        setSelectedSeason(Number(e.target.value));
        setEpisodePage(1);
    }

    // Duration formatting
    let durationString = '';
    if (params.explore === 'tv') {
        if (datamock.number_of_episodes) {
            durationString = `${datamock.number_of_episodes} episodes`;
        }
    } else {
        if (datamock.runtime) {
            const hours = Math.floor(datamock.runtime / 60);
            const minutes = datamock.runtime % 60;
            durationString = `${hours}h ${minutes}m`;
        }
    }

    const crumbs = [
        { label: 'Home', path: '/' },
        { label: params.explore === 'tv' ? 'TV Shows' : 'Movies', path: `/${params.explore}` },
        { label: datamock.title || datamock.name }
    ].filter(c => c.label);

    return (
        <div className='bg-neutral-900 text-white min-h-screen pt-16'>
            <Breadcrumb crumbs={crumbs} />
            <div className='w-full h-96 relative hidden lg:block'>
                <img src={imageURL + datamock.backdrop_path} alt={datamock.title || datamock.name} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent'></div>
            </div>
            <div className='container mx-auto px-4 py-16 lg:py-0 lg:flex lg:gap-10'>
                <div className='lg:-mt-36 relative z-10 mx-auto lg:mx-0 w-60'>
                    <img src={imageURL + datamock.poster_path} alt={datamock.title || datamock.name} className='w-full h-auto object-cover rounded-lg shadow-2xl' />
                </div>

                <div className='flex-grow lg:mt-5'>
                    {/* Header Info */}
                    <h2 className='text-3xl lg:text-4xl font-bold mt-4 lg:mt-0'>{datamock.title || datamock.name}</h2>
                    <p className='text-neutral-400 text-lg mt-1'>{datamock.tagline}</p>
                    <Divider />
                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-neutral-300'>
                        <p>Rating: <span className='font-semibold text-white'>{Number(datamock.vote_average).toFixed(1)}</span></p>
                        <span>|</span>
                        <p>Views: <span className='font-semibold text-white'>{Number(datamock.vote_count)}</span></p>
                        <span>|</span>
                        <p>Release Date: <span className='font-semibold text-white'>{moment(datamock.release_date).format('ll')}</span></p>
                        <span>|</span>
                        <p>Duration: <span className='font-semibold text-white'>{durationString}</span></p>
                    </div>

                    {/* Action Buttons (Watchlist, Favorites, Rating) */}
                    {isAuthenticated && (
                        <div className="my-4 flex items-center gap-4">
                            {isInWatchlist ? (
                                <button onClick={() => handleRemoveClick(datamock, 'watchlist')} className='bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-white font-bold py-2 px-4 rounded shadow-lg shadow-destructive/50'>
                                    Remove from Watchlist
                                </button>
                            ) : (
                                <button onClick={handleAddToWatchlist} className='bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded shadow-lg shadow-primary/50 ring-2 ring-primary/50'>
                                    Add to Watchlist
                                </button>
                            )}
                            {isInFavorites ? (
                                <button onClick={() => handleRemoveClick(datamock, 'favorites')} className='bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-white font-bold py-2 px-4 rounded shadow-lg shadow-destructive/50'>
                                    Remove from Favorites
                                </button>
                            ) : (
                                <button onClick={handleAddToFavorites} className='bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded shadow-lg shadow-amber-500/50 ring-2 ring-amber-500/50'>
                                    Add to Favorites
                                </button>
                            )}
                        </div>
                    )}
                    {isAuthenticated && (
                        <div className='mt-4'>
                            <Rating onRatingSubmit={handleRatingSubmit} initialRating={userRating} />
                        </div>
                    )}

                    <Divider />

                    {/* Overview and Cast */}
                    <div>
                        <h3 className='text-2xl font-bold mb-2'>Overview</h3>
                        <p className={`text-neutral-300 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                            {datamock.overview}
                        </p>
                        {datamock.overview && datamock.overview.length > 100 && (
                            <button onClick={() => setIsExpanded(!isExpanded)} className='text-primary mt-1 hover:underline'>
                                {isExpanded ? 'Show less' : 'Read more...'}
                            </button>
                        )}
                        <div className='flex flex-wrap items-center my-4 gap-x-5 gap-y-2'>
                            <p>Status: <span className='font-semibold text-white'>{datamock.status}</span></p>
                            <span>|</span>
                            <p>Release Date: <span className='font-semibold text-white'>{moment(datamock.release_date).format('MMMM Do, YYYY')}</span></p>
                        </div>
                        <Divider />
                        <h2 className='font-bold text-2xl mb-4'>Cast:</h2>
                        {
                            castData?.cast?.filter(el => el?.profile_path).length > 0 ? (
                                <div className='grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-5'>
                                    {castData.cast.filter(el => el?.profile_path).slice(0, visibleCast).map((startCast) => (
                                        <div key={startCast.id + "cast"} className='text-center'>
                                            <img src={imageURL + startCast.profile_path} alt={startCast.name} className='rounded-full w-24 h-24 object-cover mx-auto shadow-md' />
                                            <p className='text-sm font-semibold mt-2'>{startCast.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-neutral-400'>There is currently no information about the cast.</p>
                            )
                        }
                        {castData?.cast?.length > visibleCast && (
                            <div className='flex flex-row gap-5 lg:items-start lg:justify-start mobile:items-center mobile:justify-center mobile:mt-5'>
                                <button onClick={handleShowMore} className='text-white bg-neutral-800 rounded-full p-2 '>Show More</button>
                                <button onClick={handlehide} className='text-white bg-neutral-800 rounded-full p-2 '>Hide Less</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seasons and Episodes Section */}
            {params.explore === 'tv' && (
                <div className='container mx-auto px-4 mt-10'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-3xl font-bold'>Seasons & Episodes</h2>
                        {datamock?.seasons?.length > 0 && (
                            <div>
                                <label htmlFor='season-select' className='mr-2 font-semibold sr-only'>Select Season:</label>
                                <select id='season-select' value={selectedSeason || ''} onChange={handleSeasonChange} className='bg-neutral-800 text-white p-2 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-primary'>
                                    {datamock?.seasons?.map(season => (
                                        <option key={season.id} value={season.season_number}>{season.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {seasonLoading ? (
                        <div className='text-center my-8 text-lg'>Loading Episodes...</div>
                    ) : (
                        <div>
                            <div className='flex flex-col gap-5'>
                                {seasonData?.episodes?.slice((episodePage - 1) * 5, episodePage * 5).map(episode => (
                                    <div key={episode.id} className='bg-neutral-800 rounded-lg shadow-lg overflow-hidden md:flex hover:shadow-primary/50 transition-shadow duration-300'>
                                        <div className='md:w-1/4 relative'>
                                            <img src={episode.still_path ? imageURL + episode.still_path : 'https://via.placeholder.com/300x169.png?text=No+Image'} alt={episode.name} className='w-full h-full object-cover' />
                                            <div className='absolute top-2 left-2 bg-black bg-opacity-75 rounded-full px-3 py-1 text-sm font-bold'>
                                                S{episode.season_number} E{episode.episode_number}
                                            </div>
                                        </div>
                                        <div className='p-5 md:w-3/4'>
                                            <h3 className='text-xl font-bold text-primary'>{episode.name}</h3>
                                            <p className='text-sm text-neutral-400 mb-3'>Air Date: {moment(episode.air_date).format('LL')}</p>
                                            <p className='text-neutral-300 leading-relaxed line-clamp-3'>{episode.overview || "No overview available."}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {
                                (seasonData?.episodes?.length > 5) && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button onClick={() => setEpisodePage(p => Math.max(p - 1, 1))} disabled={episodePage === 1} className="px-4 py-2 bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                        <span>Page {episodePage} of {Math.ceil((seasonData?.episodes?.length || 0) / 5)}</span>
                                        <button onClick={() => setEpisodePage(p => Math.min(p + 1, Math.ceil((seasonData?.episodes?.length || 0) / 5)))} disabled={episodePage === Math.ceil((seasonData?.episodes?.length || 0) / 5)} className="px-4 py-2 bg-neutral-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            )}

            {/* Recommended Sections */}
            <div className='container mx-auto px-4 mt-10'>
                <HorizonSrollCard data={similarData} heading={"Similar " + params?.explore} media_type={params?.explore} />
                <HorizonSrollCard data={Recommendations} heading={"Recommendations " + params?.explore} media_type={params?.explore} />
                <HorizonSrollCard data={trendingData} heading={"Trending " + params?.explore} media_type={params?.explore} />
            </div>

            {/* Alert Dialog */}
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Are you sure?"
                description={`Do you really want to remove ${datamock?.title || datamock?.name} from your watchlist?`}
            />
        </div>
    );
};

export default DetailPage;