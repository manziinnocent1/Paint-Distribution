"use client";

import * as React from "react";

import {
  Controller,
  FormProvider,
  useFormContext,
//   useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "../../components/ui/label";

import { cn } from "../../../../lib/utils";

/* ============================================================
   FORM
============================================================ */

const Form = FormProvider;

/* ============================================================
   FORM FIELD CONTEXT
============================================================ */

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

/* ============================================================
   FORM ITEM CONTEXT
============================================================ */

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/* ============================================================
   FORM FIELD
============================================================ */

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

/* ============================================================
   FORM ITEM
============================================================ */

function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

/* ============================================================
   FORM LABEL
============================================================ */

function FormLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label>) {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  const { getFieldState, formState } = useFormContext();

  if (!fieldContext || !itemContext) {
    throw new Error("FormLabel must be used inside FormField and FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return (
    <Label
      htmlFor={`${itemContext.id}-form-item`}
      className={cn(fieldState.error && "text-destructive", className)}
      {...props}
    />
  );
}

/* ============================================================
   FORM CONTROL
============================================================ */

function FormControl({ ...props }: React.ComponentPropsWithoutRef<"div">) {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  const { getFieldState, formState } = useFormContext();

  if (!fieldContext || !itemContext) {
    throw new Error("FormControl must be used inside FormField and FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const controlId = `${itemContext.id}-form-item`;
  const descriptionId = `${itemContext.id}-form-item-description`;
  const messageId = `${itemContext.id}-form-item-message`;

  return (
    <div
      id={controlId}
      aria-describedby={
        fieldState.error ? `${descriptionId} ${messageId}` : descriptionId
      }
      aria-invalid={Boolean(fieldState.error)}
      {...props}
    />
  );
}

/* ============================================================
   FORM DESCRIPTION
============================================================ */

function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const itemContext = React.useContext(FormItemContext);

  if (!itemContext) {
    throw new Error("FormDescription must be used inside FormItem.");
  }

  return (
    <p
      id={`${itemContext.id}-form-item-description`}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ============================================================
   FORM MESSAGE
============================================================ */

function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  const { getFieldState, formState } = useFormContext();

  if (!fieldContext || !itemContext) {
    throw new Error("FormMessage must be used inside FormField and FormItem.");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const message = fieldState.error?.message;

  if (!message && !children) {
    return null;
  }

  return (
    <p
      id={`${itemContext.id}-form-item-message`}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message ? String(message) : children}
    </p>
  );
}

/* ============================================================
   EXPORTS
============================================================ */

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldContext,
};
