"use client";

import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type UseFormReturn,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";

type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
> =
  React.PropsWithChildren<UseFormReturn<TFieldValues, TContext>>;

export function Form<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
>({ children, ...form }: FormProps<TFieldValues, TContext>) {
  return <FormProvider {...(form as UseFormReturn<TFieldValues, TContext>)}>{children}</FormProvider>;
}

// Context to share current field name for error messages
const FormFieldContext = React.createContext<{ name: string } | null>(null);

function useFormFieldName(): string {
  const ctx = React.useContext(FormFieldContext);
  return ctx?.name ?? "";
}

// Generic FormField that wraps RHF Controller and provides name via context
export function FormField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>): React.ReactElement {
  const { name } = props;
  return (
    <FormFieldContext.Provider value={{ name: name as string }}>
      {/* Controller ensures `render={({ field }) => ...}` has proper types */}
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>): React.ReactElement {
  return <label className={cn("text-sm font-medium", className)} {...props} />;
}

export function FormControl({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn(className)} {...props} />;
}

export function FormMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement | null {
  const name = useFormFieldName();
  const form = useFormContext();
  const message = name
    ? (form.getFieldState(name, form.formState).error?.message as
        string | undefined)
    : undefined;

  if (!message) return null;

  return (
    <p
      className={cn("text-sm text-destructive dark:text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
}
