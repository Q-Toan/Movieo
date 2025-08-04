import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Card = ({ data, trending, index, media_type }) => {
    const imgaeURL = useSelector(state => state.movieoData.imageURL)

    const mediaType = data.media_type ?? media_type
    return (
        <Link to={"/" + media_type + "/" + data.id} className='w-full min-w-[230px] max-w-[230px] rounded h-80 overflow-hidden block relative hover:scale-105 transition-all duration-300'>
            {
                data?.poster_path ? (
                    <img src={imgaeURL + data?.poster_path} alt='' />
                ) : (
                    <div className='bg-neutral-800 w-full h-full flex items-center justify-center'>
                        no image found
                    </div>
                )
            }
            <div className='absolute top-4'>
                {
                    trending && (
                        <div className='py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden'>
                            #{index} Trending
                        </div>
                    )
                }
            </div>
            <div className='absolute bottom-0 h-16 backdrop-blur-3xl w-full bg-black/60 p-2'>
                <h2 className='text-ellipsis line-clamp-1 text-lg font-semibold'>{data?.title || data?.name}</h2>
                <div className='text-sm text-neutral-400 flex justify-between'>
                    <p>
                        {moment(data.release_date).format('MMMM Do YYYY')}
                    </p>
                    <p className='bg-black px-1 rounded-full text-xs text-neutral-400'>
                        {Number(data.vote_average).toFixed(1)} <span className='text-sm text-neutral-400'>/ 10</span>
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default Card

