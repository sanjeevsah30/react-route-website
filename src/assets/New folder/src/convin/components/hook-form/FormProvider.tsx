import PropTypes from "prop-types";
import { ReactNode } from "react";
// form
import {
    FieldValues,
    FormProvider as Form,
    UseFormReturn,
} from "react-hook-form";

// ----------------------------------------------------------------------

FormProvider.propTypes = {
    children: PropTypes.node.isRequired,
    methods: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    className: PropTypes.string,
};

interface IProp<T extends FieldValues> {
    children: ReactNode;
    onSubmit: () => void;
    methods: UseFormReturn<T, unknown>;
    className?: string;
}

export default function FormProvider<T extends FieldValues>({
    children,
    onSubmit,
    methods,
    className,
}: IProp<T>): JSX.Element {
    const preventEnterKeySubmission = (
        e: React.KeyboardEvent<HTMLFormElement>
    ): void => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (e.key === "Enter" && !["TEXTAREA"].includes(target.tagName)) {
            e.preventDefault();
        }
    };
    return (
        <Form {...methods}>
            <form
                className={className}
                onSubmit={onSubmit}
                onKeyDown={(e) => preventEnterKeySubmission(e)}
            >
                {children}
            </form>
        </Form>
    );
}
