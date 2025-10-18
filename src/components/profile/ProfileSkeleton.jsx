function ProfileSkeleton() {
  return (
    <main className="max-w-[800px] mx-auto my-8 px-6">
      <div className="bg-dark-secondary border border-dark-border rounded-lg p-8 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-32 h-32 bg-dark-border rounded-full flex-shrink-0"></div>

          <div className="flex-1 text-center sm:text-left">
            <div className="h-8 bg-dark-border rounded w-48 mb-2"></div>
            <div className="h-6 bg-dark-border rounded w-64 mb-3"></div>
            <div className="h-4 bg-dark-border rounded w-40"></div>

            <div className="mt-6 h-10 w-44 bg-dark-border rounded-lg"></div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-dark-border">
          <div className="h-7 bg-dark-border rounded w-24 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-dark-border rounded w-full"></div>
            <div className="h-4 bg-dark-border rounded w-full"></div>
            <div className="h-4 bg-dark-border rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfileSkeleton
