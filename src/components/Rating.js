import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ onRatingSubmit, initialRating = 0 }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleClick = (ratingValue) => {
        setRating(ratingValue);
        onRatingSubmit(ratingValue);
    }

    return (
        <div className='flex flex-col sm:flex-row items-start sm:items-center'>
            <h3 className='text-xl font-bold mr-4 mb-2 sm:mb-0'>Your rating:</h3>
            <div className='flex'>
                {[...Array(10)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={i}>
                            <input 
                                type="radio" 
                                name="rating" 
                                value={ratingValue} 
                                onClick={() => handleClick(ratingValue)}
                                className='hidden'
                            />
                            <FaStar 
                                className='cursor-pointer text-2xl sm:text-3xl' 
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default Rating;
