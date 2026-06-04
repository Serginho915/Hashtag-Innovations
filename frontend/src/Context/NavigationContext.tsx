'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isHeroTabsVisible: boolean;
  setIsHeroTabsVisible: (visible: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHeroTabsVisible, setIsHeroTabsVisible] = useState(true);

  return (
    <NavigationContext.Provider value={{ isHeroTabsVisible, setIsHeroTabsVisible }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
