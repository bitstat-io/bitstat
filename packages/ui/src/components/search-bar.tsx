"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { IconSearch } from "@tabler/icons-react";

type ComboboxListT = {
  value: string;
  label: string;
};

const items: ComboboxListT[] = [
  {
    value: "axie-infinity",
    label: "Axie Infinity",
  },
  {
    value: "splinterlands",
    label: "Splinterlands",
  },
  {
    value: "gods-unchained",
    label: "Gods Unchained",
  },
  {
    value: "alien-worlds",
    label: "Alien Worlds",
  },
  {
    value: "defi-kingdoms",
    label: "Defi Kingdom",
  },
  {
    value: "decentraland",
    label: "Decentraland",
  },
];

export function SearchBar() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full flex-1 justify-between"
        >
          {value ? (
            items.find((item) => item.value === value)?.label
          ) : (
            <span className="text-muted-foreground">Search game</span>
          )}
          <IconSearch className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[660px] p-0">
        <Command>
          <CommandInput placeholder="Search game" className="h-9" />
          <CommandList>
            <CommandEmpty>No game found.</CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => (
                <CommandItem
                  key={index}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
