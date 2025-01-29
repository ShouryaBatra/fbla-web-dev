import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4 sticky mb-4">
            <div className="flex items-center flex-shrink-0 text-white mr-6 text-xl">
                <Link href="/" className="font-semibold tracking-tight">
                    Logo
                </Link>
            </div>
            <div className="ml-auto flex space-x-10 mr-8 text-md">
                <Link href="/postings" className="text-white hover:text-gray-400 ease-linear duration-150">
                    Postings
                </Link>
                <Link href="/login" className="text-white hover:text-gray-400 ease-linear duration-150">
                    Login
                </Link>
                <Link href="/register" className="text-white hover:text-gray-400 ease-linear duration-150">
                    Register
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
