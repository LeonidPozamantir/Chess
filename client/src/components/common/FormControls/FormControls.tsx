import React from 'react';
import { WrappedFieldProps, Field } from 'redux-form';
import s from './FormControls.module.css';
import { FieldValidatorType } from '../../../utils/validators';

type WrappedFieldPropsWithText = WrappedFieldProps & {text?: string};

export const Input: React.FC<WrappedFieldPropsWithText> = ({input, meta, ...rest}) => {
    const hasError = meta.touched && meta.error;
    return <div className={s.formControl + ' ' + (hasError ? s.error : '')}>
        <input {...input} {...rest}/>{rest.text}
        {hasError && <div><span>{meta.error}</span></div>}
    </div>;
};

export function createField<FormKeysType extends string>(
                    placeholder: string | undefined,
                    name: FormKeysType,
                    component: React.FC<WrappedFieldPropsWithText>,
                    validators: Array<FieldValidatorType>,
                    props = {},
                    text = '') {
    return <div>
        <Field placeholder={placeholder} name={name} component={component} validate={validators} {...props} text={text} />
    </div>;
};

export type getStringKeys<T> = Extract<keyof T, string>;