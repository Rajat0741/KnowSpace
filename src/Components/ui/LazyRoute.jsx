import { Suspense } from 'react';
import LoadingFallback from './LoadingFallback';

const LazyRoute = ({ children, fallbackMessage }) => (
  <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
    {children}
  </Suspense>
);

export default LazyRoute;
