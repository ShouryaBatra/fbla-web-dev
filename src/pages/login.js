import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../config/firebase";
import { useState } from "react";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/"; // Redirect to home on success
    } catch (error) {
      alert(error.message); // Show error if login fails
    }
  };
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center mt-4">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <a href="#" className="text-sm text-teal-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition">
              Login
            </button>
          </form>
          <p className="text-center text-gray-700 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
