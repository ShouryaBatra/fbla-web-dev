import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { app } from "../../config/firebase"; 
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
            if (userDoc.data().role === "student") {
              fetchApplications(currentUser.uid); // Fetch applications if the user is a student
            } else {
              fetchJobPostings(currentUser.uid); // Fetch job postings if the user is not a student
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchJobPostings = async (userId) => {
    try {
      const q = query(collection(db, "postings"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const postings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobPostings(postings);

      // Fetch applications for each posting
      const applicationsData = {};
      for (const job of postings) {
        const jobApplications = await fetchApplicationsForJob(job.id);
        applicationsData[job.id] = jobApplications;
      }
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    }
  };

  const fetchApplicationsForJob = async (jobId) => {
    try {
      const q = query(collection(db, "applications"), where("jobId", "==", jobId));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return apps;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const fetchApplications = async (studentId) => {
    try {
      const q = query(collection(db, "applications"), where("studentId", "==", studentId));
      const querySnapshot = await getDocs(q);
      const studentApplications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(studentApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const formatName = (fullName) => {
    if (!fullName) return "";
    const nameParts = fullName.trim().split(" ");
    return nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[1][0]}.`
      : nameParts[0];
  };

  return (
    <main className="flex flex-col min-h-screen bg-cream-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center py-10 mt-10">
        <div className="p-8 rounded-lg shadow-md text-center max-w-4xl w-full bg-cream">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : user ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {formatName(user.name)}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 capitalize">{user.role}</p>

              {user.role === "student" ? (
                // Display only applications for students
                <div>
                  <h2 className="text-xl font-semibold mt-4">Your Applications</h2>
                  {applications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {applications.map((app) => (
                        <div key={app.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                          <p className="font-medium">{app.jobTitle}</p>
                          <p className="text-sm">{app.coverLetter}</p>
                          <p className="text-sm text-gray-600">Status: {app.status}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You have not submitted any applications yet.</p>
                  )}
                </div>
              ) : (
                // Display job postings for employers
                <div>
                  <h2 className="text-xl font-semibold mt-4">Your Job Postings</h2>
                  {jobPostings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {jobPostings.map((job) => (
                        <div key={job.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                          <h3 className="text-lg font-bold">{job.title}</h3>
                          <p>{job.description}</p>
                          <p className="text-sm text-gray-600">Salary: ${job.salary}/hr</p>

                          <div className="mt-3">
                            <h4 className="text-md font-semibold">Applications</h4>
                            {applications[job.id]?.length > 0 ? (
                              <ul className="mt-2 text-left">
                                {applications[job.id].map((app) => (
                                  <li key={app.id} className="border p-2 rounded-md mt-2">
                                    <p className="font-medium">{app.applicantName}</p>
                                    <p className="text-sm">{app.applicantEmail}</p>
                                    <p className="text-sm text-gray-700">{app.coverLetter}</p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">No applications yet.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You have no job postings.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500">User not found</p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
