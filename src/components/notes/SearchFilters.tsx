import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useState } from "react";

export interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  searchTerm: string;
  dateRange: DateRange | undefined;
  sortBy: "newest" | "oldest" | "title";
}

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const handleSearch = () => {
    onSearch({
      searchTerm,
      dateRange,
      sortBy,
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setSortBy("newest");
    onSearch({
      searchTerm: "",
      dateRange: undefined,
      sortBy: "newest",
    });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "title") => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">By title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClear}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};