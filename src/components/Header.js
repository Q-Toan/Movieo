import { useEffect, useState, useRef } from 'react';
import logo from '../assets/logo.png';
import userIcon from '../assets/user.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const location = useLocation();
    const removeSpace = location?.search?.slice(3).split("%20")?.join(" ");
    const [searchInput, setSearchInput] = useState(removeSpace);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if(searchInput) {
            navigate(`/search?q=${searchInput}`);
        }
    }, [searchInput, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const HandleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLogout = () => {
        dispatch(logout());
        if (location.pathname === '/profile') {
            navigate('/login');
        } else {
            navigate('/');
        }
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
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`w-10 h-10 rounded-full overflow-hidden cursor-pointer transition-all transform hover:scale-110 ${isMenuOpen ? 'ring-2 ring-primary' : ''}`}>
                            <img src={isAuthenticated ? `https://www.gravatar.com/avatar/${user?.avatar?.gravatar?.hash}` : userIcon} alt='user' className='w-full h-full'/>
                        </button>
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-14 right-0 bg-neutral-800 w-48 rounded-lg shadow-lg py-2">
                                    {isAuthenticated ? (
                                        <>
                                            <Link to={'/profile'} className="block px-4 py-2 rounded-md text-white hover:bg-primary-hover">Profile</Link>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-md text-destructive hover:bg-destructive hover:text-white">Logout</button>
                                        </>
                                    ) : (
                                        <Link to={'/login'} className="block px-4 py-2 mx-1 rounded-md text-white hover:bg-primary-hover">Login</Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;