'use client';
import React, { useEffect, useState } from 'react';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography/Typography';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { validateFormData } from '@/utils/validation';
import { loginSchema } from '@/schemas/login.schema';
import useFormValidation from '@/lib/custom_hooks/useFormValidation';
import { Button } from '@/components/Button/Button';

const formFields = [
  {
    label: 'Email',
    name: 'email',
    type: 'text',
    placeholder: 'Enter your email',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    showIcon: 'mdi:eye',
    hideIcon: 'mdi:eye-off',
  },
];

interface FormData {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const { formErrors, isSubmitting, validate } = useFormValidation(loginSchema);

  useEffect(() => {
    const keys = Object.keys(formErrors);
    if (keys.length) {
      keys.forEach((key) => {
        toast.error(formErrors[key]);
      });
    }
  }, [formErrors]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const { valid, data } = validate(formData);

    if (!valid) {
      Object.entries(data || {}).forEach(([key, value]) => {
        toast.error(formErrors[key]);
      });
      setIsLoading(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (signInResult?.ok) {
      toast.success('Sign in successful!');
      router.push('/dashboard');
    } else {
      toast.error('Sign in failed! Please try again.');
    }
    setIsLoading(false);
  }

  return (
    <>
      <form className="mt-8" onSubmit={handleSignIn}>
        <div className="flex flex-col gap-2">
          {formFields.map((field, index) => (
            <div key={index}>
              <Input
                onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                value={formData[field.name as keyof FormData]}
                name={field.name}
                type={field.type === 'password' && showPassword ? 'text' : field.type}
                placeholder={field.placeholder}
                label={field.label}
                icon={field.type === 'password' ? (showPassword ? field.showIcon : field.hideIcon) : undefined}
                iconClick={field.type === 'password' ? togglePasswordVisibility : undefined}
                iconPlacement="right"
                error={formErrors[field.name] || ''}
                disabled={isLoading}
              />
            </div>
          ))}
        </div>

        <Button
          disabled={isLoading || isSubmitting}
          type="submit"
          variant="primary"
          className="mt-8 w-full rounded-full text-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <Typography variant="caption" className="mt-12 text-center text-neutral-400">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-primary-600 underline">
          Sign up
        </Link>
      </Typography>
    </>
  );
}
