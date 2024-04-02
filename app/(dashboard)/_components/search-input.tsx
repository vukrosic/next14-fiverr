"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

export const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState("");
    // const debouncedValue = useDebounceValue(value, 500);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = () => {
        const url = qs.stringifyUrl({
            url: "/",
            query: {
                search: value,
            },
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    };

    // useEffect(() => {
    //     const url = qs.stringifyUrl({
    //         url: "/",
    //         query: { 
    //         search: debouncedValue[0],
    //         },
    //     }, {skipEmptyString: true, skipNull: true});

    //     router.push(url);
    // }, [debouncedValue, router]);

    return (
        <div className="w-full relative flex">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                className="w-full pl-9"
                placeholder="Search gigs..."
                onChange={handleChange}
                value={value}
            />
            <Button onClick={handleSubmit} variant={"secondary"} className="ml-2">Search</Button>
        </div>
    );
}