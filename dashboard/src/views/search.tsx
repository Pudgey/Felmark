"use client";

import type { Workstation } from "@/lib/types";
import SearchPage from "@/components/search/SearchPage";

interface SearchViewProps {
  workstations: Workstation[];
}

export default function SearchView({ workstations }: SearchViewProps) {
  return <SearchPage workstations={workstations} />;
}
