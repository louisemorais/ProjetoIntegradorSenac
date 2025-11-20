import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const root = document.scrollingElement || document.documentElement;
    root.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search]);

  return null;
}