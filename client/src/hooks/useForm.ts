import { useState } from "react";

type ValidatorFn = (value: string) => string | null;

export function useForm(initialValues: Record<string, string>, validators: Record<string, ValidatorFn[]>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // 즉시 검증
    if (validators[name]) {
      for (let validate of validators[name]) {
        const err = validate(value);
        if (err) {
          setErrors((prev) => ({ ...prev, [name]: err }));
          return;
        }
      }
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isValid = Object.values(errors).every((err) => err === null);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
  };
}
