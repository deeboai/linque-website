import { Link } from "react-router-dom";
import logoMark from "@/assets/linque-logo.svg";

interface LogoProps {
  className?: string;
  size?: "sm" | "md";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const dimensions = size === "sm" ? { width: 120, height: 36 } : { width: 150, height: 45 };

  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="Linque Resourcing home">
      <img
        src={logoMark}
        width={dimensions.width}
        height={dimensions.height}
        alt="Linque Resourcing"
        className="h-auto w-auto"
      />
    </Link>
  );
};

export default Logo;
