import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
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

export default function NewPosting() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [responsibilities, setResponsibilities] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [questions, setQuestions] = useState([""]);
  const [user, setUser] = useState(null);
  const [userPostings, setUserPostings] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchPostings = async () => {
        const q = query(
          collection(db, "postings"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        setUserPostings(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      };
      fetchPostings();
    }
  }, [user]);

  const handleAddPosting = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post a job.");
    try {
      await addDoc(collection(db, "postings"), {
        title,
        description,
        salary: Number(salary),
        responsibilities,
        skills,
        questions,
        approved: false,
        userId: user.uid,
      });
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const handleChange = (setter, index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAddField = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Post a Job
        </h2>
        <form className="space-y-4" onSubmit={handleAddPosting}>
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <div>
            <label className="block font-medium">Responsibilities</label>
            {responsibilities.map((resp, index) => (
              <input
                key={index}
                type="text"
                value={resp}
                onChange={(e) =>
                  handleChange(setResponsibilities, index, e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg mt-2"
                required
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddField(setResponsibilities)}
              className="text-teal-600 mt-2"
            >
              + Add Responsibility
            </button>
          </div>
          <div>
            <label className="block font-medium">Skills</label>
            {skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleChange(setSkills, index, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mt-2"
                required
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddField(setSkills)}
              className="text-teal-600 mt-2"
            >
              + Add Skill
            </button>
          </div>
          <div>
            <label className="block font-medium">Application Questions</label>
            {questions.map((q, index) => (
              <input
                key={index}
                type="text"
                value={q}
                onChange={(e) =>
                  handleChange(setQuestions, index, e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg mt-2"
                required
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddField(setQuestions)}
              className="text-teal-600 mt-2"
            >
              + Add Question
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800"
          >
            Post Job
          </button>
        </form>
      </div>
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Job Postings
        </h2>
        {userPostings.length > 0 ? (
          <div className="space-y-4">
            {userPostings.map((post) => (
              <div key={post.id} className="bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-gray-600">
                  {post.description.substring(0, 100)}...
                </p>
                <p
                  className={`mt-2 font-medium ${
                    post.approved ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {post.approved ? "Approved" : "Pending Approval"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No job postings yet.</p>
        )}
      </div>
      <Footer />
    </main>
  );
}
