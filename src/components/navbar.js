import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../config/firebase";

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
  };

  return (
    <nav className="flex items-center justify-between flex-wrap p-4 sticky bg-dark-green">
      <div className="flex items-center flex-shrink-0 mr-6 text-xl text-cream">
        <Link href="/" className="font-semibold tracking-tight ">
          Logo
        </Link>
      </div>
      <div className="ml-auto flex space-x-10 mr-8 text-md text-cream ">
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
  );
};

export default Navbar;
