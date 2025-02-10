import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../config/firebase";
import Image from "next/image";
import logo from "../assets/logo.png"

const auth = getAuth(app);

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null); // Reset user state after logging out
    window.location.href = "/";
  };

  return (
    <div className="mb-12">
    <nav className="flex items-center justify-between flex-wrap pb-1 fixed w-full h-20 bg-dark-green">
      <div className="flex items-center flex-shrink-0 mr-6 text-xl text-cream">
        <Image src={logo} alt="logo" width={140} height={140} className="ml-[-20px]"/>
        <Link href="/" className=" font-semibold tracking-tight text-2xl ">
          <p className="ml-[-20px]">Homestead Careers</p>
        </Link>
      </div>
      <div className="ml-auto flex space-x-10 mr-8 text-lg text-cream ">
        <Link
          href="/postings"
          className=" hover:text-green-600 font-semibold ease-linear duration-150 "
        >
          <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
            Postings
          </p>
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className=" hover:text-green-600 font-semibold ease-linear duration-150 "
          >
            <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
              Log Out
            </p>
          </button>
        ) : (
          <Link
            href="/login"
            className="font-semibold hover:text-green-600 ease-linear duration-150"
          >
            <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
              Login
            </p>
          </Link>
        )}
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
