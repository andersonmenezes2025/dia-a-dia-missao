
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { lazy, Suspense } from "react";

// Páginas
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateTask = lazy(() => import("./pages/CreateTask"));
const Profile = lazy(() => import("./pages/Profile"));
const ChildrenProfile = lazy(() => import("./pages/ChildrenProfile"));
const Reports = lazy(() => import("./pages/Reports"));
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/criar-tarefa" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
                <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/filhos" element={<PrivateRoute><ChildrenProfile /></PrivateRoute>} />
                <Route path="/relatorios" element={<PrivateRoute><Reports /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
