import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing";
import NewNote from "./pages/notes/NewNote";
import ViewNote from "./pages/notes/ViewNote";
import Profile from "./pages/Profile";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => {
  console.log('🔄 App rendering, mounting Toaster');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route
              path="/notes"
              element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              }
            />
            <Route
              path="/notes/new"
              element={
                <AuthGuard>
                  <NewNote />
                </AuthGuard>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <AuthGuard>
                  <ViewNote />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            {/* Catch any other routes and redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;