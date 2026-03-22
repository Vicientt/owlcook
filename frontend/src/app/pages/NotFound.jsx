import { Link } from "react-router";
import { Home, ChefHat, Compass } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#FEF7ED] to-[#F0FDFA]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="bg-white rounded-3xl p-16 shadow-lg text-center max-w-xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#432C91] via-[#0D9488] to-[#D97706] mb-6">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl mb-2" style={{ fontWeight: 800, color: "#432C91" }}>
              404
            </h1>
            <h2 className="text-2xl mb-4" style={{ fontWeight: 700 }}>
              Page not found
            </h2>
            <p className="text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <button
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#432C91] via-[#0D9488] to-[#D97706] hover:from-[#362470] hover:via-[#0F766E] hover:to-[#B45309] text-white transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </button>
              </Link>
              <Link to="/explore">
                <button
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <Compass className="w-4 h-4" />
                  Explore Recipes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
