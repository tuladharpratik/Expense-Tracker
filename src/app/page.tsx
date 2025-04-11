import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/Button/Button';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/Sheet/Sheet';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed z-50 w-full border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {/* <Icon icon="cryptocurrency:usd" className="h-8 w-8 text-blue-600" /> */}
            <span className="ml-2 text-xl font-bold">PFMS</span>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Icon icon="solar:hamburger-menu-broken" className="text-3xl text-primary-600" />
              </SheetTrigger>
              <SheetContent side={'left'} className="flex w-[300px] flex-col bg-white">
                <SheetHeader>
                  <SheetTitle>PFMS</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <a href="#features" className="text-gray-600 hover:text-blue-600">
                    Features
                  </a>
                  <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">
                    How it Works
                  </a>
                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 md:flex">
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">
              How it Works
            </a>
            <Link href="/auth/signin">
              <Button variant="outline" className="mr-2">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="mr-2">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pb-20 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Take Control of Your Finances
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Track expenses, set budgets, and achieve your financial goals with our comprehensive personal finance
            management tools.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg">
                Get Started For Free
                <Icon icon="material-symbols:arrow-right-alt" className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need to Manage Your Money</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-200">
                  <Icon icon={feature.icon} className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-200">
                  <span className="text-2xl font-bold text-primary-600">{index + 1}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Start Your Financial Journey Today</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of users who are already managing their finances smarter.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-1000 py-12 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center">
                {/* <Icon icon="cryptocurrency:usd" className="h-6 w-6" /> */}
                <span className="ml-2 text-lg font-bold">PFMS</span>
              </div>
              <p className="text-sm">Making personal finance management easy and accessible for everyone.</p>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tutorial
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} PFMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature cards data
const features = [
  {
    icon: 'mdi:chart-pie',
    title: 'Expense Tracking',
    description: 'Easily track and categorize your daily expenses and income in real-time.',
  },
  {
    icon: 'mdi:target',
    title: 'Budget Planning',
    description: 'Set and manage budgets for different categories to reach your financial goals.',
  },
  {
    icon: 'mdi:chart-timeline-variant',
    title: 'Visual Analytics',
    description: 'Interactive charts and graphs to visualize your spending patterns and financial trends.',
  },
  {
    icon: 'mage:light-bulb',
    title: 'Recommendations',
    description: 'Get personalized recommendations for your financial decisions.',
  },
  {
    icon: 'mdi:shield',
    title: 'Secure & Private',
    description: 'High security to keep your financial data safe and protected.',
  },
  {
    icon: 'mdi:currency-usd',
    title: 'Financial Goals',
    description: 'Set and track your savings goals.',
  },
];

// How it works steps
const steps = [
  {
    title: 'Create an Account',
    description: 'Sign up for free and set up your profile in minutes.',
  },
  {
    title: 'Add Your Transcations',
    description: 'Add your transactions.',
  },
  {
    title: 'Track & Optimize',
    description: 'Monitor your spending, set budgets, and reach your financial goals.',
  },
];

export default LandingPage;
