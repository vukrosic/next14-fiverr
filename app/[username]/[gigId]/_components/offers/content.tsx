import { Loading } from "@/components/auth/loading"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useAction, useQuery } from "convex/react"
import { Clock, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OffersProps {
    offer: Doc<"offers">
    sellerId: Id<"users">
    editUrl: string
}

export const Content = ({
    offer,
    sellerId,
    editUrl
}: OffersProps) => {
    const orderNow = useAction(api.stripe.pay);
    const router = useRouter();
    const currentUser = useQuery(api.users.getCurrentUser);
    const seller = useQuery(api.users.get, { id: sellerId });

    if (currentUser === undefined || seller === undefined) return <Loading />;

    if (seller === null) return <div>Not found</div>;

    const handleOrderNow = async () => {
        try {
            const url = await orderNow({ priceId: offer.stripePriceId, title: offer.title, sellerId });
            if (!url) throw new Error("Error: Stripe session error.");
            router.push(url);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleSendMessage = () => {
        router.push(`/inbox/${seller.username}`);
    }

    const revisionText = offer.revisions === 1 ? "Revision" : "Revisions";
    return (
        <div className="space-y-4 bg-white">
            <div className="flex pb-4 font-bold items-center">
                <h1>{offer.title}</h1>
                <p className="ml-auto text-2xl">${offer.price}</p>
            </div>
            <p>{offer.description}</p>
            <div className="flex flex-col font-semibold text-zinc-700 space-y-2">
                <div className="flex space-x-2">
                    <Clock />
                    <p>{offer.delivery_days} Days Delivery</p>
                </div>
                <div className="flex space-x-2">
                    <RefreshCcw />
                    <p>{offer.revisions} {revisionText}</p>
                </div>
            </div>
            {(currentUser?._id !== sellerId) && (
                <>
                    <Button className="w-full" onClick={handleOrderNow}>Order Now</Button>
                    <Button className="w-full" onClick={handleSendMessage} variant={"ghost"}>Send Message</Button>
                </>
            )}
            {(currentUser?._id === sellerId) && (
                <Button className="w-full">
                    <Link href={editUrl}>
                        Edit
                    </Link>
                </Button>
            )}
        </div>
    )
}