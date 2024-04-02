import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { ReviewFullType } from '@/types';

interface ReviewsStatsProps {
    reviews: ReviewFullType[];
}

export const ReviewsStats = ({ reviews }: ReviewsStatsProps) => {
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
        <div className="flex space-x-12">
            <div className="w-full md:w-1/2">
                <p className='font-bold'>Average Review Score: {averageScore.toFixed(2)} stars</p>
                {starDistribution.map((count, index) => {
                    const starLevel = 5 - index; // Stars level (5, 4, 3, 2, 1)
                    const percentage = (count / maxReviews) * 100; // Calculate percentage for progress bar

                    return (
                        <div key={starLevel} className='flex space-x-2 items-center font-bold'>
                            <Button variant={"ghost"} className='font-bold'>{starLevel} Stars ({count})</Button>
                            <Progress value={percentage} />
                        </div>
                    );
                })}
            </div>
            <div className="w-full md:w-1/2">
                <p className="flex flex-col font-bold space-y-8">Rating Breakdown</p>
                {Object.entries(ratingBreakdown).map(([label, value], index) => (
                    <p key={index} className="flex items-center text-gray-600 font-semibold mt-2">
                        <span className="mr-2">{label}:</span>
                        <span>{value.toFixed(1)}</span>
                    </p>
                ))}
            </div>
        </div>
    );
};
