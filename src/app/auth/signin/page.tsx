import Typography from '@/components/Typography/Typography';
import React from 'react';
import SignInForm from './SignInForm';

export default function page() {
  return (
    <div className="">
      <div>
        <Typography element={'h2'} variant={'h2'} className="text-center">
          {' '}
          Sign In{' '}
        </Typography>
        <Typography className="mt-1 text-center text-neutral-300"> Welcome there! Sign in to continue </Typography>
      </div>
      <SignInForm />
    </div>
  );
}
