import { Doc } from "@/convex/_generated/dataModel";

interface GigCardProps {
    gig: Doc<"gigs">;
}

export const GigCard = ({
    gig
}: GigCardProps) => {
    return (
        <div>
            {gig.title}
        </div>
    )
}