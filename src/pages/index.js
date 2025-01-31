import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
   <main>
    <Navbar />
    <div className="text-4xl mb-96">
      <h1>Home</h1>
    </div>
    <Footer />
   </main>
  );
}
