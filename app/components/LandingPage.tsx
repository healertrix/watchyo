import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 w-screen h-screen bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25"></div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg">
            Empower Your Rankings with RateWise
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 drop-shadow-md">
            Our proprietary algorithm provides accurate ratings with minimal iterations, 
            making the rating process fun and efficient.
          </p>
          <Link href="/rate">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
              Start Rating Now
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 relative z-10">
        <p>&copy; 2024 RateWise. All rights reserved.</p>
      </footer>
    </div>
  );
}
