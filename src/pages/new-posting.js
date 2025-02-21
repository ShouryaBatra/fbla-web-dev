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
  const [selectedJob, setSelectedJob] = useState(null);

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
        responsibilities: responsibilities.filter((item) => item.trim() !== ""),
        skills: skills.filter((item) => item.trim() !== ""),
        questions: questions.filter((item) => item.trim() !== ""),
        approved: false,
        userId: user.uid,
      });
      window.location.href = "/profile";
      // Reset form fields
      setTitle("");
      setDescription("");
      setSalary("");
      setResponsibilities([""]);
      setSkills([""]);
      setQuestions([""]);
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const handleRemoveResponsibility = (index) => {
    const newResponsibilities = responsibilities.filter((_, i) => i !== index);
    setResponsibilities(newResponsibilities);
  };

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <main className="flex flex-col justify-center min-h-screen bg-cream-white">
      <div className="mb-5">
        <Navbar />
      </div>
      <div className="flex justify-center items-center flex-grow">
        <section className="w-1/3 max-w-4xl py-10 px-6">
          {/* Job Form */}
          <div className=" shadow-lg rounded-lg p-6 w-full bg-white mt-4">
            <h2 className="text-3xl font-bold text-dark-green mb-6 text-center">
              Post a Job
            </h2>
            <form className="space-y-4 " onSubmit={handleAddPosting}>
              <input
                type="text"
                placeholder="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                required
              />
              <textarea
                placeholder="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                required
              />
              <input
                type="number"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                required
              />

              {/* Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                {responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Responsibility"
                      value={responsibility}
                      onChange={(e) => {
                        const newResponsibilities = [...responsibilities];
                        newResponsibilities[index] = e.target.value;
                        setResponsibilities(newResponsibilities);
                      }}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(index)}
                        className="bg-teal-600 text-white px-3 rounded-lg hover:bg-teal-500 ease-linear duration-150"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 ease-linear duration-150"
                >
                  Add Responsibility
                </button>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Skill"
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index] = e.target.value;
                        setSkills(newSkills);
                      }}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 "
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="bg-teal-600 text-white px-3 rounded-lg hover:bg-teal-500 ease-linear duration-150"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 ease-linear duration-150"
                >
                  Add Skill
                </button>
              </div>

              {/* Questions */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Questions</h3>
                {questions.map((question, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Question"
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="bg-teal-600 text-white px-3 rounded-lg hover:bg-teal-500 ease-linear duration-150"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 ease-linear duration-150"
                >
                  Add Question
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-12 bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 ease-linear duration-150 "
              >
                Post Job
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
