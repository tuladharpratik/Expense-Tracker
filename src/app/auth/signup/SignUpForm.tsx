'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { Checkbox } from '@/components/Checkbox/Checkbox';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography/Typography';
import Link from 'next/link';
import { useCreateUser } from '@/lib/hooks';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useFormValidation from '@/lib/custom_hooks/useFormValidation';
import { registerSchema } from '@/schemas/login.schema';
import { Button } from '@/components/Button/Button';
interface FormField {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  showIcon?: string;
  hideIcon?: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formFields = [
  {
    label: 'Username',
    type: 'text',
    name: 'username',
    placeholder: 'Enter your username',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
  },
  {
    label: 'Create Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    showIcon: 'mdi:eye',
    hideIcon: 'mdi:eye-off',
  },
  {
    label: 'Confirm Password',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Repeat your password',
    showIcon: 'mdi:eye',
    hideIcon: 'mdi:eye-off',
  },
];

export default function SignUpForm() {
  const router = useRouter();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { formErrors, isSubmitting, validate } = useFormValidation(registerSchema);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const togglePasswordVisibility = (field: string) => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const getInputType = (field: FormField) => {
    if (field.name === 'password' && showPassword) return 'text';
    if (field.name === 'confirmPassword' && showConfirmPassword) return 'text';
    return field.type;
  };

  const getIcon = (field: FormField) => {
    if (field.name === 'password') {
      return showPassword ? field.showIcon : field.hideIcon;
    }
    if (field.name === 'confirmPassword') {
      return showConfirmPassword ? field.showIcon : field.hideIcon;
    }
    return undefined;
  };

  const { mutate: signup, error: signupError } = useCreateUser({
    onSuccess: async () => {
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (signInResult?.ok) {
        router.push('/dashboard');
        toast.success('Sign up successful!');
      } else {
        toast.error(signInResult?.error);
        console.error('Signin failed:', signInResult?.error);
      }
    },
  });

  useEffect(() => {
    if (signupError) {
      const _err = signupError as { info?: { code?: string } };
      const errMsg =
        _err?.info?.code === 'P2002' ? 'Email already exists' : `Unexpected error occurred: ${JSON.stringify(_err)}`;

      toast.error(errMsg);
    }
  }, [signupError]);

  function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const { valid, data } = validate(formData);
    if (!valid) {
      Object.entries(data || {}).forEach(([key]) => {
        toast.error(formErrors[key]);
      });
      setIsLoading(false);
      return;
    }

    const { username, email, password } = data;

    signIn('credentials', {
      redirect: false,
      email,
      password,
      username,
      isSignUp: 'true',
    })
      .then((result) => {
        if (result?.error) {
          toast.error(result.error);
        } else {
          router.push('/dashboard');
          toast.success('Sign up successful!');
        }
      })
      .catch((error) => {
        console.error('Signup error:', error);
        toast.error('Failed to create account');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <form className="mt-8" onSubmit={handleSignup} method="post">
        <div className="flex flex-col gap-2">
          {formFields.map((field, index) => (
            <Input
              onChange={handleInputChange}
              value={formData[field.name as keyof FormData]}
              key={index}
              name={field.name}
              type={getInputType(field)}
              placeholder={field.placeholder}
              label={field.label}
              icon={getIcon(field)}
              iconClick={() => togglePasswordVisibility(field.name)}
              iconPlacement="right"
              error={formErrors[field.name]}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center space-x-2">
          <Checkbox
            id="terms"
            className="peer"
            onClick={() => setHasAcceptedTerms((prev) => !prev)}
            checked={hasAcceptedTerms}
            disabled={isLoading}
          />
          <label htmlFor="terms" className="text-sm font-medium leading-none text-neutral-400">
            Accept terms and conditions
          </label>
        </div>

        <Button
          disabled={!hasAcceptedTerms || isSubmitting || isLoading}
          type="submit"
          variant="primary"
          className="mt-8 w-full rounded-full text-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>

      <Typography variant={'caption'} className="mt-12 text-center text-neutral-400">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-primary-600 underline">
          Sign in
        </Link>
      </Typography>
    </>
  );
}
