/**
 * Lightweight fallback shown while lazy-loaded route chunks are fetched.
 */
export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-400"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}
