import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-foreground">Mlečni</span>
          <span className="font-handwritten text-3xl text-primary">put</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Početna
          </Link>
          <Link to="/partner" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Postani Partner
          </Link>
          <Link to="/" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            O nama
          </Link>
          <Link
            to="/partner"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:opacity-90 transition-opacity"
          >
            Pridruži se
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
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
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="font-body text-foreground">Početna</Link>
              <Link to="/partner" onClick={() => setIsOpen(false)} className="font-body text-foreground">Postani Partner</Link>
              <Link to="/" onClick={() => setIsOpen(false)} className="font-body text-foreground">O nama</Link>
              <Link
                to="/partner"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full text-center"
              >
                Pridruži se
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
