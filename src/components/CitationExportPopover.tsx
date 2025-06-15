
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ClipboardCopy, BookOpen } from "lucide-react";

interface CitationExportPopoverProps {
  title: string;
  author: string;
  year: string;
}

const generateCitation = (type: "APA" | "MLA" | "Chicago", title: string, author: string, year: string) => {
  switch (type) {
    case "APA":
      return `${author}. (${year}). ${title}. De La Salle Lipa University.`;
    case "MLA":
      return `${author}. "${title}." De La Salle Lipa University, ${year}.`;
    case "Chicago":
      return `${author}. ${title}. De La Salle Lipa University, ${year}.`;
    default:
      return "";
  }
};

const CitationExportPopover: React.FC<CitationExportPopoverProps> = ({ title, author, year }) => {
  const [copiedType, setCopiedType] = useState<null | string>(null);

  const handleCopy = (type: "APA" | "MLA" | "Chicago") => {
    const citation = generateCitation(type, title, author, year);
    navigator.clipboard.writeText(citation);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1200);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 px-2">
          <BookOpen className="w-4 h-4" />
          Export Citation
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="mb-2 font-semibold text-gray-900">Export Citation</div>
        {["APA", "MLA", "Chicago"].map((type) => (
          <div key={type} className="mb-2 flex items-center justify-between space-x-2">
            <div>
              <span className="text-sm font-medium">{type}</span>
            </div>
            <Button
              size="sm"
              className="gap-1 px-2"
              variant="secondary"
              onClick={() => handleCopy(type as "APA" | "MLA" | "Chicago")}
            >
              <ClipboardCopy className="w-4 h-4" />
              {copiedType === type ? "Copied!" : "Copy"}
            </Button>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default CitationExportPopover;
