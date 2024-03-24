import { useState } from "react";

//context
import LoadingContext from "../contexts/LoadingContext";

export const LoadingProvider = ({ children }) => {
  //loaders states
  const [loading, setLoading] = useState(false);
  //backdrop state
  const [isOpen, setIsOpen] = useState(false);

  const showBackdrop = () => {
    setIsOpen(true);
  };

  const hideBackdrop = () => {
    setIsOpen(false);
  };

  const setLoadingState = (state) => {
    setLoading(state);
  };

  return (
    <LoadingContext.Provider
      value={{ loading, isOpen, showBackdrop, hideBackdrop, setLoadingState }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
