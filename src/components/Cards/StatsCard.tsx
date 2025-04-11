'use client';

import React from 'react';
import Typography from '../Typography/Typography';

interface CardInfoType {
  title: string;
  data: number;
}
export default function StatsCard({ cardInfo }: { cardInfo: CardInfoType }) {
  const { title, data } = cardInfo;

  return (
    <div className="flex-1 rounded-lg border border-neutral-200 px-4 py-2">
      <Typography variant={'body1'} element={'p'} className="font-semibold tracking-wide">
        {title}
      </Typography>
      <Typography variant={'h4'} element={'h4'} className="mt-2">
        Rs. {data.toFixed(2)}
      </Typography>
    </div>
  );
}
