import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../config/firebase"; // Ensure the correct path to Firebase config
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const formatName = (fullName) => {
    if (!fullName) 
			return "";
    const nameParts = fullName.trim().split(" ");
    return nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0]}.` : nameParts[0];
  };

  return (
    <main className="flex flex-col min-h-screen bg-cream-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : user ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {formatName(user.name)}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </>
          ) : (
            <p className="text-red-500">User not found</p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
