import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const db = getFirestore(app);
const auth = getAuth(app);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [postings, setPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          if (userSnap.data().role === "employer") {
            fetchEmployerPostings(currentUser.uid);
          } else if (userSnap.data().role === "student") {
            fetchStudentApplications(currentUser.uid);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchEmployerPostings = async (userId) => {
    const q = query(collection(db, "postings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostings(jobs);
    fetchApplicationsForPostings(jobs.map((job) => job.id));
  };

  const fetchApplicationsForPostings = async (postingIds) => {
    const q = query(
      collection(db, "applications"),
      where("jobId", "in", postingIds)
    );
    const querySnapshot = await getDocs(q);
    const apps = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setApplications(apps);
  };

  const fetchStudentApplications = async (userId) => {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const apps = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch job titles for each application
    const appsWithJobTitles = await Promise.all(
      apps.map(async (app) => {
        const jobRef = doc(db, "postings", app.jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          return { ...app, jobTitle: jobSnap.data().title };
        }
        return app;
      })
    );

    setApplications(appsWithJobTitles);
  };

  const handleAcceptReject = async (applicationId, status) => {
    const appRef = doc(db, "applications", applicationId);
    await updateDoc(appRef, { status });
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
    );
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream-white">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-6 flex gap-6">
        {/* Main Content */}
        <div className="w-2/3">
          {userData?.role === "employer" || userData?.role === "admin" ? (
            <>
              <h1 className="text-3xl font-bold text-dark-green mb-6">
                Your Job Postings
              </h1>
              {postings.map((posting) => (
                <div
                  key={posting.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
                  onClick={() => setSelectedItem(posting)}
                >
                  <h2 className="text-lg font-bold text-dark-green">
                    {posting.title}
                  </h2>
                  <p className="text-gray-700 text-sm mt-2">
                    {posting.description.substring(0, 100)}...
                  </p>
                </div>
              ))}
              <h2 className="text-2xl font-bold text-dark-green mt-6">
                Applications
              </h2>
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
                  onClick={() => setSelectedItem(app)}
                >
                  <h3 className="text-md font-bold text-dark-green">
                    {app.name}
                  </h3>
                  <p className="text-gray-700 text-sm mt-2">
                    Status: {app.status || "Waiting"}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-dark-green mb-6">
                Your Applications
              </h1>
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
                  onClick={() => setSelectedItem(app)}
                >
                  <h2 className="text-lg font-bold text-dark-green">
                    {app.jobTitle}
                  </h2>
                  <p className="text-gray-700 text-sm mt-2">
                    Status: {app.status || "Waiting"}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          {selectedItem && (
            <>
              {selectedItem.title ? (
                <>
                  <h2 className="text-2xl font-bold text-dark-green">
                    {selectedItem.title}
                  </h2>
                  <p className="text-gray-700 mt-4">
                    {selectedItem.description}
                  </p>
                  <p className="text-lg font-semibold text-dark-green mt-4">
                    Salary: ${selectedItem.salary}
                  </p>
                  <h3 className="text-lg font-semibold mt-4">
                    Responsibilities:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedItem.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold mt-4">
                    Required Skills:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedItem.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-dark-green">
                    {selectedItem.name}
                  </h2>
                  <p className="text-gray-700 mt-4">
                    Email: {selectedItem.email}
                  </p>
                  <p className="text-gray-700 mt-2">Age: {selectedItem.age}</p>
                  <p className="text-gray-700 mt-2">
                    Address: {selectedItem.address}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Phone: {selectedItem.phone}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Skills: {selectedItem.skills}
                  </p>
                  <h3 className="text-lg font-semibold mt-4">Answers:</h3>
                  {Object.entries(selectedItem.answers).map(([key, value]) => (
                    <p key={key} className="text-gray-700 mt-2">
                      {value}
                    </p>
                  ))}
                  {(userData?.role === "employer" ||
                    userData?.role === "admin") && (
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          handleAcceptReject(selectedItem.id, "accepted")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAcceptReject(selectedItem.id, "rejected")
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
