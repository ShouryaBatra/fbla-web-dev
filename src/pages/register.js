import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../config/firebase";
import Link from "next/link";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Register() {
  const [role, setRole] = useState("");
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        role,
        name,
        email,
      };

      if (role === "student") {
        userData.grade = grade;
      }

      // Initialize postings as an empty array for employers
      if (role === "employer" || role === "admin") {
        userData.postings = [];
      }

      await setDoc(doc(db, "users", user.uid), userData);
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center my-24">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-700 font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              >
                <option value="" disabled hidden>
                  Choose a role
                </option>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role === "student" && (
              <div>
                <label className="block text-gray-700 font-medium">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                >
                  <option value="" disabled hidden>
                    Choose your grade
                  </option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-700 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
