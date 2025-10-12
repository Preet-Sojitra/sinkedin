/** @type {import('next').NextConfig} */
const remotePatterns = [];

if (process.env.SUPABASE_AVATARS_URL) {
  try {
    const url = new URL(process.env.SUPABASE_AVATARS_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      // allow any path under the bucket
      pathname: `${url.pathname.replace(/\/$/, '')}/:path*`,
    });
  } catch (err) {
    // If the env value is invalid, don't crash the Next config. Log and continue with an empty list.
    // eslint-disable-next-line no-console
    console.warn('Invalid SUPABASE_AVATARS_URL, ignoring image remote pattern:', err?.message || err);
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
