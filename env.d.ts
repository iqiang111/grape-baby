interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
}

declare module "@opennextjs/cloudflare" {
  function getCloudflareContext(): Promise<{ env: CloudflareEnv; ctx: ExecutionContext }>;
}
