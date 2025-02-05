import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("");

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 "
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
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition">
              Register
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
