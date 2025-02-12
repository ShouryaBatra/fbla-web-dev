import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const db = getFirestore(app);
const auth = getAuth(app);

export default function Postings() {
  const [postings, setPostings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const q = query(
          collection(db, "postings"),
          where("approved", "==", true)
        ); // Fetch only approved jobs
        const querySnapshot = await getDocs(q);
        const jobs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostings(jobs);
      } catch (error) {
        console.error("Error fetching job postings: ", error);
      }
    };

    fetchPostings();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <main className="flex flex-col min-h-screen bg-cream-white">
        <Navbar />
        <section className="max-w-7xl mx-auto py-16 px-6 flex gap-6 ">
          {/* Job Listings */}
          <div className="w-auto overflow-y-auto max-h-[80vh] border-r border-gray-300 p-5">
            <h1 className="text-3xl font-bold text-dark-green mb-6">
              Explore Job Opportunities
            </h1>
            <div className="flex flex-col gap-4 ">
              {postings.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white p-4 rounded-lg shadow-md border cursor-pointer transition-transform hover:scale-105 ${
                    selectedJob?.id === job.id ? "border-dark-green" : ""
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <h2 className="text-lg font-bold text-dark-green">
                    {job.title}
                  </h2>
                  <p className="text-gray-700 text-sm mt-2">
                    {job.description.substring(0, 100)}...
                  </p>
                  <p className="text-md font-semibold text-dark-green mt-2">
                    Salary: ${job.salary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Details */}
          <div className="w-3/5 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[80vh] mt-20">
            {selectedJob ? (
              <>
                <h2 className="text-2xl font-bold text-dark-green">
                  {selectedJob.title}
                </h2>
                <p className="text-gray-700 mt-4">{selectedJob.description}</p>
                <p className="text-lg font-semibold text-dark-green mt-4">
                  Salary: ${selectedJob.salary}
                </p>
                <h3 className="text-lg font-semibold mt-4">
                  Responsibilities:
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mt-4">Required Skills:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {selectedJob.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
                {user && (
                  <button
                    className="mt-6 px-6 py-3 bg-dark-green text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 transition"
                    onClick={() => {
                      window.location.href = `/application?jobId=${selectedJob.id}`;
                    }}
                  >
                    Apply Now
                  </button>
                )}
              </>
            ) : (
              <div>
                <p className="text-gray-500 text-lg text-center">
                  Select a job to view details
                </p>
                <p className="text-white">
                  Select a job to view details Select a job to view details
                  Select a job to view details Select a job to view details
                  Select a job to view details Select a job to view details
                  Select a job to view details Select a job to view details
                </p>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
