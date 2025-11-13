import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Akari Nihongo
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Anime-inspired platform to master your JLPT level with an adaptive planner, difficulty highlighting, and a smart translator.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/signup" className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium shadow">
            Get Started
          </Link>
          <Link href="/login" className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
            Sign In
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl">
          <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1400&auto=format&fit=crop" alt="Tokyo night cityscape" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow">
          <div className="text-sm">Dark Mode ? Anime Theme ? JLPT Aware</div>
        </div>
      </div>
    </div>
  );
}
