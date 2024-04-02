import React from 'react';
import { ReviewBox } from './review-box';
import { ReviewFullType } from '@/types';
import { Separator } from '@/components/ui/separator';

interface ReviewsProps {
    reviews: ReviewFullType[];
}

export const Reviews = ({ reviews }: ReviewsProps) => {
    // Calculate average scores for all reviews
    const starDistribution = Array(5).fill(0); // Initialize array for star distribution, 5 levels (1-5)
    const averageScore = reviews.reduce((total, review) => {
        const average = (review.communication_level + review.recommend_to_a_friend + review.service_as_described) / 3;
        const roundedAverage = Math.round(average);
        starDistribution[5 - roundedAverage]++; // Count the number of reviews for each star level
        return total + average;
    }, 0) / reviews.length;

    // Calculate the maximum number of reviews for any star level to set relative progress bar maximum
    const maxReviews = Math.max(...starDistribution);

    // Calculate rating breakdown values dynamically
    const ratingBreakdown = {
        'Seller communication level': calculateAverage(reviews.map(review => review.communication_level)),
        'Recommend to a friend': calculateAverage(reviews.map(review => review.recommend_to_a_friend)),
        'Service as described': calculateAverage(reviews.map(review => review.service_as_described))
    };

    function calculateAverage(values: number[]): number {
        if (values.length === 0) return 0;
        const sum = values.reduce((total, value) => total + value, 0);
        return sum / values.length;
    }

    return (
        <div className='space-y-8'>
            {reviews.map((review) => {
                return (
                    <>
                        <ReviewBox
                            key={review._id}
                            review={review}
                        />
                        <Separator />
                    </>
                );
            })}
        </div>
    );
};
