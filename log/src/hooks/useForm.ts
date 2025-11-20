import { useState, useEffect, type ChangeEvent } from 'react';

// FieldValues 타입 정의
type FieldValues = Record<string, any>;

// UseFormProps 인터페이스 정의
interface UseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> {
  initialValues: TFieldValues;
  validate: (values: TFieldValues) => Record<keyof TFieldValues, string>;
}

// useForm 함수 선언 및 구현
function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>(props?: UseFormProps<TFieldValues, TContext, TTransformedValues>) {
  // props가 없으면 기본값 사용
  const { initialValues = {} as TFieldValues, validate = (() => ({} as Record<keyof TFieldValues, string>)) } = props || {};

  const [values, setValues] = useState<TFieldValues>(initialValues);
  const [errors, setErrors] = useState<Record<keyof TFieldValues, string>>({} as Record<keyof TFieldValues, string>);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: keyof TFieldValues, text: string) => {
    setValues({
      ...values,
      [name]: text, 
    });
  };
  
  const handleBlur = (name: keyof TFieldValues) => {
    setTouched({ 
        ...touched, 
        [name as string]: true,
    });
  };

  const getInputProps = (name: keyof TFieldValues) => {
    const value = values[name];

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      handleChange(name, e.currentTarget.value);
    
    const onBlur = () => handleBlur(name);
  
    return { value, onChange, onBlur }
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values, validate]); 

  return { values, errors, touched, getInputProps }
}

export default useForm;