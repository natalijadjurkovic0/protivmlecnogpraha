import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-display text-xl font-bold text-warm-white">Mlečni</span>
          <span className="font-handwritten text-2xl text-primary italic">put</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#story" className="font-body text-sm font-medium text-warm-white/80 hover:text-warm-white transition-colors">
            Priča
          </a>
          <a href="#products" className="font-body text-sm font-medium text-warm-white/80 hover:text-warm-white transition-colors">
            Proizvodi
          </a>
          <a href="#farmers" className="font-body text-sm font-medium text-warm-white/80 hover:text-warm-white transition-colors">
            Farmeri
          </a>
          <Link
            to="/partner"
            className="px-5 py-2 border-2 border-warm-white text-warm-white font-body font-semibold text-sm hover:bg-warm-white hover:text-foreground transition-all"
          >
            Postani Partner
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-warm-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-foreground/90 backdrop-blur-md"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#story" onClick={() => setIsOpen(false)} className="font-body text-warm-white">Priča</a>
              <a href="#products" onClick={() => setIsOpen(false)} className="font-body text-warm-white">Proizvodi</a>
              <a href="#farmers" onClick={() => setIsOpen(false)} className="font-body text-warm-white">Farmeri</a>
              <Link
                to="/partner"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 border-2 border-warm-white text-warm-white font-body font-semibold text-sm text-center"
              >
                Postani Partner
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
