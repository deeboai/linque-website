import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import logoBlue from "@/assets/linque_logo_blue-removebg.png";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/jobs", label: "Careers" },
  { path: "/contact", label: "Contact Us" },
  { path: "/linque-learn", label: "Linque Learn" },
];

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr),minmax(0,1fr)]">
          <div className="space-y-5">
            <Link to="/" className="block">
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
            <p className="max-w-xs text-sm text-muted-foreground">
              Linque Resourcing is your partner for people-centered strategy, talent, and operations support.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                href="mailto:info@linqueresourcing.com"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                info@linqueresourcing.com
              </a>
              <a
                href="tel:+17133796630"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                713.379.6630
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61575220193345&mibextid=wwXlfR&rdid=VbnVloZ9ockeyFMG&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1FiE8TXJKE%2F%3Fmibextid%3DwwXlfR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/linque_resourcing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/linque-resourcing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Navigation</h4>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Let&apos;s Partner</h4>
            <p className="text-sm text-muted-foreground">
              We tailor people solutions for growing organizations across industries. Reach out to explore how we can help.
            </p>
            <Link
              to="/contact#contact-form"
              className="inline-flex w-max items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Work With Us
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Linque Resourcing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
