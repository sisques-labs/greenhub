"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "@/presentation/components/ui/label";
import { cn } from "@/presentation/lib/utils";
import * as React from "react";

type FormErrors = Record<string, { message?: string } | undefined>;

type FormContextValue = {
	errors: FormErrors;
};

const FormContext = React.createContext<FormContextValue>({
	errors: {},
});

const FormFieldContext = React.createContext<{ name: string }>({
	name: "",
});

interface FormProps {
	children: React.ReactNode;
	errors?: FormErrors;
}

function Form({ children, errors = {} }: FormProps) {
	return (
		<FormContext.Provider value={{ errors }}>{children}</FormContext.Provider>
	);
}

interface FormFieldProps {
	name: string;
	children: (props: {
		value: string;
		onChange: (value: string) => void;
		error?: { message?: string };
	}) => React.ReactNode;
}

function FormField({ name, children }: FormFieldProps) {
	const { errors } = React.useContext(FormContext);
	const fieldContext = React.useContext(FormFieldContext);
	const error = errors[name];

	return (
		<FormFieldContext.Provider value={{ name }}>
			{children({
				value: "",
				onChange: () => {},
				error,
			})}
		</FormFieldContext.Provider>
	);
}

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { errors } = React.useContext(FormContext);
	const error = errors[fieldContext.name];

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		error,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				data-slot="form-item"
				className={cn("grid gap-2", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

function FormLabel({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	let error: { message?: string } | undefined;
	let formItemId: string | undefined;

	try {
		const fieldContext = useFormField();
		error = fieldContext.error;
		formItemId = fieldContext.formItemId;
	} catch {
		// If useFormField fails, we're not in a FormField context
		// Use a default id
		formItemId = props.htmlFor;
	}

	return (
		<Label
			data-slot="form-label"
			data-error={!!error}
			className={cn("data-[error=true]:text-destructive", className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
	let error: { message?: string } | undefined;
	let formItemId: string | undefined;
	let formDescriptionId: string | undefined;
	let formMessageId: string | undefined;

	try {
		const fieldContext = useFormField();
		error = fieldContext.error;
		formItemId = fieldContext.formItemId;
		formDescriptionId = fieldContext.formDescriptionId;
		formMessageId = fieldContext.formMessageId;
	} catch {
		// If useFormField fails, we're not in a FormField context
		// Use default values
		formItemId = props.id;
	}

	return (
		<Slot
			data-slot="form-control"
			id={formItemId}
			aria-describedby={
				!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	let formDescriptionId: string | undefined;

	try {
		const fieldContext = useFormField();
		formDescriptionId = fieldContext.formDescriptionId;
	} catch {
		// If useFormField fails, we're not in a FormField context
		// Use a default id
		formDescriptionId = props.id;
	}

	return (
		<p
			data-slot="form-description"
			id={formDescriptionId}
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

interface FormMessageProps extends React.ComponentProps<"p"> {
	fieldName?: string;
}

function FormMessage({ className, fieldName, ...props }: FormMessageProps) {
	const { errors } = React.useContext(FormContext);

	// Try to get error from fieldName prop first, then from context
	let error: { message?: string } | undefined;
	let formMessageId: string | undefined;

	if (fieldName) {
		error = errors[fieldName];
		formMessageId = `${fieldName}-form-item-message`;
	} else {
		try {
			error = errors[fieldName ?? ""];
			formMessageId = `${fieldName}-form-item-message`;
		} catch {}
	}

	const body = error ? String(error?.message ?? "") : props.children;

	if (!body) {
		return null;
	}

	return (
		<p
			data-slot="form-message"
			id={formMessageId}
			className={cn("text-destructive text-sm", className)}
			{...props}
		>
			{body}
		</p>
	);
}

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
};
