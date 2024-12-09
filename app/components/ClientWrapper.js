'use client';
import dynamic from 'next/dynamic';

const FluidSimulation = dynamic(() => import('./FluidSimulation'), {
  ssr: false
});

export default function ClientWrapper() {
  return <FluidSimulation />;
}
