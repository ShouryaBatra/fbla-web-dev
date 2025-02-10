import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../config/firebase";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const db = getFirestore(app);

export default function Postings() {
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "postings"));
        const jobs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostings(jobs);
      } catch (error) {
        console.error("Error fetching job postings: ", error);
      }
    };

    fetchPostings();
  }, []);

  return (
    <>
      <main className="flex flex-col min-h-screen bg-cream-white">
        <Navbar />
        <section className="max-w-6xl mx-auto py-16 px-6">
          <h1 className="text-4xl font-bold text-dark-green text-center mb-8">
            Job Postings
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postings.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-semibold text-dark-green">
                  {job.title}
                </h2>
                <p className="text-gray-700 mt-2">{job.description}</p>
                <p className="text-lg font-semibold text-dark-green mt-4">
                  Salary: ${job.salary}
                </p>
                <h3 className="text-lg font-semibold mt-4">
                  Responsibilities:
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  {job.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mt-4">Required Skills:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {job.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
