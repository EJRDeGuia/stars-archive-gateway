
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SemanticSearchButtonProps {
  className?: string;
}

const SemanticSearchButton: React.FC<SemanticSearchButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex justify-center ${className || ""}`}>
      <div className="relative group">
        <Button
          type="button"
          onClick={() => navigate("/explore")}
          size="lg"
          className="relative bg-gradient-to-r from-dlsl-green to-dlsl-green-600 text-white font-semibold text-lg rounded-2xl px-10 py-5 shadow-xl border-0 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-dlsl-green/30 sleek-shadow-lg"
        >
          <span className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <Search
                className="w-6 h-6 text-white/90 transition-all duration-300 group-hover:scale-110"
                strokeWidth={2}
              />
              <Sparkles
                className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse"
                strokeWidth={2.5}
              />
            </div>
            <span className="tracking-wide font-medium">
              Explore with AI Search
            </span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Button>
        <div className="absolute inset-0 bg-dlsl-green/20 rounded-2xl blur-xl scale-110 opacity-0 group-hover:opacity-60 transition-all duration-500 -z-10" />
      </div>
    </div>
  );
};

export default SemanticSearchButton;
