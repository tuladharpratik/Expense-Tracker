'use client';

import { useSession } from 'next-auth/react';
import { RecommendationCard } from '@/components/Budget/RecommendationCard';
import { useBudgetRecommendations } from '@/lib/custom_hooks/useBudgetRecommendations';

export default function RecommendationsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  const { recommendations, isLoading } = useBudgetRecommendations(userId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Spending Trends</h1>
        <div className="flex items-center justify-center p-8">
          <span className="ml-2 text-gray-600">Loading trends...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Spending Trends</h1>
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard key={index} recommendation={recommendation} />
        ))}
        {recommendations.length === 0 && (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p className="text-gray-500">No spending trends available at this time. Keep tracking your spending!</p>
          </div>
        )}
      </div>
    </div>
  );
}
