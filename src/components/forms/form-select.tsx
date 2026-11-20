"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string; hint?: string };

/** shadcn Select (Base UI) yang ikut terkirim di <form> lewat atribut `name`. */
export function FormSelect({
  name,
  options,
  defaultValue,
  value,
  onValueChange,
  placeholder = "Pilih…",
  className,
  id,
  invalid,
}: {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  invalid?: boolean;
}) {
  return (
    <Select
      name={name}
      items={options.map((o) => ({ value: o.value, label: o.label }))}
      defaultValue={defaultValue}
      value={value}
      onValueChange={(v) => onValueChange?.(String(v ?? ""))}
    >
      <SelectTrigger id={id} aria-invalid={invalid || undefined} className={cn("h-10 w-full bg-background", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.hint ? (
              <span className="flex flex-col">
                <span>{o.label}</span>
                <span className="text-xs text-muted-foreground">{o.hint}</span>
              </span>
            ) : (
              o.label
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
