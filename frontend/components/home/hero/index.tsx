'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import 'flatpickr/dist/flatpickr.css';
import IconSearch from '@/components/icon/icon-search';
import Select from 'react-select';
import { useState, useEffect, useRef } from 'react';

interface GuestCounts {
    rooms: number;
    adults: number;
    children: number;
}

export default function HeroSection() {
    const options = [
        { value: '1 Room', label: '1 Room 2 Guest' },
        { value: '2 Rooms', label: '2 Rooms 4 Guest' },
        { value: '3 Rooms', label: '3 Rooms 6 Guest' },
        { value: 'Others', label: 'Others' },
    ];

    const images = ['/assets/hotel.jpg', '/assets/image4.jpg', '/assets/bed.jpg', '/assets/hall.jpg'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const [isOpen, setIsOpen] = useState(false);
    const [guests, setGuests] = useState<GuestCounts>({
        rooms: 1,
        adults: 2,
        children: 0,
    });

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    const handleChange = (type: keyof GuestCounts, operation: 'plus' | 'minus') => {
        setGuests((prev) => {
            const newValue = operation === 'plus' ? prev[type] + 1 : Math.max(prev[type] - 1, 0);
            return { ...prev, [type]: newValue };
        });
    };

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayText = `${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}, ${guests.adults} Adult${guests.adults > 1 ? 's' : ''}, ${guests.children} Child${guests.children > 1 ? 'ren' : ''}`;
    return (
        <section id="home-section" className="relative w-full h-screen overflow-hidden">
            {/* 👇 Background slider animation */}
            <AnimatePresence>
                <motion.div
                    key={images[currentIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    <Image src={images[currentIndex]} alt="Hero background" fill priority className="object-cover" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-black/40"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="relative z-10 flex flex-col lg:text-left items-center justify-center h-full text-white p-2"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Welcome to Maxandrea Hotel</h1>

                <div className="bg-white p-5 rounded-lg text-black flex flex-col gap-5 w-full lg:w-[50%]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                        <div>
                            <label htmlFor="fullname">Check In</label>
                            <input id="fullname" type="date" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="fullname">Check Out</label>
                            <input id="fullname" type="date" className="form-input" />
                        </div>

                        <div className="relative inline-block text-left" ref={dropdownRef}>
                            <label htmlFor="fullname">Rooms</label>
                            <button
                                onClick={handleToggle}
                                className="w-64 border border-gray-300 bg-white rounded-lg px-4 py-2 text-left flex justify-between items-center shadow-sm hover:border-gray-400 transition"
                            >
                                <span className="text-gray-800">{displayText}</span>
                                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isOpen && (
                                <div className="absolute z-50 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                    {Object.entries(guests).map(([key, value], index) => (
                                        <div key={key}>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="capitalize text-gray-700">{key}</span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleChange(key as keyof GuestCounts, 'minus')}
                                                        disabled={value <= 0}
                                                        className={`w-8 h-8 border rounded-full flex items-center justify-center ${
                                                            value <= 0 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-6 text-center">{value}</span>
                                                    <button
                                                        onClick={() => handleChange(key as keyof GuestCounts, 'plus')}
                                                        className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            {index < Object.entries(guests).length - 1 && <hr className="border-gray-200" />}
                                        </div>
                                    ))}

                                    <div className="flex justify-end mt-3">
                                        <button onClick={handleClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="btn btn-primary bg-[#6C2D40] flex flex-row gap-2">
                        <IconSearch />
                        Search
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
