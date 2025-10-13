import BannerHome from '../components/BannerHome'
import { useSelector } from 'react-redux'
import HorizonSrollCard from '../components/HorizonSrollCard'
import useFetch from '../hooks/useFetch'

const Home = () => {
    const trendingData = useSelector(state => state.movieoData.bannerData)
    const { data : topRateData } = useFetch('/movie/top_rated')
    const { data : popularData } = useFetch('/tv/popular')
    const { data : airingToday } = useFetch('/tv/on_the_air')
    const { data : upcomingData } = useFetch('/movie/upcoming')
    const { data : topRatedTvData } = useFetch('/tv/top_rated')


    return (
        <div>
            <BannerHome />
            <HorizonSrollCard data={trendingData} heading="Trending Now" trending={true} />
            <HorizonSrollCard data={topRateData} heading="Top Rate Movies" media_type={"movie"}/>
            <HorizonSrollCard data={popularData} heading="Popular TV Shows" media_type={"tv"}/>
            <HorizonSrollCard data={airingToday} heading="On The Air" media_type={"tv"}/>
            <HorizonSrollCard data={upcomingData} heading={"Upcoming Movies"} media_type={"movie"}/>
            <HorizonSrollCard data={topRatedTvData} heading={"Top Rated TV Shows"} media_type={"tv"}/>
        </div>
    )
}

export default Home