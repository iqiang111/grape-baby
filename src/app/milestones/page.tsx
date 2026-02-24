import { Star } from "lucide-react";
import { getMilestones } from "@/actions/milestones";
import { MilestoneTimeline } from "@/components/milestones/milestone-timeline";
import { MilestonePageClient } from "./page-client";

export default async function MilestonesPage() {
  const milestones = await getMilestones();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="h-7 w-7 text-gray-500" />
          成长里程碑
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {milestones.length > 0
            ? `已记录 ${milestones.length} 个珍贵瞬间`
            : "记录小葡萄的每一个成长瞬间"}
        </p>
      </div>

      {/* Timeline */}
      <MilestoneTimeline milestones={milestones} />

      {/* Floating add button + form */}
      <MilestonePageClient />
    </div>
  );
}
