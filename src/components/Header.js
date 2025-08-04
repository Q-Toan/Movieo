import {useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import usericon from '../assets/user.png';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';


const Header = () => {
    const location = useLocation();
    const removeSpace = location?.search?.slice(3).split("%20")?.join(" ");
    const [searchInput, setSearchInput] = useState(removeSpace);
    const navigate = useNavigate();

    useEffect(() => {
        if(searchInput) {
            navigate(`/search?q=${searchInput}`);
        }
    }, [searchInput]);

    const HandleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <header className ='fixed top-0 w-full h-16 bg-black bg-opacity-75 z-50'>
            <div className='container mx-auto px-4 flex items-center h-full'>
                <Link to='/'>
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
                    <button className='text-2xl text-white'>
                        <IoSearchOutline/>
                    </button>
                    <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all duration-200'>
                        <img 
                            src = {usericon}
                            alt='User Icon'
                            width='w-full h-full'
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header