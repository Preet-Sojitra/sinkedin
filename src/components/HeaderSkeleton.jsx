export default function HeaderSkeleton() {
  return (
    <header className="bg-dark-secondary border-b border-dark-border px-0 py-3 animate-pulse">
      <div className="max-w-[800px] mx-auto flex items-center justify-between px-6">
        <div className="h-8 w-32 bg-dark-border rounded-md"></div>

        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-dark-border rounded-md"></div>
          <div className="h-10 w-10 bg-dark-border rounded-full"></div>
        </div>
      </div>
    </header>
  )
}
