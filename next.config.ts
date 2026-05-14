import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Prevent webpack from bundling Amplify packages server-side.
  // @aws-amplify/api-graphql creates a singleton at module level that throws
  // "Neither apiKey nor config.authenticator provided" if Amplify.configure()
  // hasn't been called first. Marking these as external keeps them out of
  // server chunks (they're still bundled normally for the client/browser).
  serverExternalPackages: [
    'aws-amplify',
    '@aws-amplify/api',
    '@aws-amplify/api-graphql',
    '@aws-amplify/api-rest',
    '@aws-amplify/auth',
    '@aws-amplify/ui-react',
    '@aws-amplify/ui-react-core',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
    ],
  },
};

export default nextConfig;
