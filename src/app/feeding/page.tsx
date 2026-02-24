import { getFeedings } from "@/actions/feeding";
import { FEEDING_TYPES } from "@/lib/constants";
import { FeedingPageClient } from "./page-client";

export default async function FeedingPage() {
  const feedings = await getFeedings();

  // Summary stats
  const totalCount = feedings.length;
  const totalMl = feedings.reduce((sum, f) => sum + (f.amount || 0), 0);
  const lastFeeding = feedings.length > 0 ? feedings[0] : null;
  const lastFeedingLabel = lastFeeding
    ? FEEDING_TYPES[lastFeeding.type as keyof typeof FEEDING_TYPES] || lastFeeding.type
    : null;

  return (
    <FeedingPageClient
      feedings={feedings}
      totalCount={totalCount}
      totalMl={totalMl}
      lastFeeding={lastFeeding}
      lastFeedingLabel={lastFeedingLabel}
    />
  );
}
