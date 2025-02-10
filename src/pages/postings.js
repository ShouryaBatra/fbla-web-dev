import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Postings() {
    return (
      <>
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="text-4xl mt-12">Job postings page</div>
      </main>
      <Footer/>
     </>
    );
  }
  