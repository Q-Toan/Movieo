import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'


const ExplorePgae = () => {
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams()
    const [pageNo, setPageNo] = useState(1)
    const [data, setData] = useState([])
    const [totalPage, setTotalPage] = useState(0)

    const fetchData = useCallback(async (page) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/discover/${params.explore}`, {
                params: { page }
            });
            setData(prev => [...prev, ...response.data.results]);
            setTotalPage(response.data.total_pages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [params.explore]);

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
    }, [params.explore])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <div className='py-16'>
            <div className='container mx-auto'>
                <h3 className='capitalize text-lg lg:text-xl font-semibold my-3'>Popular {params.explore} show</h3>
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