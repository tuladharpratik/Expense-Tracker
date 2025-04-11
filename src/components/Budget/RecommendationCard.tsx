import { formatCurrency } from '@/utils/utils';
import { Icon } from '@iconify/react';
import { TypeOverspending } from '@/lib/algorithms/recommendationEngine';

interface RecommendationCardProps {
  recommendation: {
    type: 'overspending';
    severity: 'warning' | 'critical' | 'info';
    message: string;
    typeOverspending: TypeOverspending[];
  };
}

const severityStyles = {
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  critical: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const severityIcons = {
  warning: { icon: 'material-symbols:warning-outline', className: 'text-yellow-400' },
  critical: { icon: 'material-symbols:error-outline', className: 'text-red-400' },
  info: { icon: 'material-symbols:info-outline', className: 'text-blue-400' },
};

const TypeOverspendingDetails = ({ typeSpending }: { typeSpending: TypeOverspending }) => {
  // Take top 3 categories
  const topCategories = typeSpending.categories.slice(0, 3);

  return (
    <div className="mt-4 border-t border-gray-100 pt-3">
      <h4 className="text-sm font-medium text-gray-700 capitalize">{typeSpending.type}</h4>
      
      {/* Budget Overview */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Allocated:</span>
          <span className="ml-2">{formatCurrency(typeSpending.budgetLimit)}</span>
        </div>
        <div>
          <span className="text-gray-500">Spent:</span>
          <span className="ml-2">{formatCurrency(typeSpending.totalSpent)}</span>
        </div>
      </div>

      {/* Overspent Amount */}
      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
        <span className="font-medium">Amount Over Budget:</span>
        <span className="text-red-600 font-medium">
          +{formatCurrency(typeSpending.totalSpent - typeSpending.budgetLimit)}
        </span>
      </div>

      {/* Top Categories List */}
      <div className="mt-2">
        <p className="text-xs font-medium text-gray-500">Top spending categories:</p>
        <ul className="mt-1 space-y-1">
          {topCategories.map((cat) => (
            <li key={cat.category} className="text-sm flex justify-between">
              <span>{cat.category}</span>
              <span className="text-gray-600">{formatCurrency(cat.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const { severity, typeOverspending } = recommendation;
  const { icon, className } = severityIcons[severity];

  return (
    <div className={`rounded-md border p-4 ${severityStyles[severity]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon icon={icon} className={`h-5 w-5 ${className}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            Overspending detected in {typeOverspending.map(t => t.type).join(' and ')}
          </h3>
          {typeOverspending.map((typeSpending) => (
            <TypeOverspendingDetails key={typeSpending.type} typeSpending={typeSpending} />
          ))}
        </div>
      </div>
    </div>
  );
};
