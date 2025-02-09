import get from 'lodash.get';
import React, { ReactElement } from 'react';
import {
  FieldError,
  FieldPath,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { z, ZodType, ZodTypeDef } from 'zod';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';
import { Input } from './Input';

type TFormValues = Record<string, unknown>;

export type Schema = ZodType<TFormValues, ZodTypeDef, TFormValues>;

export type InputFieldProps<T extends z.infer<Schema>> =
  FieldWrapperPassThroughProps & {
    /**
     * The input field name
     */
    name: FieldPath<T>;
    /**
     * The input field type
     */
    type?: 'text' | 'email' | 'password' | 'number' | 'file';
    /**
     * The input field label
     */
    label?: string;
    /**
     * The input field classes
     */
    className?: string;
    /**
     * The input field icon
     */
    icon?: ReactElement;
    /**
     * The input field icon position
     */
    iconPosition?: 'start' | 'end';
    /**
     * The input field placeholder
     */
    placeholder?: string;
    /**
     * Flag to indicate if the field is disabled
     */
    disabled?: boolean;
    /**
     * The input field prepend label
     */
    prependLabel?: string;
    /**
     * The input field append label
     */
    appendLabel?: string;
    /**
     * A callback for transforming the input onChange for things like sanitizing input
     */
    inputTransform?: (val: string) => string;
    /**
     * Render line breaks in the description
     */
    renderDescriptionLineBreaks?: boolean;
    /**
     * Renders a button to clear the input onClick
     */
    clearButton?: boolean;
    /**
     * The input field classes
     */
    inputClassName?: string;
  };

export const InputField = <T extends z.infer<Schema>>({
  type = 'text',
  name,
  icon,
  iconPosition = 'start',
  placeholder,
  disabled,
  prependLabel = '',
  appendLabel = '',
  dataTest,
  inputTransform,
  renderDescriptionLineBreaks = false,
  clearButton,
  inputClassName,
  fieldProps = {},
  ...wrapperProps
}: InputFieldProps<T>) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<T>();

  const maybeError = get(errors, name) as FieldError | undefined;

  const { onChange, ...regReturn } = register(name);

  const value = useWatch<Record<string, string>>({ name });

  const showClearButton = !!value && clearButton;

  const onInputChange = React.useCallback(
    async event => {
      if (event.target.files?.[0]) {
        onChange(event);
      }
    },
    [onChange]
  );

  const onInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputTransform) {
      e.target.value = inputTransform(e.target.value);
    }
    if (type === 'file') {
      onInputChange(e);
    } else {
      onChange(e);
    }
  };

  const onClearButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setValue(name, '');
  };

  return (
    <FieldWrapper
      id={name}
      {...wrapperProps}
      error={maybeError}
      renderDescriptionLineBreaks={renderDescriptionLineBreaks}
    >
      <Input
        type={type}
        name={name}
        icon={icon}
        label={wrapperProps?.label || ''}
        iconPosition={iconPosition}
        placeholder={placeholder}
        disabled={disabled}
        prependLabel={prependLabel}
        appendLabel={appendLabel}
        dataTest={dataTest}
        clearButton={showClearButton}
        inputClassName={inputClassName}
        maybeError={maybeError}
        onChange={onInputChangeEvent}
        onClearButtonClick={onClearButtonClick}
        inputProps={regReturn}
        fieldProps={fieldProps}
      />
    </FieldWrapper>
  );
};
