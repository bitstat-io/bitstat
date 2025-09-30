"use client";

import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@workspace/ui/components/input";
import debounce from "debounce";

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = debounce((searchInput: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set("query", searchInput);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex relative items-center border rounded-md w-full bg-input/30">
      <Input
        className="border-0 !bg-transparent"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <IconSearch className="pr-2 absolute right-0 text-muted-foreground" />
    </div>
  );
}
