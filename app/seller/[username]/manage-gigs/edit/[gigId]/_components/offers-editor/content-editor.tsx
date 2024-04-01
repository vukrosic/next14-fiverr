import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { Clock, RefreshCcw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Label } from "@/components/ui/label"
import { useAction } from "convex/react"

interface ContentEditorProps {
    offer?: Doc<"offers">;
    gigId: Id<"gigs">;
    tier: "Basic" | "Standard" | "Premium";
}

export const ContentEditor = ({
    offer,
    gigId,
    tier
}: ContentEditorProps) => {
    const [title, setTitle] = useState<string>(offer?.title || "");
    const [description, setDescription] = useState<string>(offer?.description || "");
    const [price, setPrice] = useState<number>(offer?.price || 5);
    const [revisions, setRevisions] = useState<number>(offer?.revisions || 1);
    const [deliveryDays, setDeliveryDays] = useState<number>(offer?.delivery_days || 2);
    const addOffer = useAction(api.offers.add);

    const handleSave = async () => {
        try {
            await addOffer({
                gigId,
                title,
                description,
                tier,
                price,
                delivery_days: deliveryDays,
                revisions,
            });
            toast.success("Offer saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save offer");
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Title:</Label>
                <Input id="title" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="">
                <Label htmlFor="price">Price (USD):</Label>
                <Input id="price" placeholder="price" type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
            </div>
            <div>
                <Label htmlFor="description">Description:</Label>
                <Input id="description" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="delivery">Number of days for delivery:</Label>
                <Input id="delivery" placeholder="delivery days" type="number" value={deliveryDays} onChange={(e) => setDeliveryDays(parseInt(e.target.value))} />
            </div>
            <div>
                <Label htmlFor="revisions">Number of revisions:</Label>
                <Input id="revisions" placeholder="revisions" type="number" value={revisions} onChange={(e) => setRevisions(parseInt(e.target.value))} />
            </div>


            <Button className="w-full" onClick={handleSave}>Save</Button>
        </div>
    )
}