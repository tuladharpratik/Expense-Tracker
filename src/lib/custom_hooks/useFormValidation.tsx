import { validateFormData } from '@/utils/validation';
import { useState } from 'react';
import { z } from 'zod'; // Assuming you're using Zod

const useFormValidation = <T extends z.ZodTypeAny>(validationSchema: T) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (formData: z.infer<T>) => {
    setIsSubmitting(true);
    setFormErrors({}); // Clear previous errors

    const { errors, data } = validateFormData(validationSchema, formData);

    if (errors) {
      const errorObj: { [key: string]: string } = {};

      // Loop over the error fields using Object.entries()
      Object.entries(errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          errorObj[field] = messages[0]; // Use the first error message per field
        }
      });

      setFormErrors(errorObj); // Set the field-specific errors
      setIsSubmitting(false);
      return { valid: false, errors, data: null }; // Return errors along with validation result
    }

    setIsSubmitting(false);
    return { valid: true, errors: null, data }; // Return data if valid and no errors
  };

  return { formErrors, isSubmitting, validate };
};

export default useFormValidation;
