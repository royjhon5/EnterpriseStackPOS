'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import HeaderLink from './navigation/HeaderLink';
import { Headerdata } from '@/lib/data/pageData';
import MobileHeaderLink from '@/components/layouts/navigation/MobileHeaderLink';
import Logo from '@/components/layouts/logo';

const LandingPageHeader: React.FC = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const handleScroll = () => {
        setSticky(window.scrollY >= 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && navbarOpen) {
            setNavbarOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navbarOpen, isSignInOpen, isSignUpOpen]);

    useEffect(() => {
        if (isSignInOpen || isSignUpOpen || navbarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isSignInOpen, isSignUpOpen, navbarOpen]);

    return (
        <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${sticky ? ' shadow-lg bg-body-bg bg-[#6C2D40] py-4' : 'shadow-none py-6'}`}>
            <div>
                <div className="container flex items-center justify-between">
                    <Logo />
                    <nav className="hidden lg:flex grow items-center gap-8 justify-center ml-14">
                        {Headerdata.map((item, index) => (
                            <HeaderLink key={index} item={item} />
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            className="btn btn-tertiary rounded-lg text-white"
                            onClick={() => {
                                setIsSignUpOpen(true);
                            }}
                        >
                            Book Now
                        </button>
                        <button onClick={() => setNavbarOpen(!navbarOpen)} className="block lg:hidden p-2 rounded-lg" aria-label="Toggle mobile menu">
                            <span className="block w-6 h-0.5 bg-white"></span>
                            <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
                            <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
                        </button>
                    </div>
                </div>
                {navbarOpen && <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40" />}
                <div
                    ref={mobileMenuRef}
                    className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
                        navbarOpen ? 'translate-x-0' : 'translate-x-full'
                    } z-50`}
                >
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-lg font-bold text-midnight_text">{/* <Logo /> */}</h2>
                        {/*  */}
                        <button onClick={() => setNavbarOpen(false)} className="hover:cursor-pointer" aria-label="Close menu Modal">
                            {/* <Icon
                icon="tabler:currency-xrp"
                className="text-white text-xl hover:text-primary text-24 inline-block me-2"
              /> */}
                        </button>
                    </div>
                    <nav className="flex flex-col items-start p-4 text-white">
                        {Headerdata.map((item, index) => (
                            <MobileHeaderLink key={index} item={item} />
                        ))}
                        <div className="mt-4 flex flex-col space-y-4 w-full">
                            <Link
                                href="#"
                                className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white"
                                onClick={() => {
                                    setIsSignInOpen(true);
                                    setNavbarOpen(false);
                                }}
                            >
                                Book Now
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default LandingPageHeader;
