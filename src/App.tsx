/** App — root component with BrowserRouter, Navbar, routes, and toast provider */
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Dashboard } from "@/pages/Dashboard";
import { AddTool } from "@/pages/AddTool";
import { requestNotificationPermission } from "@/lib/notifications";
import { seedDemoData } from "@/lib/seedData";
import { Catalog } from "@/pages/Catalog";
import { Import } from "@/pages/Import";
import { Landing } from "@/pages/Landing";
import { AITracker } from "@/pages/AITracker";
import { Gmail } from "@/pages/Gmail";

export default function App() {
  // Seed demo data on first load (dev only, no-op if tools already exist)
  useEffect(() => {
    seedDemoData().catch(console.error);
  }, []);

  // Request notification permission after 3 seconds to avoid disrupting first visit
  useEffect(() => {
    const timer = setTimeout(async () => {
      await requestNotificationPermission();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(16, 24, 25, 0.95)",
            border: "1px solid rgba(34, 211, 238, 0.20)",
            color: "#f3fbfb",
            borderRadius: 12,
            backdropFilter: "blur(16px)",
          },
        }}
      />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  return (
    <div className="page-shell">
      <div className="page-backdrop" />
      {isAppRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/add" element={<AddTool />} />
          <Route path="/app/catalog" element={<Catalog />} />
          <Route path="/app/import" element={<Import />} />
          <Route path="/app/ai" element={<AITracker />} />
          <Route path="/app/gmail" element={<Gmail />} />
        </Routes>
      </main>
    </div>
  );
}
