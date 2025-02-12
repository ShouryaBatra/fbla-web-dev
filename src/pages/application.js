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
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    phone: "",
    skills: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        ...formData,
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
      <main className="max-w-3xl mx-auto py-8 px-6 bg-white shadow-md rounded-lg my-24 min-h-[500px] w-full h-[600px] flex flex-col justify-between">
        <h1 className="text-3xl font-bold text-dark-green mb-0 text-center">
          Apply for {job.title}
        </h1>
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Personal Information
            </h2>
            <p className="text-lg ml-1">Full Name</p>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
            />
            <p className="text-lg ml-1 mt-2">Age</p>
            <input
              type="text"
              name="age"
              placeholder="16"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
            />
            <p className="text-lg ml-1 mt-2">Address</p>
            <input
              type="text"
              name="address"
              placeholder="1234 Example Ave, City, State, Zipcode"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
            />
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-lg ml-1">Email</p>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
            />
            <p className="text-lg ml-1 mt-2">Phone Number</p>
            <input
              type="text"
              name="phone"
              placeholder="624-1234-3241"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Other</h2>
            <p className="text-lg ml-1">Skills</p>
            <input
              type="text"
              name="skills"
              placeholder="Top 5 skills..."
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
            />

            {job.questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p className="text-lg ml-1 mt-2">{question}</p>
                <input
                  type="text"
                  placeholder="Your answer"
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full h-14 text-md px-4 py-2 mt-2 mb-2 border rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Back
            </button>
          )}
          {step}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-teal-700 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitApplication}
              className="px-6 py-3 bg-teal-700 text-white rounded-lg"
            >
              Submit Application
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
