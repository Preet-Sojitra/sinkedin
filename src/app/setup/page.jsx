import Link from "next/link";
import { AlertCircle, Database, Key, CheckCircle } from "lucide-react";

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-light mb-4">
            S
            <strike className="font-bold text-accent" style={{ color: "#e03131" }}>
              in
            </strike>
            kedIn Setup
          </h1>
          <p className="text-light-secondary text-lg">
            Quick setup guide to get your local development environment running
          </p>
        </div>

        <div className="bg-dark-secondary border border-[color:var(--accent)]/30 rounded-lg p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-light mb-2">
                Supabase Configuration Required
              </h2>
              <p className="text-light-secondary">
                To use authentication, database, and storage features, you need to set up Supabase.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="border-l-2 border-accent pl-6">
              <h3 className="text-xl font-semibold text-light mb-3 flex items-center gap-2">
                <span className="bg-accent text-dark w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Choose Your Setup Method
              </h3>
              <div className="space-y-4">
                <div className="bg-dark border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-light mb-2">
                    ✅ Recommended: Local Development with Supabase CLI
                  </h4>
                  <p className="text-light-secondary text-sm mb-3">
                    Run Supabase locally using Docker - no cloud setup needed!
                  </p>
                  <div className="space-y-2 text-sm text-light-secondary">
                    <p>
                      1. Install{" "}
                      <a
                        href="https://www.docker.com/products/docker-desktop/"
                        className="text-accent hover:underline"
                        target="_blank"
                      >
                        Docker Desktop
                      </a>
                    </p>
                    <p>
                      2. Install{" "}
                      <a
                        href="https://supabase.com/docs/guides/cli"
                        className="text-accent hover:underline"
                        target="_blank"
                      >
                        Supabase CLI
                      </a>
                      :
                    </p>
                    <pre className="bg-black p-3 rounded mt-2 overflow-x-auto">
                      <code className="text-accent">npm install -g supabase</code>
                    </pre>
                    <p>3. Start Supabase locally:</p>
                    <pre className="bg-black p-3 rounded mt-2 overflow-x-auto">
                      <code className="text-accent">supabase start</code>
                    </pre>
                  </div>
                </div>

                <div className="bg-dark border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-light mb-2">
                    ☁️ Alternative: Cloud Supabase Project
                  </h4>
                  <p className="text-light-secondary text-sm mb-3">
                    Use a hosted Supabase project (free tier available)
                  </p>
                  <div className="space-y-2 text-sm text-light-secondary">
                    <p>
                      1. Create account at{" "}
                      <a
                        href="https://supabase.com"
                        className="text-accent hover:underline"
                        target="_blank"
                      >
                        supabase.com
                      </a>
                    </p>
                    <p>2. Create a new project</p>
                    <p>3. Get your project URL and anon key from Settings → API</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-2 border-accent pl-6">
              <h3 className="text-xl font-semibold text-light mb-3 flex items-center gap-2">
                <span className="bg-accent text-dark w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Create Environment File
              </h3>
              <p className="text-light-secondary mb-3">
                Create a file named <code className="bg-dark px-2 py-1 rounded">.env.local</code> in
                your project root:
              </p>
              <pre className="bg-black p-4 rounded overflow-x-auto">
                <code className="text-accent text-sm">
                  {`# For Local Supabase CLI:
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"

# For Cloud Supabase:
# NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="your-cloud-anon-key"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"`}
                </code>
              </pre>
              <p className="text-xs text-light-secondary mt-3">
                💡 The anon key is displayed when you run{" "}
                <code className="bg-dark px-1 py-0.5 rounded">supabase start</code>
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-l-2 border-accent pl-6">
              <h3 className="text-xl font-semibold text-light mb-3 flex items-center gap-2">
                <span className="bg-accent text-dark w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Run Database Migrations
              </h3>
              <p className="text-light-secondary mb-3">Apply the database schema:</p>
              <pre className="bg-black p-4 rounded overflow-x-auto">
                <code className="text-accent text-sm">
                  {`# If using Supabase CLI (already done by 'supabase start')
supabase db reset

# If using Cloud Supabase, run migrations from dashboard
# or link your project: supabase link --project-ref your-project-ref`}
                </code>
              </pre>
            </div>

            {/* Step 4 */}
            <div className="border-l-2 border-accent pl-6">
              <h3 className="text-xl font-semibold text-light mb-3 flex items-center gap-2">
                <span className="bg-accent text-dark w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Restart Development Server
              </h3>
              <p className="text-light-secondary mb-3">
                Stop and restart your Next.js dev server to load the new environment variables:
              </p>
              <pre className="bg-black p-4 rounded overflow-x-auto">
                <code className="text-accent text-sm">npm run dev</code>
              </pre>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-light mb-1">You're All Set!</h4>
                <p className="text-light-secondary text-sm">
                  Once configured, refresh this page and you should be able to login and use all
                  features.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-light mb-3">Helpful Resources</h3>
          <div className="space-y-2 text-sm">
            <a
              href="https://github.com/04shubham7/sinkedin/blob/main/README.md"
              className="block text-accent hover:underline"
              target="_blank"
            >
              📖 Full Setup Guide in README.md
            </a>
            <a
              href="https://supabase.com/docs"
              className="block text-accent hover:underline"
              target="_blank"
            >
              📚 Supabase Documentation
            </a>
            <a
              href="https://discord.gg/jaD2upCxhB"
              className="block text-accent hover:underline"
              target="_blank"
            >
              💬 Join our Discord for Help
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-light-secondary hover:text-light transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
