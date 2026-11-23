import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSupplierInitials } from "../utils/supplier.utils";

interface SupplierAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
};

export function SupplierAvatar({ name, size = "md" }: SupplierAvatarProps) {
  return (
    <Avatar className={sizes[size]}>
      <AvatarFallback className="bg-primary/10 text-primary">
        {name ? getSupplierInitials(name) : <Building2 />}
      </AvatarFallback>
    </Avatar>
  );
}
