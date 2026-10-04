import React from 'react';
import ProductClient from './ProductClient';

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductClient params={params} />;
}
