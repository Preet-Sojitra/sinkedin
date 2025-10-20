export default function PostCardSkeleton() {
  return (
    <div className="bg-dark-secondary border border-[color:var(--accent)]/20 rounded-lg p-5 md:p-6 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-dark-border rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-dark-border rounded w-1/3"></div>
          <div className="h-3 bg-dark-border rounded w-1/4"></div>
        </div>
      </div>

      {/* Skeleton Content */}
      <div className="space-y-2.5 mb-4">
        <div className="h-4 bg-dark-border rounded w-full"></div>
        <div className="h-4 bg-dark-border rounded w-5/6"></div>
        <div className="h-4 bg-dark-border rounded w-4/5"></div>
      </div>

      {/* Skeleton Actions */}
      <div className="flex gap-3 pt-4 border-t border-dark-border mb-4">
        <div className="h-8 w-14 bg-dark-border rounded-md"></div>
        <div className="h-8 w-14 bg-dark-border rounded-md"></div>
        <div className="h-8 w-14 bg-dark-border rounded-md"></div>
        <div className="h-8 w-14 bg-dark-border rounded-md"></div>
      </div>

      {/* Skeleton Comment Input */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-dark-border rounded-full flex-shrink-0"></div>
        <div className="bg-dark w-full h-10 rounded-lg border border-dark-border"></div>
      </div>
    </div>
  );
}
