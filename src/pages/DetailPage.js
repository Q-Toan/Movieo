import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchDetails from '../hooks/useFetchDetails';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import Divider from '../components/Divider';
import useFetch from '../hooks/useFetch';
import HorizonSrollCard from '../components/HorizonSrollCard';
import axios from 'axios';
import { API_KEY } from '../contants/api';

const DetailPage = () => {
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

    useEffect(() => {
        const checkWatchlist = async () => {
            if (isAuthenticated && sessionId && params.id) {
                try {
                    const response = await axios.get(`/movie/${params.id}/account_states?api_key=${API_KEY}&session_id=${sessionId}`);
                    setIsInWatchlist(response.data.watchlist);
                } catch (error) {
                    console.error('Error checking watchlist status', error);
                }
            }
        };

        checkWatchlist();
    }, [isAuthenticated, sessionId, params.id]);

    const handleAddToWatchlist = async () => {
        if (!isAuthenticated || !user) {
            // Optionally, redirect to login or show a message
            return;
        }

        try {
            await axios.post(`/account/${user.id}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`, {
                media_type: 'movie',
                media_id: params.id,
                watchlist: true,
            });
            setIsInWatchlist(true);
        } catch (error) {
            console.error('Error adding to watchlist', error);
        }
    };

    const handleShowMore = () => {
        setVisibleCast(prev => prev + 10);
    };

    const handlehide = () => {
        setVisibleCast(10);
    };

    const datamock = data || {};
    const duration = (Number(datamock.runtime) / 60).toFixed(1).split('.');

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
                            Duration: <span className='font-semibold text-white'>{duration[0]}h {duration[1]}m</span>
                        </p>
                    </div>
                    {isAuthenticated && (
                        <div className="my-4">
                            {isInWatchlist ? (
                                <button className='bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed' disabled>
                                    In Watchlist
                                </button>
                            ) : (
                                <button onClick={handleAddToWatchlist} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                                    Add to Watchlist
                                </button>
                            )}
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
            <div className='container mx-auto px-4 mt-10'>
                <HorizonSrollCard data={similarData} heading={"Similar " + params?.explore} media_type={params?.explore} />
                <HorizonSrollCard data={Recommendations} heading={"Recommendations " + params?.explore} media_type={params?.explore} />
                <HorizonSrollCard data={trendingData} heading={"Trending " + params?.explore} media_type={params?.explore} />
            </div>
        </div>
    );
}

export default DetailPage;
