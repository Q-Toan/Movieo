import axios from 'axios';
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBannerData , setImageURL} from './store/movieoSlice';
import Toast from './components/Toast';
import { hideToast } from './store/toastSlice';

function App() {
  const dispatch = useDispatch();
  const { isVisible, message, type } = useSelector(state => state.toast);

  const fetchTrendingData = useCallback(async () => {
    try {
      const response = await axios.get('/trending/all/week')
      dispatch(setBannerData(response.data.results))
    }
    catch (error) {
      console.error('Error fetching trending data:', error);
    }
  }, [dispatch])

  const fetchConfiguration = useCallback(async () => {
    try {
      const response = await axios.get('/configuration')
      dispatch(setImageURL(response.data.images.secure_base_url+"original"))
    }
    catch (error) {
      console.error('Error fetching configuration data:', error);
    }
  }, [dispatch])

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, [fetchTrendingData, fetchConfiguration]);

  return (
    <main className='pb-14 lg:pb-0'>
      <Header />
        <div className='min-h-[90vh]'>
          <Outlet />
        </div>
      <Footer />
      <MobileNavigation />
      {isVisible && (
        <div className="fixed top-5 right-5 z-50">
          <Toast message={message} type={type} onClose={() => dispatch(hideToast())} />
        </div>
      )}
    </main>
  );
}

export default App;
