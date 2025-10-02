import {useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import userIcon from '../assets/user.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';

const Header = () => {
    const location = useLocation();
    const removeSpace = location?.search?.slice(3).split("%20")?.join(" ");
    const [searchInput, setSearchInput] = useState(removeSpace);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    console.log(user);
    

    useEffect(() => {
        if(searchInput) {
            navigate(`/search?q=${searchInput}`);
        }
    }, [searchInput, navigate]);

    const HandleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    return (
        <header className ='fixed top-0 w-full h-16 bg-black bg-opacity-75 z-50'>
            <div className='container mx-auto px-4 flex items-center h-full'>
                <Link to={'/'}>
                    <img
                        src = {logo}
                        alt = 'Logo'
                        width = {120}
                    />
                </Link>
                <nav className='hidden lg:flex items-center gap-2 ml-5'>
                    {
                        navigation.map((nav, index) => {
                            return (
                                <NavLink key={nav.label} to={nav.href} className={({isActive}) =>`px-2 hover:text-neutral-100 ${isActive && "text-neutral-100"}`}>
                                    {nav.label}
                                </NavLink>
                            )
                        })
                    }
                    {isAuthenticated && (
                        <NavLink to="/watchlist" className={({isActive}) =>`px-2 hover:text-neutral-100 ${isActive && "text-neutral-100"}`}>
                            Watchlist
                        </NavLink>
                    )}
                </nav>
                <div className='ml-auto flex items-center gap-4'>
                    <form className='flex items-center gap-2' onSubmit={HandleSubmit}>
                        <input 
                            type='text' 
                            placeholder='Search Here'
                            className='w-96 h-10 px-4 rounded-full bg-transparent text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 hidden lg:block'
                            onChange={(e)=> setSearchInput(e.target.value)}
                            value={searchInput}
                        />
                    </form>
                    <button className='text-2xl text-white mobile:hidden lg:block'>
                        <IoSearchOutline/>
                    </button>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className='w-10 h-10 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                                <img src={`https://www.gravatar.com/avatar/${user?.avatar?.gravatar?.hash}`} alt='user' className='w-full h-full'/>
                            </div>
                            <button onClick={handleLogout} className="text-white">Logout</button>
                        </div>
                    ) : (
                        <Link to={'/login'}>
                            <div className='w-10 h-10 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                                <img src={userIcon} alt='user' className='w-full h-full'/>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header