import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "xs";
  children: ReactNode;
}

const variants: Record<string, string> = {
  primary: "bg-accent hover:bg-accent-2 text-white border-transparent",
  outline: "bg-transparent border-white/10 text-text hover:bg-bg-3",
  ghost:
    "bg-transparent border-transparent text-text-2 hover:text-text hover:bg-bg-3",
  danger: "bg-transparent border-rose/30 text-rose hover:bg-rose/10",
};

const sizes: Record<string, string> = {
  xs: "px-2 py-1 text-[11px] rounded-md",
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-[13px] rounded-r",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 font-medium cursor-pointer transition-all duration-150 border ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
