import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchDetails from '../hooks/useFetchDetails';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment/moment';
import Divider from '../components/Divider';
import useFetch from '../hooks/useFetch';
import HorizonSrollCard from '../components/HorizonSrollCard';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { addToWatchlist, removeFromWatchlist } from '../store/watchlistSlice';
import { addToFavorites, removeFromFavorites } from '../store/favoriteSlice';

import useFetchEpisodeVideos from '../hooks/useFetchEpisodeVideos';
import AlertDialog from '../components/AlertDialog';

import { submitRating } from '../store/ratingSlice';
import Rating from '../components/Rating';

const DetailPage = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const imageURL = useSelector(state => state.movieoData.imageURL);
    const { isAuthenticated, sessionId, user } = useSelector(state => state.user);
    const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`);
    const { data: castData } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`);
    const { data: similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`);
    const { data: Recommendations } = useFetch(`/${params?.explore}/${params?.id}/recommendations`);
    const trendingData = useSelector(state => state.movieoData.bannerData);
    const [visibleCast, setVisibleCast] = useState(10);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [listTypeToRemove, setListTypeToRemove] = useState(null);
    const [itemToRemove, setItemToRemove] = useState(null);

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

    const handleShowMore = () => {
        setVisibleCast(prev => prev + 10);
    };

    const handlehide = () => {
        setVisibleCast(10);
    };

    const handleSeasonChange = (e) => {
        setSelectedSeason(Number(e.target.value));
        setSelectedEpisode(1); // Reset episode to 1 when season changes
    };

    const handleEpisodeChange = (e) => {
        setSelectedEpisode(Number(e.target.value));
    };

    const handleRatingSubmit = (rating) => {
        if (isAuthenticated && user) {
            dispatch(submitRating({ sessionId, mediaType: params.explore, mediaId: params.id, rating }));
        }
    };

    const datamock = data || {};
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

    const { data: episodeVideos, loading: episodeVideosLoading, fetchVideos } = useFetchEpisodeVideos();
    const [selectedSeason, setSelectedSeason] = useState(datamock?.seasons?.length > 0 ? datamock.seasons[0].season_number : null);
    const [selectedEpisode, setSelectedEpisode] = useState(1);

    useEffect(() => {
        if (params.explore === 'tv' && selectedSeason !== null) {
            fetchVideos(params.id, selectedSeason, selectedEpisode);
        }
    }, [params.id, selectedSeason, selectedEpisode, fetchVideos, params.explore]);

    return (
        <div className='bg-neutral-900 text-white min-h-screen'>
            <div className='w-full h-96 relative hidden lg:block'>
                <img
                    src={imageURL + datamock.backdrop_path}
                    alt={datamock.title || datamock.name}
                    className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent'></div>
            </div>
            <div className='container mx-auto px-4 py-16 lg:py-0 lg:flex lg:gap-10'>
                <div className='lg:-mt-36 relative z-10 mx-auto lg:mx-0 w-60'>
                    <img
                        src={imageURL + datamock.poster_path}
                        alt={datamock.title || datamock.name}
                        className='w-full h-auto object-cover rounded-lg shadow-2xl'
                    />
                </div>
                <div className='flex-grow lg:mt-5'>
                    <h2 className='text-3xl lg:text-4xl font-bold mt-4 lg:mt-0'>{datamock.title || datamock.name}</h2>
                    <p className='text-neutral-400 text-lg mt-1'>{datamock.tagline}</p>
                    <Divider />
                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-neutral-300'>
                        <p>
                            Rating: <span className='font-semibold text-white'>{Number(datamock.vote_average).toFixed(1)}</span>
                        </p>
                        <span className='hidden sm:block'>|</span>
                        <p>
                            Views: <span className='font-semibold text-white'>{Number(datamock.vote_count)}</span>
                        </p>
                        <span className='hidden sm:block'>|</span>
                        <p>
                            Release Date: <span className='font-semibold text-white'>{moment(datamock.release_date).format('ll')}</span>
                        </p>
                        <span className='hidden sm:block'>|</span>
                        <p>
                            Duration: <span className='font-semibold text-white'>{durationString}</span>
                        </p>
                    </div>
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
                    <div>
                        <h3 className='text-2xl font-bold mb-2'>Overview</h3>
                        <p className='text-neutral-300 leading-relaxed'>{datamock.overview}</p>
                        <div className='flex flex-wrap items-center my-4 gap-x-5 gap-y-2'>
                            <p>
                                Status: <span className='font-semibold text-white'>{datamock.status}</span>
                            </p>
                            <span className='hidden sm:block'>|</span>
                            <p>
                                Release Date: <span className='font-semibold text-white'>{moment(datamock.release_date).format('MMMM Do, YYYY')}</span>
                            </p>
                        </div>
                        <Divider />
                        <h2 className='font-bold text-2xl mb-4'>Cast:</h2>
                        <div className='grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-5'>
                            {
                                castData?.cast?.filter(el => el?.profile_path).slice(0, visibleCast).map((startCast) => {
                                    return (
                                        <div key={startCast.id + "cast"} className='text-center'>
                                            <img
                                                src={imageURL + startCast.profile_path}
                                                alt={startCast.name}
                                                className='rounded-full w-24 h-24 object-cover mx-auto shadow-md'
                                            />
                                            <p className='text-sm font-semibold mt-2'>{startCast.name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            castData?.cast?.length > visibleCast && (
                                <div className='flex flex-row gap-5 lg:items-start lg:justify-start mobile:items-center mobile:justify-center mobile:mt-5'>
                                    <button onClick={handleShowMore} className='text-white bg-neutral-800 rounded-full p-2 '>Show More</button>
                                    <button onClick={handlehide} className='text-white bg-neutral-800 rounded-full p-2 '>Hide Less</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {
                params.explore === 'tv' && (
                    <div className='container mx-auto px-4 mt-10'>
                        <h2 className='text-2xl font-bold mb-4'>Seasons & Episodes</h2>
                        <div className='flex gap-4 items-center mb-4'>
                            <div>
                                <label htmlFor='season-select' className='mr-2 font-semibold'>Season:</label>
                                <select id='season-select' value={selectedSeason || ''} onChange={handleSeasonChange} className='bg-neutral-800 text-white p-2 rounded'>
                                    {datamock?.seasons?.map(season => (
                                        <option key={season.id} value={season.season_number}>
                                            {season.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor='episode-select' className='mr-2 font-semibold'>Episode:</label>
                                <select id='episode-select' value={selectedEpisode} onChange={handleEpisodeChange} className='bg-neutral-800 text-white p-2 rounded'>
                                    {
                                        selectedSeason !== null && datamock?.seasons?.find(s => s.season_number === selectedSeason)?.episode_count &&
                                        Array.from({ length: datamock.seasons.find(s => s.season_number === selectedSeason).episode_count }, (_, i) => i + 1).map(episodeNum => (
                                            <option key={episodeNum} value={episodeNum}>
                                                Episode {episodeNum}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        {episodeVideosLoading ? (
                            <div>Loading episode videos...</div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {episodeVideos.map(video => (
                                    <div key={video.id} className='bg-neutral-800 rounded-lg overflow-hidden shadow-lg'>
                                        <div className='aspect-w-16 aspect-h-9'>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${video.key}`}
                                                title={video.name}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className='w-full h-full'
                                            ></iframe>
                                        </div>
                                        <div className='p-4'>
                                            <h3 className='text-lg font-bold'>{video.name}</h3>
                                            <p className='text-neutral-400'>{video.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            }

            <div className='container mx-auto px-4 mt-10'>
                <HorizonSrollCard data={similarData} heading={"Similar " + params?.explore} media_type={params?.explore} />
                <HorizonSrollCard data={Recommendations} heading={"Recommendations " + params?.explore} media_type={params?.explore} />
                <HorizonSrollCard data={trendingData} heading={"Trending " + params?.explore} media_type={params?.explore} />
            </div>
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
