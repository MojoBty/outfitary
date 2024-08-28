"use client"

import React, { createContext, useContext, useState } from 'react';

const ClosetContext = createContext()
export const useCloset = () => useContext(ClosetContext)

const ClosetProvider = ({ children }) => {
  const [selectedTop, setSelectedTop] = useState({})
  const [selectedBottoms, setSelectedBottoms] = useState({})
  const [selectedShoes, setSelectedShoes] = useState({})
  const [selectedHeadwear, setSelectedHeadwear] = useState({})

  const [selectedIndexes, setSelectedIndexes] = useState({
    tops: {page: 0, index: 0},
    bottoms: {page: 0, index: 0},
    shoes: {page: 0, index: 0},
    headwear: {page: 0, index: 0},
  });

  const [outfitIndexes, setOutfitIndexes] = useState({page: null, index: null });

  const setSelectedIndex = (category, pageIndex, cardIndex) => {
    setSelectedIndexes((prev) => ({ ...prev, [category]: {page: pageIndex, index: cardIndex} }));
  };

  const setOutfitIndex = (pageIndex, cardIndex) => {
    setOutfitIndexes({page: pageIndex, index: cardIndex });
  };


  return (
    <ClosetContext.Provider value={{ selectedTop, setSelectedTop, selectedBottoms, setSelectedBottoms, selectedShoes, setSelectedShoes, selectedHeadwear, setSelectedHeadwear, selectedIndexes, setSelectedIndex, outfitIndexes, setOutfitIndex, setSelectedIndexes }}>
      {children}
    </ClosetContext.Provider>
  )
}

export default ClosetProvider