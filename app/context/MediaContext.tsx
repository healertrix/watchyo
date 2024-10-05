'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MediaContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  hasSearched: boolean;
  setHasSearched: (hasSearched: boolean) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMediaContext must be used within a MediaProvider');
  }
  return context;
};

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem('mediaState');
    if (storedState) {
      const { searchQuery, searchResults, hasSearched } = JSON.parse(storedState);
      setSearchQuery(searchQuery);
      setSearchResults(searchResults);
      setHasSearched(hasSearched);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mediaState', JSON.stringify({ searchQuery, searchResults, hasSearched }));
  }, [searchQuery, searchResults, hasSearched]);

  return (
    <MediaContext.Provider value={{ searchQuery, setSearchQuery, searchResults, setSearchResults, hasSearched, setHasSearched }}>
      {children}
    </MediaContext.Provider>
  );
};