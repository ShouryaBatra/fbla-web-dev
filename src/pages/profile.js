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
          if (
            userSnap.data().role === "employer" ||
            userSnap.data().role === "admin"
          ) {
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
    if (postingIds.length === 0) {
      setApplications([]); // No postings, so no applications
      return;
    }

    const q = query(
      collection(db, "applications"),
      where("jobId", "in", postingIds)
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
      <main className="max-w-7xl mx-auto py-16 px-6 flex gap-6 w-full">
        {/* Left Panel */}
        <div className="w-1/2 overflow-y-auto max-h-[80vh] p-5">
          {userData?.role === "employer" || userData?.role === "admin" ? (
            <div>
              <h1 className="text-3xl font-bold text-dark-green mb-6">
                Your Job Postings
              </h1>
              {postings.length === 0 ? (
                <p className="text-gray-500">No job postings found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {postings.map((posting) => (
                    <div
                      key={posting.id}
                      className={`bg-white p-4 rounded-lg shadow-md border cursor-pointer transition-transform hover:scale-105 ${
                        selectedItem?.id === posting.id
                          ? "border-dark-green"
                          : ""
                      }`}
                      onClick={() => setSelectedItem(posting)}
                    >
                      <h2 className="text-lg font-bold text-dark-green">
                        {posting.title}
                      </h2>
                      <p className="text-gray-700 text-sm mt-2">
                        {posting.description.substring(0, 100)}...
                      </p>
                      <p
                        className={`mt-2 font-medium ${
                          posting.approved ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {posting.approved ? "Approved" : "Pending Approval"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-bold text-dark-green mt-6 mb-4">
                Pending Applications
              </h2>
              {applications.length === 0 ? (
                <p className="text-gray-500">No pending applications.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className={`bg-white p-4 rounded-lg shadow-md border cursor-pointer transition-transform hover:scale-105 ${
                        selectedItem?.id === app.id ? "border-dark-green" : ""
                      }`}
                      onClick={() => setSelectedItem(app)}
                    >
                      <h3 className="text-md font-bold text-dark-green truncate">
                        {app.name}
                      </h3>
                      <p className="text-gray-700 text-sm mt-2 truncate">
                        Job: {app.jobTitle}
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        Status: {app.status || "Waiting"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-dark-green mb-6">
                Your Applications
              </h1>
              {applications.length === 0 ? (
                <p className="text-gray-500">No applications found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className={`bg-white p-4 rounded-lg shadow-md border cursor-pointer transition-transform hover:scale-105 ${
                        selectedItem?.id === app.id ? "border-dark-green" : ""
                      }`}
                      onClick={() => setSelectedItem(app)}
                    >
                      <h2 className="text-lg font-bold text-dark-green truncate">
                        {app.jobTitle}
                      </h2>
                      <p className="text-gray-700 text-sm mt-2">
                        Status: {app.status || "Waiting"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
          {selectedItem ? (
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
                  <h3 className="text-lg font-bold text-dark-green mt-4">
                    Responsibilities:
                  </h3>
                  <ul className="list-disc ml-5">
                    {selectedItem.responsibilities.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-bold text-dark-green mt-4">
                    Skills Required:
                  </h3>
                  <ul className="list-disc ml-5">
                    {selectedItem.skills.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-bold text-dark-green mt-4">
                    Application Questions:
                  </h3>
                  <ul className="list-disc ml-5">
                    {selectedItem.questions.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-dark-green">
                    {selectedItem.name}
                  </h2>
                  <div className="text-lg">
                    <p className="text-gray-700 mt-4 flex flex-row">
                      <span className="font-semibold">Job:</span>{" "}
                      {selectedItem.jobTitle}
                    </p>
                    <p className="text-gray-700 mt-2 flex flex-row">
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedItem.email}
                    </p>
                    <p className="text-gray-700 mt-2 flex flex-row">
                      <span className="font-semibold">Age:</span>{" "}
                      {selectedItem.age}
                    </p>
                    <p className="text-gray-700 mt-2 flex flex-row">
                      <span className="font-semibold">Address:</span>{" "}
                      {selectedItem.address}
                    </p>
                    <p className="text-gray-700 mt-2 flex flex-row">
                      <span className="font-semibold">Phone:</span>{" "}
                      {selectedItem.phone}
                    </p>
                    <p className="text-gray-700 mt-2 flex flex-row">
                      <span className="font-semibold">Skills:</span>{" "}
                      {selectedItem.skills}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold text-dark-green mt-4">
                    Answers:
                  </h3>
                  <div className="max-h-[200px] overflow-y-auto">
                    {Object.entries(selectedItem.answers).map(
                      ([key, value]) => (
                        <p key={key} className="text-gray-700 mt-2">
                          {value}
                        </p>
                      )
                    )}
                  </div>
                  {(userData?.role === "employer" ||
                    userData?.role === "admin") && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() =>
                          handleAcceptReject(selectedItem.id, "accepted")
                        }
                        className="px-4 py-2 bg-teal-600 font-semibold text-white rounded-lg flex-1 hover:bg-teal-700 transition ease-linear duration-150"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAcceptReject(selectedItem.id, "rejected")
                        }
                        className="px-4 py-2 bg-teal-800 font-semibold text-white rounded-lg flex-1 hover:bg-teal-900 transition ease-linear duration-150"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-lg text-center">
              Select a job or application to view details
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
