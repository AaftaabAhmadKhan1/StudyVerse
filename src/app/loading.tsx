export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#030014' }}
    >
      {/* Skeleton layout: sidebar + main content */}
      <div className="w-full max-w-7xl mx-auto flex gap-6 px-4 py-8 animate-pulse">
        {/* Sidebar skeleton */}
        <div
          className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0 rounded-2xl p-4"
          style={{ background: 'rgba(15,10,31,0.6)', border: '1px solid rgba(139,92,246,0.08)' }}
        >
          {/* Logo */}
          <div className="h-10 w-32 rounded-xl mb-4" style={{ background: 'rgba(124,58,237,0.15)' }} />
          {/* Nav items */}
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }} />
              <div className="h-4 rounded-lg flex-1" style={{ background: 'rgba(255,255,255,0.05)', maxWidth: `${60 + i * 10}px` }} />
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Hero banner */}
          <div
            className="h-40 md:h-56 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1))' }}
          />

          {/* Section title + cards row */}
          <div>
            <div className="h-6 w-40 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-2xl"
                  style={{ background: 'rgba(15,10,31,0.6)', border: '1px solid rgba(139,92,246,0.08)' }}
                />
              ))}
            </div>
          </div>

          {/* Second section */}
          <div>
            <div className="h-6 w-48 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-2xl"
                  style={{ background: 'rgba(15,10,31,0.6)', border: '1px solid rgba(139,92,246,0.08)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
