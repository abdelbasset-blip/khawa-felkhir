import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminTopbar } from "../components/admin/AdminTopbar";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-x-hidden font-sans">
      {/* 1. Sidebar Desktop */}
      <div className="hidden md:block shrink-0">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* 2. Drawer Mobile (Responsive Sheet avec Framer Motion) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop sombre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Contenu de la Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-72 max-w-[85vw] h-full bg-card z-50 shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute right-3 top-4 p-1.5 rounded-lg bg-muted text-foreground hover:bg-accent transition-colors z-50"
                aria-label="Fermer le menu"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="h-full">
                <AdminSidebar
                  isCollapsed={false}
                  setIsCollapsed={() => {}}
                  onNavigateMobile={() => setIsMobileOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Zone principale de contenu */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopbar onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
