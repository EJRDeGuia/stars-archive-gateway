
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useColleges } from "@/hooks/useApi";
import type { College } from "@/types/thesis";

type Facet = {
  label: string;
  value: string;
  checked: boolean;
};

export interface FacetFilterState {
  authors: string[];
  years: string[];
  colleges: string[];
  statuses: string[];
}

interface FacetFilterBarProps {
  filters: FacetFilterState;
  allYears: string[];
  allAuthors: string[];
  onFilterChange: (filters: FacetFilterState) => void;
}

const STATUS_OPTIONS = [
  { label: "Approved", value: "approved" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Needs Revision", value: "needs_revision" },
];

const FacetFilterBar: React.FC<FacetFilterBarProps> = ({
  filters,
  allYears,
  allAuthors,
  onFilterChange
}) => {
  const { data: collegeOptionsRaw = [] } = useColleges();
  const collegeOptions: College[] = Array.isArray(collegeOptionsRaw) ? collegeOptionsRaw : [];

  // Utility update methods
  const handleCheckbox = (key: keyof FacetFilterState, val: string) => {
    onFilterChange({
      ...filters,
      [key]: filters[key].includes(val)
        ? filters[key].filter(v => v !== val)
        : [...filters[key], val],
    });
  };
  return (
    <section className="w-full flex flex-wrap gap-2 mb-5 items-center">
      {/* Author Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full px-4 bg-white border shadow-sm flex items-center gap-2 text-slate-700 hover:bg-slate-50" variant="outline">
            Author
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-60 p-3 space-y-1">
          <div className="font-medium mb-2 text-sm">Authors</div>
          <div className="max-h-52 overflow-auto pr-1">
            {allAuthors.map(author => (
              <label key={author} className="flex items-center gap-2 cursor-pointer text-[15px] py-1">
                <Checkbox
                  checked={filters.authors.includes(author)}
                  onCheckedChange={() => handleCheckbox("authors", author)}
                  id={`author-${author}`}
                />
                {author}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {/* Year Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full px-4 bg-white border shadow-sm flex items-center gap-2 text-slate-700 hover:bg-slate-50" variant="outline">
            Year
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-44 p-3 space-y-1">
          <div className="font-medium mb-2 text-sm">Years</div>
          <div className="max-h-52 overflow-auto pr-1">
            {allYears.map(y => (
              <label key={y} className="flex items-center gap-2 cursor-pointer text-[15px] py-1">
                <Checkbox
                  checked={filters.years.includes(y)}
                  onCheckedChange={() => handleCheckbox("years", y)}
                  id={`year-${y}`}
                />
                {y}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {/* College Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full px-4 bg-white border shadow-sm flex items-center gap-2 text-slate-700 hover:bg-slate-50" variant="outline">
            College
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-3 space-y-1">
          <div className="font-medium mb-2 text-sm">Colleges</div>
          <div className="max-h-52 overflow-auto pr-1">
            {collegeOptions.map((c) => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer text-[15px] py-1">
                <Checkbox
                  checked={filters.colleges.includes(c.name)}
                  onCheckedChange={() => handleCheckbox("colleges", c.name)}
                  id={`college-${c.id}`}
                />
                {c.name}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full px-4 bg-white border shadow-sm flex items-center gap-2 text-slate-700 hover:bg-slate-50" variant="outline">
            Status
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-52 p-3 space-y-1">
          <div className="font-medium mb-2 text-sm">Status</div>
          <div className="max-h-52 overflow-auto pr-1">
            {STATUS_OPTIONS.map((s) => (
              <label key={s.value} className="flex items-center gap-2 cursor-pointer text-[15px] py-1">
                <Checkbox
                  checked={filters.statuses.includes(s.value)}
                  onCheckedChange={() => handleCheckbox("statuses", s.value)}
                  id={`status-${s.value}`}
                />
                {s.label}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {/* Clear Filters */}
      <Button
        size="sm"
        className="ml-auto rounded-full px-4 bg-white border border-dlsl-green/40 text-dlsl-green hover:bg-dlsl-green/10 shadow"
        onClick={() => onFilterChange({ authors: [], years: [], colleges: [], statuses: [] })}
        type="button"
      >
        Clear Filters
      </Button>
    </section>
  );
};

export default FacetFilterBar;
