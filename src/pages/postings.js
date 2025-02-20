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
  const [expandedJobId, setExpandedJobId] = useState(null); // Track expanded job
  const [isMobileView, setIsMobileView] = useState(false); // Initialize with a default value

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

  // Track window resize to update mobile view state
  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobileView(window.innerWidth < 1024);
      };

      // Set initial value
      setIsMobileView(window.innerWidth < 1024);

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleJobDetails = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <>
      <main className="flex flex-col min-h-screen bg-cream-white">
        <Navbar />
        <section className="max-w-7xl mx-auto py-16 px-6 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-dark-green mb-6 mt-4 ml-6">
            Explore Job Opportunities
          </h1>
          <div className="flex flex-col lg:flex-row max-w-full">
            {/* Job Listings */}
            <div className="w-full lg:w-auto lg:overflow-y-auto lg:max-h-[80vh] lg:border-r lg:border-gray-300 p-5">
              <div className="flex flex-col gap-4">
                {postings.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white p-4 rounded-xl shadow-md border cursor-pointer transition-transform ${
                      selectedJob?.id === job.id ? "border-dark-green" : ""
                    }`}
                    onClick={() => {
                      if (isMobileView) {
                        toggleJobDetails(job.id); // Toggle job details on mobile
                      } else {
                        setSelectedJob(job); // Set selected job on desktop
                      }
                    }}
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

                    {/* Show "Show More" text on mobile */}
                    {isMobileView && expandedJobId !== job.id && (
                      <p
                        className="text-blue-500 text-sm mt-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          toggleJobDetails(job.id);
                        }}
                      >
                        Show More
                      </p>
                    )}

                    {/* Show job details if expanded on mobile */}
                    {expandedJobId === job.id && (
                      <div className="mt-4">
                        <p className="text-gray-700">{job.description}</p>
                        <p className="text-lg font-semibold text-dark-green mt-4">
                          Salary: ${job.salary}/hr
                        </p>
                        <h3 className="text-lg font-semibold mt-4">
                          Responsibilities:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {job.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                        <h3 className="text-lg font-semibold mt-4">
                          Required Skills:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {job.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                        {user && (
                          <button
                            className="mt-6 px-6 py-3 bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-teal-800 ease-linear duration-150 transition"
                            onClick={() => {
                              window.location.href = `/application?jobId=${job.id}`;
                            }}
                          >
                            Apply Now
                          </button>
                        )}

                        {/* Add "Hide" text */}
                        <p
                          className="text-blue-500 text-sm mt-4 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click event
                            toggleJobDetails(job.id);
                          }}
                        >
                          Hide
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Job Details (Desktop Only) */}
            <div className="hidden lg:block bg-white p-6 rounded-xl shadow-md overflow-y-auto max-h-[80vh] w-[42rem] mt-4 ml-8 text-lg">
              {selectedJob ? (
                <>
                  <h2 className="text-2xl font-bold text-dark-green">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-700 mt-4">
                    {selectedJob.description}
                  </p>
                  <p className="text-lg font-semibold text-dark-green mt-4">
                    Salary: ${selectedJob.salary}/hr
                  </p>
                  <h3 className="text-lg font-semibold mt-4">
                    Responsibilities:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedJob.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold mt-4">
                    Required Skills:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedJob.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  {user && (
                    <button
                      className="mt-6 px-6 py-3 bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-teal-800 ease-linear duration-150 transition"
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
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
