import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, Star, Video, X } from "lucide-react";
import { specialties } from "@shared/schema";

export default function DirectoryFilters({ filters, hasActiveFilters, clearFilters }) {
  return (
    <Card className="mb-6 p-4">
      <div className="flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by doctor name..." value={filters.searchQuery} onChange={(e) => filters.setSearchQuery(e.target.value)} className="pl-9" data-testid="input-search-doctor" />
        </div>
        <Select value={filters.selectedSpecialty} onValueChange={filters.setSelectedSpecialty}>
          <SelectTrigger className="sm:w-[200px]" data-testid="select-specialty-filter"><Filter className="mr-1 h-4 w-4" /><SelectValue placeholder="All Specialties" /></SelectTrigger>
          <SelectContent position="popper" className="z-[100] max-h-72"><SelectItem value="all">All Specialties</SelectItem>{specialties.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filters.minRating} onValueChange={filters.setMinRating}>
          <SelectTrigger className="sm:w-[160px]" data-testid="select-rating-filter"><Star className="mr-1 h-4 w-4" /><SelectValue placeholder="Min Rating" /></SelectTrigger>
          <SelectContent position="popper" className="z-[100]"><SelectItem value="0">Any Rating</SelectItem><SelectItem value="3">3+ Stars</SelectItem><SelectItem value="4">4+ Stars</SelectItem><SelectItem value="5">5 Stars</SelectItem></SelectContent>
        </Select>
        <Select value={filters.onlineOnly} onValueChange={filters.setOnlineOnly}>
          <SelectTrigger className="sm:w-[200px]"><Video className="mr-1 h-4 w-4" /><SelectValue placeholder="Consultation type" /></SelectTrigger>
          <SelectContent position="popper" className="z-[100]"><SelectItem value="all">All doctors</SelectItem><SelectItem value="online">Online consultation</SelectItem></SelectContent>
        </Select>
        {hasActiveFilters ? <Button variant="ghost" size="icon" onClick={clearFilters} data-testid="button-clear-filters"><X className="h-4 w-4" /></Button> : null}
      </div>
    </Card>
  );
}
