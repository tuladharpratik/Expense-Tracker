'use client';
import { Category } from '@prisma/client';
import React from 'react';

export type CategoriesContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoriesContext = React.createContext<CategoriesContextType | undefined>(undefined);

export default function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    fetch('/api/model/category/findMany')
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch((err) => console.log(err));
  }, []);

  return <CategoriesContext.Provider value={{ categories, setCategories }}>{children}</CategoriesContext.Provider>;
}

export const useCategories = () => {
  const context = React.useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
