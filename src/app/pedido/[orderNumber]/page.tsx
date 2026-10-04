import React from 'react';
import OrderClient from './OrderClient';

export default function Page({ params }: { params: { orderNumber: string } }) {
  return <OrderClient params={params} />;
}
