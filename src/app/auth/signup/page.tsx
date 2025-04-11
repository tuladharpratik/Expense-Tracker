import Typography from '@/components/Typography/Typography';
import React from 'react';
import SignUpForm from './SignUpForm';

export default function page() {
  return (
    <div className="">
      <div>
        <Typography element={'h2'} variant={'h2'} className="text-center">
          Welcome to Expense Tracker
        </Typography>
        <Typography className="mt-1 text-center text-neutral-300">
          {' '}
          Sign up and start managing your finances now.{' '}
        </Typography>
      </div>
      <SignUpForm />
    </div>
  );
}
