export const required: FieldValidatorType = (value) => {
    return value ? undefined : 'Field is required';
};

export type FieldValidatorType = (value: string) => string | undefined;