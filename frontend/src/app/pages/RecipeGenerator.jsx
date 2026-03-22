import { useState } from "react";
import { useNavigate } from "react-router";
import { DollarSign, Users, Clock, Leaf, Globe, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import generatorService from "../services/generator"

export default function RecipeGenerator() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(10);
  const [portion, setPortion] = useState(2);
  const [cookingTime, setCookingTime] = useState(30);
  const [selectedDiet, setSelectedDiet] = useState("any");
  const [selectedCuisine, setSelectedCuisine] = useState("any");
  const [customDiet, setCustomDiet] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dietOptions = [
    { value: "any", label: "None", emoji: "🍽️" },
    { value: "vegetarian", label: "Vegetarian", emoji: "🥗" },
    { value: "vegan", label: "Vegan", emoji: "🌱" },
    { value: "glutenfree", label: "Gluten-Free", emoji: "🌾" },
    { value: "other", label: "Other", emoji: "✏️" },
  ];

  const cuisineOptions = [
    { value: "any", label: "Any", emoji: "🌍" },
    { value: "asian", label: "Asian", emoji: "🍜" },
    { value: "italian", label: "Italian", emoji: "🍝" },
    { value: "mexican", label: "Mexican", emoji: "🌮" },
    { value: "other", label: "Other", emoji: "✏️" },
  ];
  
  // Handle when click generate content
  const handleGenerate = async () => {
    // Add blur loading when wait for GPT
    setIsLoading(true);
    try {
      const requestObject = {
        budget: budget.toString(), portion: portion.toString(), cookingTime: cookingTime.toString(),
        diet: customDiet === "" ? selectedDiet : customDiet,
        cuisine: customCuisine === "" ? selectedCuisine : customCuisine
      };

      const response_post = await generatorService.add(requestObject);
      console.log(response_post)
      navigate(`/answer`, {
        state: { from: "generator", recipe: response_post }
      });
    } catch (err) {
      console.error("Generate failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#F0FDFA] to-[#FFFBEB] relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#EDE9F8] border-t-[#432C91]" />
            <p className="text-gray-600" style={{ fontWeight: 600 }}>Loading</p>
          </div>
        </div>
      )}
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-6 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 800 }}>AI Recipe Generator ✨</h1>
          <p className="text-gray-600">Tell us your preferences and we'll create the perfect recipe</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          {/* Budget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0D9488]">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-[#0D9488]" />
                </div>
                <label style={{ fontWeight: 600 }}>Budget</label>
              </div>
              <div className="bg-teal-50 px-3 py-1 rounded-lg">
                <span className="text-[#0D9488]" style={{ fontWeight: 700 }}>${budget}</span>
              </div>
            </div>
            <Slider value={budget} onChange={setBudget} max={50} min={5} step={1} />
          </div>

          {/* Servings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#059669]">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Users className="w-4 h-4 text-[#059669]" />
                </div>
                <label style={{ fontWeight: 600 }}>Servings</label>
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-lg">
                <span className="text-[#059669]" style={{ fontWeight: 700 }}>{portion} people</span>
              </div>
            </div>
            <Slider value={portion} onChange={setPortion} max={8} min={1} step={1} />
          </div>

          {/* Cooking Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#D97706]">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-[#D97706]" />
                </div>
                <label style={{ fontWeight: 600 }}>Cooking Time</label>
              </div>
              <div className="bg-amber-50 px-3 py-1 rounded-lg">
                <span className="text-[#D97706]" style={{ fontWeight: 700 }}>{cookingTime} min</span>
              </div>
            </div>
            <Slider value={cookingTime} onChange={setCookingTime} max={120} min={10} step={5} />
          </div>

          {/* Diet Preference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#E11D48]">
              <div className="bg-rose-100 p-2 rounded-lg">
                <Leaf className="w-4 h-4 text-[#E11D48]" />
              </div>
              <label style={{ fontWeight: 600 }}>Diet Preference</label>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {dietOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedDiet(option.value);
                    if (option.value !== "other") setCustomDiet("");
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedDiet === option.value
                      ? 'border-[#E11D48] bg-rose-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs" style={{ fontWeight: 600 }}>{option.label}</div>
                </button>
              ))}
            </div>
            {selectedDiet === "other" && (
              <Input
                placeholder="Enter your diet preference..."
                value={customDiet}
                onChange={(e) => setCustomDiet(e.target.value)}
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
              />
            )}
          </div>

          {/* Cuisine Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#432C91]">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Globe className="w-4 h-4 text-[#432C91]" />
              </div>
              <label style={{ fontWeight: 600 }}>Cuisine Type</label>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {cuisineOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedCuisine(option.value);
                    if (option.value !== "other") setCustomCuisine("");
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedCuisine === option.value
                      ? 'border-[#432C91] bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs" style={{ fontWeight: 600 }}>{option.label}</div>
                </button>
              ))}
            </div>
            {selectedCuisine === "other" && (
              <Input
                placeholder="Enter your cuisine type..."
                value={customCuisine}
                onChange={(e) => setCustomCuisine(e.target.value)}
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
              />
            )}
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#432C91] via-[#0D9488] to-[#D97706] hover:from-[#362470] hover:via-[#0F766E] hover:to-[#B45309] text-white disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ fontWeight: 700 }}
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Generate Recipe with AI
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
