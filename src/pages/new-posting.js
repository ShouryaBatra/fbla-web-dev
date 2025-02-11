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
      alert("Job posted successfully!");
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
    <main className="flex flex-col min-h-screen bg-gray-100">
      <div className="mb-5">
        <Navbar />
      </div>
      <section className="max-w-7xl mx-auto py-10 px-6 flex gap-6">
        {/* Job Form */}
        <div className="w-2/5 bg-white shadow-lg rounded-lg p-6">
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
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(index)}
                      className="bg-teal-700 text-white px-3 rounded-lg"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="bg-teal-700 text-white px-4 py-2 rounded-lg"
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
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="bg-teal-700 text-white px-3 rounded-lg"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-teal-700 text-white px-4 py-2 rounded-lg"
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
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="bg-teal-700 text-white px-3 rounded-lg"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-teal-700 text-white px-4 py-2 rounded-lg"
              >
                Add Question
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

        {/* Job Listings */}
        <div className="w-3/5">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Job Postings
          </h2>
          <div className="flex gap-6">
            <div className="w-1/2 space-y-4 overflow-y-auto max-h-[70vh] p-6">
              {userPostings.map((post) => (
                <div
                  key={post.id}
                  className={`bg-white p-4 shadow-md rounded-lg border cursor-pointer transition-transform hover:scale-105 ${
                    selectedJob?.id === post.id ? "border-dark-green" : ""
                  }`}
                  onClick={() => setSelectedJob(post)}
                >
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
            {/* Side Panel for Selected Job */}
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[70vh]">
              {selectedJob ? (
                <>
                  <h2 className="text-2xl font-bold text-dark-green">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-700 mt-4">
                    {selectedJob.description}
                  </p>
                  <p className="text-lg font-semibold text-dark-green mt-4">
                    Salary: ${selectedJob.salary}
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
                  {/* Questions Section */}
                  <h3 className="text-lg font-semibold mt-4">Questions:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedJob.questions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-gray-500 text-lg text-center">
                  Select a job to view details
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
