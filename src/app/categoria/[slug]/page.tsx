import React from 'react';
import CategoryClient from './CategoryClient';

export default function Page({ params }: { params: { slug: string } }) {
  return <CategoryClient params={params} />;
}
