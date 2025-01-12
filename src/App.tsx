import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import EditBlogPage from "./pages/EditBlogPage";
import ArticlePage from "./pages/ArticlePage";
import GamesPage from "./pages/GamesPage";
import TechPage from "./pages/TechPage";
import StocksPage from "./pages/StocksPage";
import EntertainmentPage from "./pages/EntertainmentPage";
import GadgetsPage from "./pages/GadgetsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import ComparisonPage from "./pages/ComparisonPage";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/tech" element={<TechPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/gadgets" element={<GadgetsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/product-reviews/:id" element={<ProductReviewsPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/edit/:id" element={<EditBlogPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;