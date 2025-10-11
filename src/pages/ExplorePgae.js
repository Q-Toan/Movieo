import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import useFetchGenres from '../hooks/useFetchGenres'

const ExplorePgae = () => {
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams()
    const [pageNo, setPageNo] = useState(1)
    const [data, setData] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const genres = useFetchGenres(params.explore)
    const [selectedGenre, setSelectedGenre] = useState('')

    const fetchData = useCallback(async (page) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/discover/${params.explore}`, {
                params: { 
                    page, 
                    with_genres: selectedGenre 
                }
            });
            setData(prev => [...prev, ...response.data.results]);
            setTotalPage(response.data.total_pages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [params.explore, selectedGenre]);

    const handleScroll = useCallback(() => {
        if (
            (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10 &&
            !isLoading &&
            pageNo < totalPage
        ) {
            setPageNo(prev => prev + 1);
        }
    }, [isLoading, pageNo, totalPage]);

    useEffect(() => {
        fetchData(pageNo);
    }, [pageNo, fetchData]);

    useEffect(() => {
        setPageNo(1)
        setData([])
    }, [params.explore, selectedGenre])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value)
    }

    return (
        <div className='py-16'>
            <div className='container mx-auto'>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 mt-5 gap-4">
                    <h3 className='capitalize text-lg lg:text-xl font-semibold'>Popular {params.explore} show</h3>
                    <div className="relative w-full sm:w-auto">
                        <select onChange={handleGenreChange} value={selectedGenre} className="bg-neutral-800 text-white p-2 rounded-lg appearance-none w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">All Genres</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
                    {data.map((exploreData, index) => {
                        return (
                            <Card data={exploreData} key={exploreData.id + "exploreSection"} media_type={params.explore} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ExplorePgae