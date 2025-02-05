import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Login() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your email"
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
        </div>
      </div>
      <Footer />
    </main>
  );
}
