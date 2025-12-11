import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ExplanationMode, useSettingsStore } from "@/store/settings-store";

type AvailableExplanationMode = {
  value: ExplanationMode;
  label: string;
};

export default function ExplanationModeSelector() {
  const [open, setOpen] = useState(false);

  const { explanationMode, setExplanationMode } = useSettingsStore((s) => s);

  const AVAILABLE_EXPLANATION_MODES: AvailableExplanationMode[] = [
    {
      value: "explanation",
      label: "Show Everything to me",
    },
    {
      value: "steps",
      label: "Only show hits when I need",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {explanationMode
            ? AVAILABLE_EXPLANATION_MODES.find(
                (explanation_mode) =>
                  explanation_mode.value === explanationMode,
              )?.label
            : "Select framework..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search explanation mode..." />
          <CommandList>
            <CommandEmpty>
              No modes available (unexpected behavior).
            </CommandEmpty>
            <CommandGroup>
              {AVAILABLE_EXPLANATION_MODES.map((availableExplanationMode) => (
                <CommandItem
                  key={availableExplanationMode.value}
                  value={availableExplanationMode.value}
                  onSelect={(currentValue) => {
                    setExplanationMode(
                      currentValue === explanationMode
                        ? "steps"
                        : (currentValue as ExplanationMode),
                    );
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      explanationMode === availableExplanationMode.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {availableExplanationMode.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
