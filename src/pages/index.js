import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import SpeedoMeter from "@/components/SpeedoMeter";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../config/firebase";

const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);
  return (
    <>
      <main className="flex flex-col min-h-screen bg-cream-white">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-dark-green text-cream py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold">Find Your Future Career</h1>
            <p className="text-lg mt-4">
              Helping students at Homestead High School connect with employers
              and explore career opportunities.
            </p>
            {!user ? (
              <Link
                href="/register"
                className="mt-6 inline-block bg-white text-dark-green px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-cream transition"
              >
                Sign Up Now
              </Link>
            ) : (
              <Link
                href="/postings"
                className="mt-6 inline-block bg-white text-dark-green px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:bg-cream transition"
              >
                View Open Positions
              </Link>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-semibold text-dark-green">
              About Homestead Careers
            </h2>
            <p className="text-lg mt-4 text-gray-700">
              Homestead Careers is a platform built to connect students with job
              opportunities, internships, and employers looking for talent.
              Whether you&apos;re a student looking for experience or an employer
              wanting to recruit, we make the process simple and efficient.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-cream py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-12">
            <div>
              <h3 className="text-5xl font-bold text-dark-green flex flex-row justify-center">
                <SpeedoMeter value={1000} />
                <div>+</div>
              </h3>
              <p className="text-lg text-gray-700">Students Found Jobs</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold text-dark-green flex flex-row justify-center">
                <SpeedoMeter value={500} />
                <div>+</div>
              </h3>
              <p className="text-lg text-gray-700">Employers Registered</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold text-dark-green flex flex-row justify-center">
                <SpeedoMeter value={200} />
                <div>+</div>
              </h3>
              <p className="text-lg text-gray-700">Internship Opportunities</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 text-center px-6">
          <h2 className="text-4xl font-semibold text-dark-green">
            What Students Say
          </h2>
          <div className="max-w-4xl mx-auto mt-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md transition duration-300 hover:bg-cream hover:scale-[1.05]">
              <p className="text-lg text-gray-700 ">
                &quote;Homestead Careers helped me land my first internship! The
                platform made it so easy to find opportunities.&quote;
              </p>
              <p className="text-sm font-semibold text-dark-green mt-2">
                - Alex M., Senior
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md  transition duration-300 hover:bg-cream hover:scale-[1.05]">
              <p className="text-lg text-gray-700">
                &quote;I never thought I&apos;d find a job while still in high school. This
                site made it happen!&quote;
              </p>
              <p className="text-sm font-semibold text-dark-green mt-2">
                - Sophia L., Junior
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
