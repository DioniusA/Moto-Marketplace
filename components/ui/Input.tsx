"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
          )}
          <input
            ref={ref}
            className={cn(
              "input-field",
              Icon && "pl-10",
              error && "border-accent-red",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-accent-red pl-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
