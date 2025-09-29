import axios from 'axios';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const SearchPage = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1)
    const navigate = useNavigate()

    const query = location?.search?.slice(3);

    useEffect(() => {
        if (query) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/search/multi`, {
                        params: {
                            query: query,
                            page: page
                        }
                    })
                    setData((prev) => {
                        if (page === 1) {
                            return response.data.results;
                        }
                        return [
                            ...prev,
                            ...response.data.results
                        ]
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData()
        }
    }, [query, page])

    useEffect(() => {
        setPage(1);
    }, [query])


    const handleSroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setPage(preve => preve + 1)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleSroll)
        return () => {
            window.removeEventListener('scroll', handleSroll)
        }
    }, [])


    return (
        <div className=' py-16'>
            <div className='lg:hidden my-2 mx-1 sticky top-[70px] z-30'>
                <input 
                    type='text' 
                    placeholder='Search here...' 
                    className='px-4 py-1 text-lg w-full text-neutral-900 bg-white  rounded-full'
                    onChange={(e)=> navigate(`/search?q=${e.target.value}`)}
                />
            </div>
            <div className='container mx-auto'>
                <h3 className='capitalize text-lg lg:text-xl font-semibold my-3'>Search Results</h3>
                <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
                    {data.map((searchData, index) => {
                        return (
                            <Card data={searchData} key={searchData.id + "search"} media_type={searchData.media_type} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SearchPage