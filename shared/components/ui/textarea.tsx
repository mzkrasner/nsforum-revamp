"use client";

import autosize from "autosize";
import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";
import { FieldError } from "react-hook-form";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoGrow?: boolean;
  error?: FieldError;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ autoGrow, className, error, ...props }, forwardedRef) => {
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (!(ref as any)?.current) return;
      if (autoGrow) setTimeout(() => autosize((ref as any).current), 10);
    }, [ref, autoGrow]);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          { ["border-destructive"]: !!error },
          className,
        )}
        ref={(e) => {
          if (typeof forwardedRef === "function") {
            (forwardedRef as Function)(e);
          }
          ref.current = e;
        }}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
