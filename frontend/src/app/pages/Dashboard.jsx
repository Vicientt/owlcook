import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#FEF7ED] to-[#F0FDFA]">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-[#432C91] via-[#5A3DA3] to-[#0D9488] rounded-3xl p-20 mb-8 text-white relative overflow-hidden min-h-[400px] flex items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-rose-400/15 rounded-full"></div>
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-6xl mb-6" style={{ fontWeight: 800 }}>Welcome to OwlCook! 👋</h1>
            <p className="text-2xl text-white/90 mb-8">
              Your AI-powered recipe companion for college students. Generate delicious meals that match your budget, 
              dietary preferences, and cooking time. Let's make cooking easy and fun!
            </p>
            <Link to="/generator">
              <Button 
                className="h-16 px-10 rounded-xl bg-white text-[#432C91] hover:bg-gray-100 text-xl"
                style={{ fontWeight: 700 }}
              >
                Generate Your First Recipe →
              </Button>
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
