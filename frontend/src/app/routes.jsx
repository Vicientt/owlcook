import { createBrowserRouter, redirect, Outlet, useLoaderData } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import RecipeGenerator from "./pages/RecipeGenerator";
import RecipeAnswer from "./pages/RecipeAnswer";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import foodService from "./services/food";
import authService from "./services/auth";
import NotFound from "./pages/NotFound";
import {recipes} from "./utils/recipes";

function ProtectedLayout() {
  const user = useLoaderData();
  return <Outlet context={user} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    element: <ProtectedLayout />,
    loader: async () => {
      try {
        const user = await authService.me();
        return user;
      } catch {
        throw redirect("/");
      }
    },
    children: [
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/generator",
        Component: RecipeGenerator,
      },
      {
        path: "/recipe/:id",
        Component: RecipeAnswer,
        loader: async ({ params }) => foodService.getById(params.id),
      },
      {
        path: "/answer",
        Component: RecipeAnswer,
      },
      {
        path: "/explore",
        Component: Explore,
      },
      {
        path: "/explore/:id",
        Component: RecipeAnswer,
        loader: ({params}) => recipes.find(recipe => recipe.id === params.id),
      },
      {
        path: "/favorites",
        Component: Favorites,
        loader: () => foodService.getAll(),
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  }
]);
