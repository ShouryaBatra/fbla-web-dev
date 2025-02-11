import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../config/firebase";
import Image from "next/image";
import logo from "../assets/logo.png";

const auth = getAuth(app);
const db = getFirestore(app);

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
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

  return (
    <div className="mb-12">
      <nav className="flex items-center justify-between flex-wrap pb-1 fixed w-full h-20 bg-dark-green">
        <div className="flex items-center flex-shrink-0 mr-6 text-xl text-cream transition duration-300 hover:scale-105">
          <Image
            src={logo}
            alt="logo"
            width={140}
            height={140}
            className="ml-[-20px]"
          />
          <Link href="/" className="font-semibold tracking-tight text-2xl">
            <p className="ml-[-20px] ">Homestead Careers</p>
          </Link>
        </div>
        <div className="ml-auto flex space-x-10 mr-8 text-lg text-cream">
          {(isEmployer || isAdmin) && (
            <Link
              href="/new-posting"
              className="hover:text-green-600 font-semibold ease-linear duration-150"
            >
              <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
                Create a posting
              </p>
            </Link>
          )}

          <Link
            href="/postings"
            className="hover:text-green-600 font-semibold ease-linear duration-150"
          >
            <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
              Postings
            </p>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-green-600 font-semibold ease-linear duration-150"
            >
              <p className="transition duration-300 hover:text-cream-white hover:scale-[1.05]">
                Admin
              </p>
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="hover:text-green-600 font-semibold ease-linear duration-150"
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
