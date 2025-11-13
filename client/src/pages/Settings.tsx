import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "../context/UserContext";
import { BurgerMenuIcon } from "../components/utils/Icons";
import Meta from "../components/utils/Meta";

import EditProfileTab from "../components/settingsPage/EditProfileTab";
import ThirdPartyAccountsTab from "../components/settingsPage/ThirdPartyAccountsTab";
import LogoutSection from "../components/settingsPage/LogoutSection";

type TabType = "profile" | "follow" | "lists" | "groups" | "settings" | "accounts" | "logout";

interface MenuItem {
  id: TabType;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
}

const Settings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUserContext();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const menuItems: MenuItem[] = [
    { id: "profile", label: "Profil", icon: "👤", component: EditProfileTab },
    { id: "accounts", label: "Comptes tiers", icon: "🔗", component: ThirdPartyAccountsTab },
    { id: "logout", label: "Déconnexion", icon: "🚪", component: LogoutSection },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as TabType;
    if (tab && menuItems.find((item) => item.id === tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("profile");
      navigate("/settings?tab=profile", { replace: true });
    }
  }, [location.search, navigate]);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    navigate(`/settings?tab=${tabId}`);
    setIsSidebarOpen(false);
  };

  const ActiveComponent = menuItems.find((item) => item.id === activeTab)?.component || EditProfileTab;
  const activeLabel = menuItems.find((item) => item.id === activeTab)?.label || "Profil";

  const onTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX ?? 0;
    if (!isSidebarOpen && x > 32) return;
    touchStartX.current = x;
    touchCurrentX.current = x;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchCurrentX.current = e.touches[0]?.clientX ?? 0;
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null || touchCurrentX.current == null) return;
    const delta = (touchCurrentX.current as number) - (touchStartX.current as number);
    if (!isSidebarOpen && touchStartX.current <= 32 && delta > 50) {
      setIsSidebarOpen(true);
    }
    if (isSidebarOpen && delta < -50) {
      setIsSidebarOpen(false);
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };

    if (isSidebarOpen) {
      document.addEventListener("keydown", onKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-lg">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Meta
          title="Accès non autorisé - SoundWave"
          description="Vous n'avez pas les droits nécessaires pour accéder à cette page."
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès restreint</h2>
              <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
              <button onClick={() => navigate("/auth")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta
        title="Paramètres - SoundWave"
        description="Gérez votre compte et vos préférences sur SoundWave. Modifiez votre profil, gérez vos abonnements, listes et plus encore."
      />
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex">
              <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-800 hidden md:block">
                <div className="p-6 border-b border-slate-700">
                  <h1 className="text-2xl font-bold mb-2">Paramètres</h1>
                  <p className="text-sm italic">Gérez votre compte et vos préférences</p>
                </div>
                <nav className="py-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`hover:cursor-pointer w-full flex items-center px-6 py-4 text-left transition-all duration-200 relative group ${
                        activeTab === item.id
                          ? "bg-primaryBlue text-white shadow-lg transform scale-[1.02]"
                          : "text-slate-500 hover:text-white hover:bg-primaryBlue"
                      }`}
                    >
                      {activeTab === item.id && <div className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-full"></div>}
                      <span className="text-xl mr-4 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      <div
                        className={`absolute right-4 transition-opacity duration-200 ${
                          activeTab === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="md:hidden fixed inset-0 bg-black/40 z-30"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <motion.div
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      id="settings-drawer"
                      ref={drawerRef}
                      className="md:hidden fixed inset-y-0 left-0 w-72 bg-slate-50 z-40"
                      role="navigation"
                      aria-label="Menu des paramètres"
                    >
                      <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                        <div className="flex flex-col">
                          <h2 className="text-xl font-semibold">Paramètres</h2>
                          <p className="text-sm italic">Gérez votre compte et vos préférences</p>
                        </div>
                        <button
                          aria-label="Fermer le menu"
                          className="p-2 rounded hover:bg-slate-800"
                          type="button"
                          onClick={() => setIsSidebarOpen(false)}
                          ref={closeBtnRef}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path
                              fillRule="evenodd"
                              d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 011.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <nav className="py-2">
                        {menuItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center px-5 py-4 text-left transition-all duration-200 relative ${
                              activeTab === item.id ? "bg-sky-500/20" : "hover:bg-slate-800"
                            }`}
                          >
                            <span className="text-xl mr-4">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </button>
                        ))}
                      </nav>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div className="flex-1 bg-gray-50">
                <div className="md:hidden sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3">
                  <button
                    aria-label="Ouvrir le menu"
                    className="p-2 rounded-md border bg-white text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-controls="settings-drawer"
                    aria-expanded={isSidebarOpen}
                    ref={burgerBtnRef}
                  >
                    <BurgerMenuIcon />
                  </button>
                  <h2 className="text-lg font-semibold text-slate-800">{activeLabel}</h2>
                </div>

                <div className="h-full overflow-y-auto">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="animate-fadeIn"
                  >
                    <ActiveComponent />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
