import { useState, type ChangeEvent, type FormEvent } from 'react';

// 폼의 초기값, 유효성 검사 함수, 제출 콜백 함수의 타입을 정의합니다.
interface UseFormArgs<T> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void;
}

// useForm 커스텀 훅
export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormArgs<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // 입력 필드의 포커스가 해제될 때 호출되는 함수 (onBlur 이벤트)
  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // 해당 필드를 'touched' 상태로 만듭니다.
    setTouched((prev) => ({ ...prev, [name]: true }));
    // 포커스가 해제될 때도 유효성 검사를 실행하여 즉시 피드백을 줍니다.
    const validationErrors = validate(values);
    setErrors(validationErrors);
  };

  // 입력 필드의 값이 변경될 때 호출되는 함수 (onChange 이벤트)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // 폼이 제출될 때 호출되는 함수 (onSubmit 이벤트)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작(페이지 새로고침)을 막습니다.
    
    // 모든 필드를 'touched' 상태로 만들어, 사용자가 입력을 시도했음을 표시합니다.
    setTouched(
      Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Partial<Record<keyof T, boolean>>)
    );

    const validationErrors = validate(values);
    setErrors(validationErrors);

    // 유효성 검사를 통과하면 (에러 객체가 비어있으면) onSubmit 콜백을 실행합니다.
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  };
};

