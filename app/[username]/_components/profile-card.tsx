import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MapPin, MessageCircle, Star } from "lucide-react";

interface ProfileCardProps {
    seller: Doc<"users">;
    reviews: Doc<"reviews">[];
}

export const ProfileCard = ({
    seller,
    reviews
}: ProfileCardProps) => {
    const languages = useQuery(api.users.getLanguagesByUsername, { username: seller.username });
    const country = useQuery(api.users.getCountryByUsername, { username: seller.username });

    if (languages === undefined || country === undefined) {
        return <div>Loading...</div>
    }

    const languagesString = languages.map((language) => language.language).join(", ");

    const averageReview = reviews.reduce((acc, review) => {
        return acc + review.communication_level + review.recommend_to_a_friend + review.service_as_described;
    }, 0) / reviews.length;

    return (
        <div className="flex space-x-4">
            <Avatar className="w-36 h-36">
                <AvatarImage src={seller.profileImageUrl || "https://github.com/shadcn.png"} />
                <AvatarFallback>{seller.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="w-[300px] flex flex-col justify-between gap-y-1">
                <div className="flex items-center space-x-3">
                    <p className="font-bold text-xl">{seller.fullName}</p>
                    <p className="text-md">@{seller.username}</p>
                </div>
                <div className="flex items-center gap-x-1">
                    <Star className="w-5 h-5" />
                    <p className="font-semibold">{reviews.length}</p>
                    (<p className="underline">{averageReview || 0}</p>)
                    <div className="bg-yellow-100 text-red-900 font-semibold p-1 ml-3">{seller.customTag}</div>
                </div>
                <p>{seller.title}</p>
                <div className="flex text-md font-semibold items-center gap-x-3">
                    <div className="flex items-center gap-x-1">
                        <MessageCircle className="w-5 h-5" />
                        <p>{languagesString}</p>
                    </div>
                    <div className="flex items-center gap-x-1">
                        <MapPin className="w-5 h-5" />
                        <p>{country.countryName}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}