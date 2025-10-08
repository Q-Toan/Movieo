import React, { useRef } from 'react'
import Card from './Card'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";



const HorizonSrollCard = ({ data = [], heading, trending, media_type }) => {
    const containerRef = useRef()

    const handleNext = () => {
        const container = containerRef.current;
        const scrollAmount = container.offsetWidth;
        const maxScrollLeft = container.scrollWidth - container.offsetWidth;
        if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    const handlePrev = () => {
        const container = containerRef.current;
        const scrollAmount = container.offsetWidth;
        if (container.scrollLeft - scrollAmount <= 0) {
            const maxScrollLeft = container.scrollWidth - container.offsetWidth;
            container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 my-10'>
            <h2 className='text-xl font-bold sm:text-2xl text-white mb-4'>{heading}</h2>
            <div className='relative'>
                <div
                    ref={containerRef}
                    className='scroll-smooth grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-4 sm:gap-6 overflow-x-scroll overflow-y-hidden scrollbar-none relative z-10 transition-all duration-300'
                >
                    {data.map((data, index) => (
                        <Card
                            key={data.id + 'heading' + index}
                            data={data}
                            index={index + 1}
                            trending={trending}
                            media_type={media_type}
                        />
                    ))}
                </div>
                {/* Buttons */}
                <div className='absolute top-0 hidden lg:flex justify-between w-full h-full items-center px-2'>
                    <button
                        onClick={handlePrev}
                        className='bg-white p-2 text-black rounded-full shadow-md hover:scale-110 transition-transform z-20'
                    >
                        <FaAngleLeft />
                    </button>
                    <button
                        onClick={handleNext}
                        className='bg-white p-2 text-black rounded-full shadow-md hover:scale-110 transition-transform z-20'
                    >
                        <FaAngleRight />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default HorizonSrollCard