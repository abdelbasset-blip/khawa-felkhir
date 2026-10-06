import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallback = "U",
  size = "md",
  className,
  ...props
}) => {
  const [hasError, setHasError] = React.useState(!src);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/10 font-bold text-primary">
          {fallback}
        </div>
      )}
    </div>
  );
};
