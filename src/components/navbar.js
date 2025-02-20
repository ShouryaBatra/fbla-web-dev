import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../config/firebase";
import Image from "next/image";
import logo from "../assets/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";

const auth = getAuth(app);
const db = getFirestore(app);

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else if (userDoc.exists() && userDoc.data().role === "employer") {
          setIsEmployer(true);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsEmployer(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    window.location.href = "/";
  };

  const formatName = (fullName) => {
    if (!fullName) return "";

    const nameParts = fullName.trim().split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0]} ${nameParts[1][0]}.`;
    }
    return nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
  };

  return (
    <div className="mb-12">
      <nav className="flex items-center justify-between flex-wrap pb-1 fixed w-full h-20 bg-dark-green">
        <Link
          href="/"
          className="flex items-center flex-shrink-0 text-xl ml-[-10px] text-cream transition duration-300 hover:scale-105"
        >
          <Image
            src={logo}
            alt="logo"
            width={1000}
            height={1000}
            className="w-[120px] md:w-[140px] transition-all duration-300"
          />

          <div className="font-semibold tracking-tight text-2xl hidden md:block">
            <p className="ml-[-20px]">Homestead Careers</p>
          </div>
        </Link>
        <div className="ml-auto flex space-x-10 mr-8 text-lg text-cream">
          <div className="hidden md:flex space-x-10">
            <Link
              href="/postings"
              className="hover:text-green-600 font-semibold ease-linear duration-150"
            >
              <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
                Postings
              </p>
            </Link>
            {user ? (
              <div>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="hover:text-green-600 font-semibold ease-linear duration-150"
                >
                  <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
                    {formatName(user.name)}
                  </p>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-2">
                    <Link
                      href="/profile"
                      className="block w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {(isEmployer || isAdmin) && (
                      <Link
                        href="/new-posting"
                        className="block w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100"
                      >
                        Create Postings
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-cream font-semibold"
            >
              <div className="text-3xl pt-2">
                <RxHamburgerMenu />
              </div>
            </button>
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link
                  href="/postings"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Postings
                </Link>
                {user && (
                  <>
                    <Link
                      href="/profile"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {(isEmployer || isAdmin) && (
                      <Link
                        href="/new-posting"
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Create Postings
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
                {!user && (
                  <Link
                    href="/login"
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
