import { Link, useLocation } from "react-router";
import { ChefHat, Home, Sparkles, Compass, Heart, User } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/generator", label: "Recipe Generator", icon: Sparkles },
    { path: "/explore", label: "Explore Recipes", icon: Compass },
    { path: "/favorites", label: "Favorites", icon: Heart },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-fluid max-w-7xl mx-auto px-6 py-2">
        <Link to="/dashboard" className="navbar-brand flex items-center gap-2">
          <div className="bg-gradient-to-br from-[#432C91] via-[#0D9488] to-[#D97706] p-2 rounded-xl">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl" style={{ fontWeight: 800 }}>OwlCook</span>
        </Link>
          
        <div className="navbar-nav flex items-center gap-2 ms-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
              
            return (
              <Link key={item.path} to={item.path} className="nav-item">
                <Button 
                  className={`nav-link rounded-xl gap-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#432C91] to-[#0D9488] hover:from-[#362470] hover:to-[#0F766E] text-white active' 
                      : 'hover:bg-purple-50'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
