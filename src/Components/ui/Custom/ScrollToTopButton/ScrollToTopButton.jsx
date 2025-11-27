import { useEffect, useState } from "react";
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";

// ScrollToTopButton component - floating button to scroll to top
function ScrollToTopButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-full shadow-lg p-3 transition-all duration-300 flex items-center justify-center ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      style={{ boxShadow: "0 4px 24px rgba(147,51,234,0.15)" }}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}

export default ScrollToTopButton;
