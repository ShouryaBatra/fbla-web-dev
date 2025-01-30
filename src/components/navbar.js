import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap p-4 sticky mb-4 bg-cream">
            <div className="flex items-center flex-shrink-0 mr-6 text-xl text-dark-green">
                <Link href="/" className="font-semibold tracking-tight ">
                    Logo
                </Link>
            </div>
            <div className="ml-auto flex space-x-10 mr-8 text-md">
                <Link href="/postings" className=" hover:text-green-900 font-semibold ease-linear duration-150 text-dark-green">
                    Postings
                </Link>
                <Link href="/login" className="text-dark-green font-semibold hover:text-green-900 ease-linear duration-150">
                    Login
                </Link>
                <Link href="/register" className="text-dark-green font-semibold hover:text-green-900 ease-linear duration-150">
                    Register
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
