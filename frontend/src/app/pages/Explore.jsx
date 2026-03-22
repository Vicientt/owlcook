import { useNavigate } from "react-router";
import { Clock, DollarSign, Users, Heart, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Input } from "../components/ui/input";
import {recipes} from "../utils/recipes"
import { useState } from 'react'

export default function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('')

  // filter for search engine
  const recipes_filter = recipes.filter(dish => dish.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#F0FDFA] to-[#FFFBEB]">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 800 }}>Explore Recipes</h1>
          <p className="text-gray-600">Browse through our collection of student-friendly recipes</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search recipes..."
              className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
              value = {search}
              onChange = {(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-4 gap-6">
          {recipes_filter.map((recipe, idx) => {
            const badgeGradients = [
              'from-[#432C91] to-[#0D9488]',
              'from-[#0D9488] to-[#059669]',
              'from-[#D97706] to-[#E11D48]',
              'from-[#E11D48] to-[#432C91]',
              'from-[#059669] to-[#0D9488]',
            ];
            return (
            <Button
              key={recipe.id}
              onClick={() => navigate(`/explore/${recipe.id}`, { state: { from: "explore" } })}
              className="w-full block text-left p-0 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer border-0 transition-all"
            >
              <div className="w-full">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`bg-gradient-to-r ${badgeGradients[idx % 5]} text-white text-xs px-2 py-1 rounded-lg`} style={{ fontWeight: 600 }}>
                      {recipe.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button type="button" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base mb-2" style={{ fontWeight: 700 }}>{recipe.name}</h3>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{recipe.cost}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
