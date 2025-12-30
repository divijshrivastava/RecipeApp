export const environment = {
  production: false,
  appwriteEndpoint: '',
  appwriteProjectId: '',
  appwriteDatabaseId: '',
  appwriteRecipeCollectionId: '',
  appwriteStorageBucketId: 'default',
  // Optional: community collections (configure in Appwrite to enable)
  appwriteFavoritesCollectionId: '',
  appwriteRatingsCollectionId: '',
  // Admin config
  // Option A: Appwrite Team ID whose members are super-admins
  appwriteAdminTeamId: '',
  // Option B (fallback): explicit user ids that are super-admins
  superAdminUserIds: [] as string[],
};
