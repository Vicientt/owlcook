import { Link, useLoaderData } from "react-router";
import { Clock, DollarSign, Users, Heart, Gauge, Flame } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import foodService from "../services/food"

export default function Favorites() {
  const favoriteRecipes = useLoaderData();
  
  // const favoriteRecipes = await foodService.getAll()
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#F0FDFA] to-[#FFFBEB]">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 800 }}>Favorite Recipes ❤️</h1>
          <p className="text-gray-600">Your saved recipes for quick access</p>
        </div>

        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg flex-1" style={{ fontWeight: 700 }}>{recipe.name}</h3>
                    <button 
                      onClick={(e) => e.preventDefault()}
                      className="w-10 h-10 rounded-full bg-[#F8F6FC] flex items-center justify-center hover:bg-[#E8E4F5] transition-all flex-shrink-0"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{recipe.cost}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  {(recipe.difficulty || recipe.nutritions?.calories) && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {recipe.difficulty && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-700">
                          <Gauge className="w-4 h-4" />
                          <span style={{ fontWeight: 600 }}>{recipe.difficulty}</span>
                        </div>
                      )}
                      {recipe.nutritions?.calories && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700">
                          <Flame className="w-4 h-4" />
                          <span style={{ fontWeight: 600 }}>{recipe.nutritions.calories} cal</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2" style={{ fontWeight: 700 }}>No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start saving recipes you love!</p>
              <Link to="/explore">
                <button className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#432C91] via-[#0D9488] to-[#D97706] hover:from-[#362470] hover:via-[#0F766E] hover:to-[#B45309] text-white" style={{ fontWeight: 700 }}>
                  Explore Recipes
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
