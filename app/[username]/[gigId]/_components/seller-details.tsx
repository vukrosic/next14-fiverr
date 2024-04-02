import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Doc } from "@/convex/_generated/dataModel";
import { UserWithCountryType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react"
import Link from "next/link";
import { useRouter } from "next/navigation";

const { format } = require('date-fns');

interface SellerProps {
    seller: UserWithCountryType;
    reviews: Doc<"reviews">[];
    lastFulFilmentTime: number | undefined;
    languages: Doc<"languages">[];
}

export const SellerDetails = ({
    seller,
    reviews,
    lastFulFilmentTime,
    languages
}: SellerProps) => {
    const router = useRouter();
    const averageReview = reviews.reduce((acc, review) => {
        return acc + review.communication_level + review.recommend_to_a_friend + review.service_as_described;
    }, 0) / (reviews.length * 3);

    const joinedDate = format(new Date(seller._creationTime), 'MMM yy');

    let timeAgo = undefined;
    if (lastFulFilmentTime !== undefined) {
        timeAgo = formatDistanceToNow(new Date(lastFulFilmentTime), { addSuffix: true });
    }

    const languagesString = languages.map((language) => language.language).join(", ");

    const handleContactClick = () => {
        router.push(`/inbox/${seller.username}`);
    }

    return (
        <div className="space-y-3">
            <div className="flex space-x-4">
                <Link href={`/${seller.username}`}>
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={seller.profileImageUrl || "https://github.com/shadcn.png"} />
                        <AvatarFallback>{seller.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="w-fit flex flex-col space-y-2">
                    <Link href={`/${seller.username}`}>
                        <p className="font-bold text-lg">{seller.fullName}</p>
                    </Link>
                    <p className="text-md">{seller.title}</p>
                    <div className="flex space-x-5">
                        <div className="flex space-x-1.5">
                            <Star className="w-5 h-5" />
                            <p className="font-semibold">{reviews.length}</p>
                            <div className="flex">(<p className="underline">{averageReview.toFixed(2) || 0}</p>)</div>
                        </div>
                        <div className="bg-yellow-100 text-red-900 font-semibold p-1">{seller.customTag}</div>
                    </div>
                </div>
            </div>
            <Button variant={"outline"} onClick={handleContactClick}>Contact me</Button>
            <div className="border border-black/20 p-4 space-y-3 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                    <div>
                        <p className="font-semibold">From</p>
                        <p>{seller.country.countryName}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Joined</p>
                        <p>{joinedDate}</p>
                    </div>
                    {(timeAgo !== undefined) && (
                        <div>
                            <p className="font-semibold">Last delivery</p>
                            <p>{timeAgo}</p>
                        </div>
                    )}
                    {(languages.length > 0) && (
                        <div>
                            <p className="font-semibold">Languages</p>
                            <p>{languagesString}</p>
                        </div>
                    )}
                </div>
                <Separator />
                <p>{seller.about}</p>
            </div>
        </div>
    )
}