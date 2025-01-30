import Image from "next/image";
import Navbar from "@/components/navbar";


export default function Home() {
  return (
   <main>
    <Navbar />
    <div className="text-4xl">
      <a href="/really-important-page">
        Click Me!
      </a>
    </div>

   </main>
  );
}
