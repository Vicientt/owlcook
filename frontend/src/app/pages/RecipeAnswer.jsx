import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, useLoaderData } from "react-router";
import { Clock, DollarSign, Users, Heart, RotateCw, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import foodService from "../services/food"

export default function RecipeAnswer() {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = useParams()
  const [isSaved, setIsSaved] = useState(id ? true : false);

  const isFromGenerator = location.state?.from === "generator";
  const isFromExplore = location.state?.from === "explore";
  const recipe = id ? useLoaderData() : location.state?.recipe
  
  console.log(recipe)

  // Handle save or not save recipe
  const handleSaveRecipe = async () => {
    if(isSaved === true){
      if(window.confirm('Do you want to delete this recipe?')){
          await foodService.remove(id)
          navigate('/favorites')
      }
    }
    else{
      if(window.confirm('Do you want to save this recipe?')){
          const response = await foodService.create(recipe)
          navigate(`/recipe/${response.id}`)
          setIsSaved(true)
      }
    }
  }

  // Handle if user directly access a strange link
  useEffect(() => {
    if(!recipe) {
      navigate("/generator");
    }
  }, [recipe, navigate])

  if(!recipe) {
    return null
  }
  
  const handleRegenerate = () => {
    navigate("/generator");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#F0FDFA] to-[#FFFBEB]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            {isFromGenerator ? (
              <h1 className="text-2xl" style={{ fontWeight: 800 }}>Your Generated Recipe</h1>
            ) : (
              <Button
                onClick={() => navigate(-1)}
                className="rounded-xl gap-2 bg-transparent hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>
          {!isFromExplore && (
          <div className="flex gap-3">
            <Button
              onClick={handleSaveRecipe}
              className={`h-10 px-4 rounded-xl gap-2 ${
                isSaved 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
              }`}
              style={{ fontWeight: 600 }}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              {isSaved ? 'Delete' : 'Save'}
            </Button>
            {isFromGenerator && (
              <Button
                onClick={handleRegenerate}
                className="h-10 px-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 gap-2"
                style={{ fontWeight: 600 }}
              >
                <RotateCw className="w-4 h-4" />
                Regenerate
              </Button>
            )}
          </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Ingredients - Left Side */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-3xl mb-6 bg-gradient-to-r from-[#432C91] via-[#0D9488] to-[#D97706] bg-clip-text text-transparent" style={{ fontWeight: 800 }}>Ingredients</h3>
              <div className="space-y-4 mb-6">
                {recipe.ingredients.map((ingredient, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-[#F8F6FC] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-lg text-gray-900" style={{ fontWeight: 800 }}>
                        {ingredient.name}
                      </div>
                      <div className="text-base text-gray-600 mt-1">{ingredient.amount}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buy buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <p className="text-base text-gray-600 mb-3" style={{ fontWeight: 800 }}>🛒 Get ingredients:</p>
                
                <a
                  href={`https://www.walmart.com/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="w-full h-10 rounded-xl bg-[#0071DC] hover:bg-[#0060B9] text-white text-sm"
                    style={{ fontWeight: 700 }}
                  >
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    Walmart
                  </Button>
                </a>
                
                <a
                  href={`https://www.kroger.com/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="w-full h-10 rounded-xl bg-[#00457C] hover:bg-[#003460] text-white text-sm"
                    style={{ fontWeight: 700 }}
                  >
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    Kroger
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="col-span-2 space-y-6">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-3xl mb-2" style={{ fontWeight: 800 }}>{recipe.name}</h2>
                <p className="text-gray-600">{recipe.description}</p>
              </div>

              {/* Stats */}
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl bg-amber-50">
                  <Clock className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Time</div>
                  <div className="text-sm" style={{ fontWeight: 700 }}>{recipe.time}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-teal-50">
                  <DollarSign className="w-5 h-5 text-[#0D9488] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Cost</div>
                  <div className="text-sm" style={{ fontWeight: 700 }}>{recipe.cost}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50">
                  <Users className="w-5 h-5 text-[#5A3DA3] mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Servings</div>
                  <div className="text-sm" style={{ fontWeight: 700 }}>{recipe.servings}</div>
                </div>
              </div>
            </div>

            {/* Cooking Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl mb-4" style={{ fontWeight: 800 }}>Cooking Steps</h3>
              <div className="space-y-4">
                {recipe.steps.map((step, index) => {
                  const stepColors = [
                    'bg-gradient-to-br from-[#432C91] to-[#5A3DA3]',
                    'bg-gradient-to-br from-[#0D9488] to-[#14B8A6]',
                    'bg-gradient-to-br from-[#D97706] to-[#F59E0B]',
                    'bg-gradient-to-br from-[#E11D48] to-[#F43F5E]',
                    'bg-gradient-to-br from-[#059669] to-[#10B981]',
                  ];
                  return (
                  <div key={index} className="flex gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${stepColors[index % 5]} flex items-center justify-center text-white text-sm`} style={{ fontWeight: 700 }}>
                      {index + 1}
                    </div>
                    <p className="flex-1 pt-1 text-gray-700">{step}</p>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl mb-4" style={{ fontWeight: 800 }}>Nutrition Information</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                  <div className="text-2xl mb-1" style={{ fontWeight: 800, color: '#D97706' }}>{recipe.nutritions.calories}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <div className="text-2xl mb-1" style={{ fontWeight: 800, color: '#059669' }}>{recipe.nutritions.protein}</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="bg-teal-50 rounded-xl p-3 text-center border border-teal-100">
                  <div className="text-2xl mb-1" style={{ fontWeight: 800, color: '#0D9488' }}>{recipe.nutritions.carbs}</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-100">
                  <div className="text-2xl mb-1" style={{ fontWeight: 800, color: '#E11D48' }}>{recipe.nutritions.fat}</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
