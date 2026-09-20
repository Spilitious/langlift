"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type AppScreen =
  | "menu"
  | "game"
  | "loadGamePage";

type AppContextType = {
  screen: AppScreen;
  setScreen: (
    screen: AppScreen
  ) => void;
};

const AppContext =
  createContext<AppContextType | null>(null);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
 const [screen, setScreenState] =
  useState<AppScreen>("menu");

useEffect(() => {
  const savedScreen =
    localStorage.getItem("screen") as AppScreen | null;

  if (savedScreen) {
    setScreenState(savedScreen);
  }
}, []);

const setScreen = (screen: AppScreen) => {
  setScreenState(screen);

  localStorage.setItem(
    "screen",
    screen
  );
};
  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}