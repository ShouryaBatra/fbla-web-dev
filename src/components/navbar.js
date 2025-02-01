import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap p-4 sticky mb-4 bg-dark-green">
            <div className="flex items-center flex-shrink-0 mr-6 text-xl text-cream">
                <Link href="/" className="font-semibold tracking-tight ">
                    Logo
                </Link>
            </div>
            <div className="ml-auto flex space-x-10 mr-8 text-md text-cream ">
                <Link href="/postings" className=" hover:text-green-600 font-semibold ease-linear duration-150 ">
                    Postings
                </Link>
                <Link href="/login" className=" font-semibold hover:text-green-600 ease-linear duration-150">
                    Login
                </Link>
                <Link href="/register" className="font-semibold hover:text-green-600 ease-linear duration-150">
                    Register
                </Link>
            </div> 
        </nav>
    );
};

export default Navbar;
