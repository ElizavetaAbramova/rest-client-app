'use client';

import { Suspense, lazy, useMemo, createElement } from 'react';
import type {
  ComponentType,
  ReactNode,
  LazyExoticComponent,
  PropsWithRef,
} from 'react';
import { /*useAuthGate, */ type AuthGateOptions } from '@/hooks/useAuthGate';

type Props<P extends object = Record<string, unknown>> = {
  load: () => Promise<{ default: ComponentType<P> }>;
  fallback?: ReactNode;
  unauthorized?: ReactNode;
  opts?: AuthGateOptions;
  props?: P;
};

export default function AuthGate<P extends object = Record<string, unknown>>({
  load,
  fallback = null,
  // unauthorized = null,
  // opts,
  props,
}: Props<P>) {
  // const { status, authed } = useAuthGate(opts);

  const LazyComp = useMemo<LazyExoticComponent<ComponentType<P>>>(
    () => lazy(load) as unknown as LazyExoticComponent<ComponentType<P>>,
    [load]
  );

  // if (status === 'checking') return <>{fallback}</>;
  // if (!authed) return <>{unauthorized}</>;

  return (
    <Suspense fallback={fallback}>
      {createElement(LazyComp, props as PropsWithRef<P>)}
    </Suspense>
  );
}
