import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rally from "./pages/Rally";
import RallyWeek from "./pages/RallyWeek";
import RallyDay from "./pages/RallyDay";
import Classes from "./pages/Classes";
import Exclusive from "./pages/Exclusive";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rally" element={<Rally />} />
          <Route path="/rally/:weekSlug" element={<RallyWeek />} />
          <Route path="/rally/:weekSlug/day/:dayNumber" element={<RallyDay />} />
          <Route path="/clases" element={<Classes />} />
          <Route path="/exclusivo" element={<Exclusive />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
