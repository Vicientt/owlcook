import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes.jsx";
import foodService from "./services/food";

export default function App() {
  useEffect(() => {
    const stored = localStorage.getItem("UserInformation");
    if (stored) {
      try {
        const userInfo = JSON.parse(stored);
        if (userInfo.token) {
          foodService.setToken(userInfo.token);
        }
      } catch (e) {
        console.error("Failed to parse UserInformation", e);
      }
    }
  }, []);

  return <RouterProvider router={router} />;
}
