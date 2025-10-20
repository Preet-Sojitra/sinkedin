import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-secondary border border-[color:var(--accent)]/30 rounded-lg p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-light mb-2">Authentication Error</h1>
          <p className="text-light-secondary">
            We couldn't complete your authentication request. This might be because:
          </p>
        </div>

        <div className="text-left mb-6 space-y-2 text-sm text-light-secondary">
          <p>• The authentication code has expired</p>
          <p>• The authentication was cancelled</p>
          <p>• There was a configuration issue</p>
          <p>• Supabase credentials are not set up</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full bg-accent hover:bg-red-700 text-light px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-transparent border border-[color:var(--accent)] text-light px-6 py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>

        <div className="mt-6 p-4 bg-[rgba(224,49,49,0.1)] border border-[color:var(--accent)]/30 rounded-lg">
          <p className="text-xs text-light-secondary">
            <strong>Developer Note:</strong> If you're running this locally, make sure your Supabase
            environment variables are properly configured in your{" "}
            <code className="bg-dark px-1 py-0.5 rounded">.env.local</code> file.
          </p>
        </div>
      </div>
    </div>
  );
}
