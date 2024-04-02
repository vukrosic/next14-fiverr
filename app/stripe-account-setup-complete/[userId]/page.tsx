"use client";

import { Loading } from "@/components/auth/loading";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
// import { setStripeAccountSetupComplete } from "@/convex/stripe";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface StripeAccountSetupCompleteProps {
    params: {
        userId: string;
    }
}

const StripeAccountSetupComplete = ({ params }: StripeAccountSetupCompleteProps) => {
    const update = useAction(api.stripe.setStripeAccountSetupComplete);

    const router = useRouter();

    useEffect(() => {
        const setStripeAccountSetupComplete = async () => {
            try {
                await update({ userId: params.userId as Id<"users"> });
                router.push("/");
            } catch (error: any) {
                toast.error("Error saving your stripe payment processing", { duration: 10000 });
                router.push("/");
            }
        }
        setStripeAccountSetupComplete();
    }, [update, params.userId, router]);

    return (
        <div>
            <h1>Stripe Account Setup Complete</h1>
            <h3>This page will redirect shortly...</h3>
            <Loading />
        </div>
    );
}

export default StripeAccountSetupComplete;