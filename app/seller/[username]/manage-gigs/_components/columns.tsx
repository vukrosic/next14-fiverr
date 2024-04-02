"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { api } from "@/convex/_generated/api"
import GigActionsCell from "./actions"
import { Id } from "@/convex/_generated/dataModel"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type GigData = {
    id: string,
    title: string,
    image: string
    clicks: number
    orders: number
    revenue: number
    username: string
}

export const columns: ColumnDef<GigData>[] = [
    {
        accessorKey: "gig",
        header: () => <div>Gig</div>,
        cell: ({ row }) => {
            return (
                <Link className="flex items-center space-x-2" href={`/sellers`}>
                    <Image
                        width={30}
                        height={30}
                        src={row.original.image}
                        alt={row.original.title}
                    />
                    <div className="font-medium">{row.original.title}</div>
                </Link>
            )
        },
    },
    {
        accessorKey: "clicks",
        header: "Clicks",
    },
    {
        accessorKey: "orders",
        header: "Orders",
    },
    {
        accessorKey: "revenue",
        header: () => <div className="text-right">Revenue</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("revenue"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <GigActionsCell gigId={row.original.id as Id<"gigs">} username={row.original.username} />
    },
]
