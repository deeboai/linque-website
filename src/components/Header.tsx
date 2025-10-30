import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoBlue from "@/assets/linque_logo_blue-removebg.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/jobs", label: "Careers" },
    { path: "/contact", label: "Contact Us" },
    { path: "/linque-learn", label: "Linque Learn" },
  ];

  const scheduleUrl =
    import.meta.env.VITE_SCHEDULER_URL ??
    "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";
  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "border-b bg-background/80 backdrop-blur-lg shadow-sm" 
        : "bg-background/60 backdrop-blur-sm"
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-14" : "h-16"
        }`}>
          <Link to="/" className="flex items-center space-x-2">
            {/* <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Linque Resourcing
            </span> */}
            <div className="flex h-16 items-center md:h-20">
              <img
                src={logoBlue}
                alt="Linque Resourcing"
                className="h-full w-auto object-contain"
                style={{ clipPath: "inset(3% 0% 3% 1.5%)" }}
                loading="lazy"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none ${
                  isActive(link.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-6 flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                <Link to="/contact#contact-form">Find Talent</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                  Schedule a Call
                </a>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-muted/60 hover:text-primary ${
                  isActive(link.path) ? "bg-muted/60 text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Button asChild variant="outline" onClick={() => setIsMenuOpen(false)}>
                <Link to="/contact#contact-form">Find Talent</Link>
              </Button>
              <Button asChild onClick={() => setIsMenuOpen(false)}>
                <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                  Schedule a Call
                </a>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
