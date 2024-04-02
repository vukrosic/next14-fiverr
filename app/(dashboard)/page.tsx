"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { GigList } from "./_components/gig-list";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface DashboardProps {
    searchParams: {
        search?: string;
        favorites?: string;
        filter?: string;
    };
};

const Dashboard = ({
    searchParams
}: DashboardProps) => {
    const store = useMutation(api.users.store);
    useEffect(() => {
        const storeUser = async () => {
            await store({});
        }
        storeUser();
    }, [store])
    return (
        <GigList
            query={searchParams}
        />
    );
};

export default Dashboard;