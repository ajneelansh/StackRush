import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProgressContextType {
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [showProgress, setShowProgress] = useState(false);
  return (
    <ProgressContext.Provider value={{ showProgress, setShowProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}; 