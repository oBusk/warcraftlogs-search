"use client";

import { type ComponentProps, useEffect, useState } from "react";
import type { NullTalent } from "^/lib/nullGetTalents";
import TalentPickerClient from "./TalentPicker.client";

export interface TalentPickerProps extends ComponentProps<"div"> {
    classId: number | null;
    specId: number | null;
}

export default function TalentPicker({
    classId,
    specId,
    ...props
}: TalentPickerProps) {
    const [talents, setTalents] = useState<NullTalent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (classId == null || specId == null) {
            setTalents([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        async function fetchTalents() {
            try {
                const response = await fetch(
                    `/api/talents?classId=${classId}&specId=${specId}`,
                );
                const data = await response.json();
                
                if (!cancelled) {
                    setTalents(data);
                }
            } catch (error) {
                console.error("Error fetching talents:", error);
                if (!cancelled) {
                    setTalents([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchTalents();

        return () => {
            cancelled = true;
        };
    }, [classId, specId]);

    if (loading) {
        return (
            <div {...props}>
                <div>Loading talents...</div>
            </div>
        );
    }

    return (
        <div {...props}>
            <TalentPickerClient
                talents={talents}
                key={`${classId}-${specId}`}
            />
        </div>
    );
}
