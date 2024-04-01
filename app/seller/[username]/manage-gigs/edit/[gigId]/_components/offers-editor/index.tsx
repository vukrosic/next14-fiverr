import { Doc, Id } from "@/convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clipboard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ContentEditor } from "./content-editor";
import { useQuery } from "convex/react";

interface OffersEditorProps {
    gigId: Id<"gigs">;
}

export const OffersEditor = ({
    gigId
}: OffersEditorProps) => {
    const offers = useQuery(api.offers.get, { gigId });

    if (offers === undefined) return <div>Loading offers...</div>;

    const basicOffer = offers.find((offer) => offer.tier === "Basic");
    const standardOffer = offers.find((offer) => offer.tier === "Standard");
    const premiumOffer = offers.find((offer) => offer.tier === "Premium");
    return (
        <Tabs defaultValue="Basic" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="Basic">
                    Basic
                </TabsTrigger>
                <TabsTrigger value="Standard">
                    Standard
                </TabsTrigger>
                <TabsTrigger value="Premium">
                    Premium
                </TabsTrigger>
            </TabsList>
            <TabsContent value="Basic">
                <ContentEditor gigId={gigId} offer={basicOffer} tier="Basic" />
            </TabsContent>
            <TabsContent value="Standard">
                <ContentEditor gigId={gigId} offer={standardOffer} tier="Standard" />
            </TabsContent>
            <TabsContent value="Premium">
                <ContentEditor gigId={gigId} offer={premiumOffer} tier="Premium" />
            </TabsContent>
        </Tabs>
    );
};