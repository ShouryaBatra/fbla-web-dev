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
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobileView(window.innerWidth < 1024);
      };

      setIsMobileView(window.innerWidth < 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleItemDetails = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

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
      setApplications([]);
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
      <main className="max-w-7xl mx-auto py-16 px-6 flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 mt-16">
          {userData?.role === "employer" || userData?.role === "admin" ? (
            <>
              <h1 className="text-3xl font-bold text-dark-green mb-6">
                Your Job Postings
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {postings.map((posting) => (
                  <div
                    key={posting.id}
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => {
                      if (isMobileView) {
                        toggleItemDetails(posting.id);
                      } else {
                        setSelectedItem(posting);
                      }
                    }}
                  >
                    <h2 className="text-lg font-bold text-dark-green truncate">
                      {posting.title}
                    </h2>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {posting.description}
                    </p>
                    <p
                      className={`mt-0 font-medium flex flex-row ${
                        posting.approved ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span className="text-dark-green mr-1">Status:</span>
                      {posting.approved ? "Approved" : "Pending Approval"}
                    </p>
                    {isMobileView && expandedItemId === posting.id && (
                      <div className="mt-4">
                        <p className="text-gray-700">{posting.description}</p>
                        <p className="text-lg font-semibold text-dark-green mt-4">
                          Salary: ${posting.salary}
                        </p>
                        <h3 className="text-lg font-semibold mt-4">
                          Responsibilities:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {posting.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                        <h3 className="text-lg font-semibold mt-4">
                          Required Skills:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {posting.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                        <h3 className="text-lg font-semibold mt-4">
                          Questions:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {posting.questions.map((question, index) => (
                            <li key={index}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <h2 className="text-3xl font-bold text-dark-green mt-12 mb-6">
                Pending Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => {
                      if (isMobileView) {
                        toggleItemDetails(app.id);
                      } else {
                        setSelectedItem(app);
                      }
                    }}
                  >
                    <h3 className="text-md font-bold text-dark-green truncate">
                      {app.name}
                    </h3>
                    <p className="text-gray-700 text-sm mt-2 truncate">
                      Job: {app.jobTitle}
                    </p>
                    {app.status === "accepted" ? (
                      <p className="text-gray-700 text-sm mt-2 flex flex-row">
                        Status: <p className="text-green-600 pl-1">Accepted</p>
                      </p>
                    ) : app.status === "rejected" ? (
                      <p className="text-gray-700 text-sm mt-2 flex flex-row">
                        Status: <p className="text-red-600 pl-1">Rejected</p>
                      </p>
                    ) : (
                      <p className="text-gray-700 text-sm mt-2">
                        Status: Waiting
                      </p>
                    )}
                    {isMobileView && expandedItemId === app.id && (
                      <div className="mt-4">
                        <h2 className="text-2xl font-bold text-dark-green">
                          {app.jobTitle}
                        </h2>
                        <div className="text-lg">
                          <p className="text-gray-700 mt-4 flex flex-row">
                            <p className="font-semibold">Job</p>: {app.jobTitle}
                          </p>
                          <p className="text-gray-700 mt-4 flex flex-row">
                            <p className="font-semibold">Email</p>: {app.email}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Age</p>: {app.age}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Address</p>:{" "}
                            {app.address}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Phone</p>: {app.phone}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Skills</p>:{" "}
                            {app.skills}
                          </p>
                        </div>
                        <h3 className="text-lg font-semibold mt-4">Answers:</h3>
                        <div className="max-h-[200px] overflow-y-auto">
                          {Object.entries(app.answers).map(([key, value]) => (
                            <p key={key} className="text-gray-700 mt-2">
                              {value}
                            </p>
                          ))}
                        </div>
                        {(userData?.role === "employer" ||
                          userData?.role === "admin") && (
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() =>
                                handleAcceptReject(app.id, "accepted")
                              }
                              className="px-4 py-2 bg-teal-600 font-semibold text-white rounded-lg flex-1 hover:bg-teal-700 transition ease-linear duration-150"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleAcceptReject(app.id, "rejected")
                              }
                              className="px-4 py-2 bg-teal-800 font-semibold text-white rounded-lg flex-1 hover:bg-teal-900 transition ease-linear duration-150"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-dark-green mb-6">
                Your Applications
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                    onClick={() => {
                      if (isMobileView) {
                        toggleItemDetails(app.id);
                      } else {
                        setSelectedItem(app);
                      }
                    }}
                  >
                    <h2 className="text-lg font-bold text-dark-green truncate">
                      {app.jobTitle}
                    </h2>
                    {app.status === "accepted" ? (
                      <p className="text-gray-700 text-sm mt-2 flex flex-row">
                        Status: <p className="text-green-600 pl-1">Accepted</p>
                      </p>
                    ) : app.status === "rejected" ? (
                      <p className="text-gray-700 text-sm mt-2 flex flex-row">
                        Status: <p className="text-red-600 pl-1">Rejected</p>
                      </p>
                    ) : (
                      <p className="text-gray-700 text-sm mt-2">
                        Status: Waiting
                      </p>
                    )}
                    {isMobileView && expandedItemId === app.id && (
                      <div className="mt-4">
                        <h2 className="text-2xl font-bold text-dark-green">
                          {app.jobTitle}
                        </h2>
                        <div className="text-lg">
                          <p className="text-gray-700 mt-4 flex flex-row">
                            <p className="font-semibold">Job</p>: {app.jobTitle}
                          </p>
                          <p className="text-gray-700 mt-4 flex flex-row">
                            <p className="font-semibold">Email</p>: {app.email}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Age</p>: {app.age}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Address</p>:{" "}
                            {app.address}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Phone</p>: {app.phone}
                          </p>
                          <p className="text-gray-700 mt-2 flex flex-row">
                            <p className="font-semibold">Skills</p>:{" "}
                            {app.skills}
                          </p>
                        </div>
                        <h3 className="text-lg font-semibold mt-4">Answers:</h3>
                        <div className="max-h-[200px] overflow-y-auto">
                          {Object.entries(app.answers).map(([key, value]) => (
                            <p key={key} className="text-gray-700 mt-2">
                              {value}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Side Panel (Desktop Only) */}
        {!isMobileView && (
          <div className="w-1/2 mt-[7.7rem] bg-white p-6 rounded-lg shadow-md min-h-[540px] max-h-[540px] overflow-y-auto">
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
                    <h3 className="text-lg font-semibold mt-4">Questions:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {selectedItem.questions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-dark-green">
                      {selectedItem.jobTitle}
                    </h2>
                    <div className="text-lg">
                      <p className="text-gray-700 mt-4 flex flex-row">
                        <p className="font-semibold">Job</p>:{" "}
                        {selectedItem.jobTitle}
                      </p>
                      <p className="text-gray-700 mt-4 flex flex-row">
                        <p className="font-semibold">Email</p>:{" "}
                        {selectedItem.email}
                      </p>
                      <p className="text-gray-700 mt-2 flex flex-row">
                        <p className="font-semibold">Age</p>: {selectedItem.age}
                      </p>
                      <p className="text-gray-700 mt-2 flex flex-row">
                        <p className="font-semibold">Address</p>:{" "}
                        {selectedItem.address}
                      </p>{" "}
                      <p className="text-gray-700 mt-2 flex flex-row">
                        <p className="font-semibold">Phone</p>:{" "}
                        {selectedItem.phone}
                      </p>
                      <p className="text-gray-700 mt-2 flex flex-row">
                        <p className="font-semibold">Skills</p>:{" "}
                        {selectedItem.skills}
                      </p>
                    </div>
                    <h3 className="text-lg font-semibold mt-4">Answers:</h3>
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
            )}
            <p className="text-white">
              Questions: Questions: Questions: Questions: Questions: Questions:
              Questions: Questions: Questions: Questions: Questions: Questions:{" "}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
