"use client";

import { useEffect } from "react";

export function Inspect({ data: data }: { data: any }) {
    useEffect(() => {
        if (data == null) {
            console.log("NULL");
            return;
        }
        console.log(data);
    }, [data]);

    if (data == null) return <div>NULL</div>;

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
