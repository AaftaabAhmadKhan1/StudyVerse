'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as defaultProducts, Product } from '@/data/products';
import { SiteConfig, getSiteConfig, saveSiteConfig, defaultSiteConfig } from '@/data/siteConfig';

interface AdminContextType {
  products: Product[];
  siteConfig: SiteConfig;
  isAuthenticated: boolean;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
  login: (password: string) => boolean;
  logout: () => void;
  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin password (in production, this should be handled server-side)
const ADMIN_PASSWORD = 'hipparchus2026';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true);
    
    // Check authentication
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Load site config
    const config = getSiteConfig();
    setSiteConfig(config);

    // Load products with migration check
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        // Check if products need migration
        if (parsed.length > 0) {
          const firstId = parsed[0].id;
          // Check if IDs are numeric (old format) or have PROD- prefix
          if (typeof firstId === 'number' || (typeof firstId === 'string' && firstId.startsWith('PROD-'))) {
            // Old format detected - migrate to new format
            console.log('Migrating products to new ID format (removing PROD- prefix)...');
            localStorage.setItem('products', JSON.stringify(defaultProducts));
            setProducts(defaultProducts);
          } else {
            setProducts(parsed);
          }
        } else {
          setProducts(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // On error, use default products
      setProducts(defaultProducts);
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, mounted]);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => {
      // Generate unique long random string ID
      const generateId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segments = [];
        // Generate format: XXXX-XXXX-XXXX-XXXX-XXXX
        for (let i = 0; i < 5; i++) {
          let segment = '';
          for (let j = 0; j < 4; j++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          segments.push(segment);
        }
        return segments.join('-');
      };
      
      let newId = generateId();
      // Ensure uniqueness
      while (prev.some(p => p.id === newId)) {
        newId = generateId();
      }
      
      const newProduct = { ...product, id: newId } as Product;
      return [...prev, newProduct];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    const newConfig = { ...siteConfig, ...config };
    setSiteConfig(newConfig);
    saveSiteConfig(newConfig);
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const resetToDefaults = () => {
    setProducts(defaultProducts);
    setSiteConfig(defaultSiteConfig);
    saveSiteConfig(defaultSiteConfig);
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        siteConfig,
        isAuthenticated,
        updateProduct,
        addProduct,
        deleteProduct,
        updateSiteConfig,
        login,
        logout,
        resetToDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
