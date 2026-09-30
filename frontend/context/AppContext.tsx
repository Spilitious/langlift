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
  windowSize: {width:number, height:number};
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

  const [windowSize, setWindowSize] = useState({
  width: 0,
  height: 0,
});

useEffect(() => {
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Taille initiale
  handleResize();

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);


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
        windowSize,
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