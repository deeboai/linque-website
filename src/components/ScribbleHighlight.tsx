import { ReactNode } from "react";

interface ScribbleHighlightProps {
  children: ReactNode;
  color?: "primary" | "accent";
}

const ScribbleHighlight = ({ children, color = "primary" }: ScribbleHighlightProps) => {
  const strokeColor = color === "primary" ? "%2324254c" : "%23342669";
  
  return (
    <span className="relative inline-block px-1">
      {children}
      <svg
        className="absolute left-0 bottom-0 w-full h-3 pointer-events-none"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        style={{ transform: "translateY(2px)" }}
      >
        <path
          d="M2,9 Q20,4 40,7 T80,9 T120,7 T160,9 T198,7"
          fill="none"
          stroke={`#${strokeColor.slice(3)}`}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </span>
  );
};

export default ScribbleHighlight;
