import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const db = getFirestore(app);
const auth = getAuth(app);

export default function Application() {
  const router = useRouter();
  const { jobId } = router.query;

  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        const jobRef = doc(db, "postings", jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
          setAnswers(new Array(jobSnap.data().questions.length).fill(""));
        } else {
          console.error("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const submitApplication = async () => {
    if (!user || !job) return;

    try {
      await addDoc(collection(db, "applications"), {
        jobId: job.id,
        userId: user.uid,
        answers: answers.reduce((acc, answer, index) => {
          acc[index] = answer;
          return acc;
        }, {}),
        appliedAt: serverTimestamp(),
      });

      alert("Application submitted successfully!");
      router.push("/postings");
    } catch (error) {
      console.error("Error submitting application: ", error);
      alert("Failed to submit application.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading job details...</p>;
  }

  if (!job) {
    return <p className="text-center mt-10 text-lg">Job not found.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream-white">
      <Navbar />
      <main className="max-w-3xl mx-auto py-16 px-6 bg-white shadow-md rounded-lg my-24">
        <h1 className="text-3xl font-bold text-dark-green mb-6">
          Apply for {job.title}
        </h1>

        <form className="space-y-6">
          {job.questions.map((question, index) => (
            <div key={index}>
              <label className="text-gray-700 font-semibold">{question}</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}

          <button
            type="button"
            className="mt-6 px-6 py-3 bg-teal-700 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 transition"
            onClick={submitApplication}
          >
            Submit Application
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
