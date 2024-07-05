type CustomEnvKeys =
  // Dev URL
  | 'NEXT_PUBLIC_URL'

  // Owner Secret
  | 'NEXT_PUBLIC_OWNER_BEARER_TOKEN'

  // Email
  | 'EMAIL_ADDRESS'
  | 'EMAIL_PASSWORD'
  | 'EMAIL_TARGET'

  // OAuth Authentication
  | 'NEXTAUTH_URL'
  | 'NEXTAUTH_SECRET'
  | 'GITHUB_ID'
  | 'GITHUB_SECRET'

  // IP Address Salt
  | 'IP_ADDRESS_SALT'

  // Firebase
  | 'API_KEY'
  | 'AUTH_DOMAIN'
  | 'PROJECT_ID'
  | 'STORAGE_BUCKET'
  | 'MESSAGING_SENDER_ID'
  | 'APP_ID'

  // Database
  | 'DATABASE_URL'

  // GitHub
  | 'GITHUB_TOKEN'

  // Spotify
  | 'SPOTIFY_CLIENT_ID'
  | 'SPOTIFY_CLIENT_SECRET'
  | 'SPOTIFY_REFRESH_TOKEN';

type CustomEnv = Record<CustomEnvKeys, string>;

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ProcessEnv extends CustomEnv {}
}
