import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Heart, Star } from "lucide-react";

interface FooterProps {
    isFavorite: boolean;
    title: string;
    ownerLabel: string;
    createdAtLabel: string;
    onClick: () => void;
    disabled: boolean;
    offer: Doc<"offers">;
    reviews: Doc<"reviews">[];
    seller: Doc<"users">;
};

export const Footer = ({
    isFavorite,
    title,
    ownerLabel,
    createdAtLabel,
    onClick,
    disabled,
    offer,
    reviews,
    seller
}: FooterProps) => {
    let averageReview: number = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.communication_level + review.recommend_to_a_friend + review.service_as_described, 0) / (reviews.length * 3) : 0;
    if (averageReview % 1 !== 0) {
        averageReview = parseFloat(averageReview.toFixed(1));
    }
    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();

        onClick();
    };

    return (
        <div className="relative bg-white p-3 space-y-2">
            <h3 className="font-bold">{seller.fullName}</h3>
            <p className="text-[14px] font-medium max-w-[calc(100%-20px)]">
                {title}
            </p>
            <div className="flex gap-x-1.5 text-md font-normal">
                <Star className="font-semibold" />
                <p className="font-semibold">{reviews.length}</p>
                (<p className="underline">{averageReview}</p>)
                {/* {reviews.length > 0 && averageReview.toFixed(1) && (
          <p className="font-normal">{totalReviews > 0 && `(${totalReviews || 0})`}</p>
        )}
        {reviews.length === 0 && (<p className="font-normal">0</p>)} */}
            </div>
            <p className="font-semibold">From ${offer.price}</p>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
                {ownerLabel}, {createdAtLabel}
            </p>
            <button
                disabled={disabled}
                onClick={handleClick}
                className={cn(
                    "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
                    disabled && "cursor-not-allowed opacity-75"
                )}
            >
                <Heart
                    className={cn(
                        "h-4 w-4",
                        isFavorite && "fill-blue-600 text-blue-600"
                    )}
                />
            </button>
        </div>
    );
};