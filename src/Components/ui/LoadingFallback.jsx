// Optimized individual icon import to reduce bundle size
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

const LoadingFallback = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-200 dark:bg-blue-800 opacity-75"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {message}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preparing your content...
        </p>
      </div>
    </div>
  );
};

export default LoadingFallback;
