import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const db = getFirestore(app);
const auth = getAuth(app);

export default function Admin() {
  const [unapprovedPostings, setUnapprovedPostings] = useState([]);
  const [allPostings, setAllPostings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        setLoading(true);

        const unapprovedQuery = query(
          collection(db, "postings"),
          where("approved", "==", false)
        );
        const unapprovedSnapshot = await getDocs(unapprovedQuery);
        setUnapprovedPostings(
          unapprovedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const allQuery = collection(db, "postings");
        const allSnapshot = await getDocs(allQuery);
        setAllPostings(
          allSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching job postings: ", error);
        setLoading(false);
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

  const approvePosting = async (id) => {
    try {
      await updateDoc(doc(db, "postings", id), { approved: true });
      setUnapprovedPostings(
        unapprovedPostings.filter((posting) => posting.id !== id)
      );
    } catch (error) {
      console.error("Error approving posting: ", error);
    }
  };

  const deletePosting = async (id) => {
    try {
      await deleteDoc(doc(db, "postings", id));
      setUnapprovedPostings(
        unapprovedPostings.filter((posting) => posting.id !== id)
      );
      setAllPostings(allPostings.filter((posting) => posting.id !== id));
      setSelectedJob(null);
    } catch (error) {
      console.error("Error deleting posting: ", error);
    }
  };

  return (
    <>
      <main className="flex flex-col min-h-screen bg-cream-white">
        <Navbar />
        <section className="max-w-7xl mx-auto py-16 px-6 flex gap-6">
          <div className="w-auto overflow-y-auto max-h-[80vh] border-r border-gray-300 p-5">
            <h1 className="text-3xl font-bold text-dark-green mb-6">
              Admin Panel
            </h1>
            <h2 className="text-2xl font-bold text-dark-green mb-4">
              Pending Approvals
            </h2>
            {unapprovedPostings.length === 0 ? (
              <p className="text-gray-500">
                No pending job approvals at the moment.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {unapprovedPostings.map((job) => (
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
                  </div>
                ))}
              </div>
            )}
            <h2 className="text-2xl font-bold text-dark-green mb-4 mt-6">
              All Job Postings
            </h2>
            <div className="flex flex-col gap-4">
              {allPostings.map((job) => (
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
                </div>
              ))}
            </div>
          </div>
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
                <h3 className="text-lg font-bold text-dark-green mt-4">
                  Responsibilities:
                </h3>
                <ul className="list-disc ml-5">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-bold text-dark-green mt-4">
                  Skills Required:
                </h3>
                <ul className="list-disc ml-5">
                  {selectedJob.skills.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-bold text-dark-green mt-4">
                  Application questions:
                </h3>
                <ul className="list-disc ml-5">
                  {selectedJob.questions.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-4">
                  {!selectedJob.approved && (
                    <button
                      className="px-4 py-2 bg-dark-green text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
                      onClick={() => approvePosting(selectedJob.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition"
                    onClick={() => deletePosting(selectedJob.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-gray-500 text-lg text-center">
                  Select a job to view details
                </p>
                <p className="text-white">
                  Select a job to view details Select a job to view details
                  Select a job to view details Select a job to view details{" "}
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
