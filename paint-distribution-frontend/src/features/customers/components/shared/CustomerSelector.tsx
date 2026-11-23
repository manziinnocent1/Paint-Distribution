import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { useCustomers } from "../../hooks/useCustomers";
import type { Customer } from "../../types/customer.types";

import { getCustomerFullName } from "../../utils/customer.utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { CustomerAvatar } from "./CustomerAvatar";

interface CustomerSelectorProps {
  value?: string;
  onChange: (customerId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function CustomerSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Select customer...",
}: CustomerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useCustomers({
    search,
    status: "ACTIVE",
    page: 1,
    page_size: 50,
  });

  const customers = data?.results ?? [];

  const selected = customers.find((customer) => customer.id === value);

  const handleSelect = (customer: Customer) => {
    onChange(customer.id);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          <span className="truncate">
            {selected ? getCustomerFullName(selected) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading customers...</CommandEmpty>
            ) : customers.length === 0 ? (
              <CommandEmpty>No customers found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.id}
                    onSelect={() => handleSelect(customer)}
                  >
                    <CustomerAvatar customer={customer} size="sm" />

                    <div className="ml-2 min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {getCustomerFullName(customer)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customer.customer_number} · {customer.phone_number}
                      </p>
                    </div>

                    {value === customer.id && <Check className="h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
