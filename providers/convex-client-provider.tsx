"use client";

import { Loading } from "@/components/auth/loading";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { AuthLoading, Authenticated, Unauthenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

interface ConvexClientProviderProps {
    children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Unauthenticated>
                    {children}
                </Unauthenticated>
                <Authenticated>
                    {children}
                </Authenticated>
                <AuthLoading>
                    <Loading />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}