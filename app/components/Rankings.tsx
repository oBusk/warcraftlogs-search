"use client";

import { type ComponentProps, useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import type { Klass } from "^/lib/wcl/classes";
import type { Zone } from "^/lib/wcl/zones";
import { buildWclUrl } from "^/lib/utils";
import { type ItemFilterConfig } from "./ItemPicker/ItemFilter";
import PageLinks from "./PageLinks";
import { type TalentFilterConfig } from "./TalentPicker/TalentFilter";

export interface RankingsProps extends ComponentProps<"div"> {
    encounter: number;
    region: string | null;
    partition: number | null;
    metric: string;
    difficulty: number;
    klass: number | null;
    spec: number | null;
    talents: TalentFilterConfig[];
    itemFilters: ItemFilterConfig[];
    pages: readonly number[];
    zones: Zone[];
    classes: Klass[];
}

interface RankingsData {
    rankings: Array<{
        name: string;
        guild: { name: string } | null;
        class: string;
        spec: string;
        amount: number;
        report: {
            code: string;
            fightID: number;
            startTime: number;
        };
    }>;
    count: number | null;
    pages: number[];
    filteredCount: number;
    hasMorePages: boolean;
}

export default function Rankings({
    encounter: _encounter,
    region: _region,
    partition: _partition,
    metric: _metric,
    difficulty: _difficulty,
    klass: _klass,
    spec: _spec,
    talents: _talents,
    itemFilters: _itemFilters,
    pages: _requestedPages,
    zones: _zones,
    classes,
    ...props
}: RankingsProps) {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<RankingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchRankings() {
            setLoading(true);
            setError(null);

            try {
                // Build query params for API call
                const params = new URLSearchParams(searchParams);
                
                const response = await fetch(`/api/rankings?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.error) {
                    throw new Error(result.error);
                }
                
                if (!cancelled) {
                    setData(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : String(err));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchRankings();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    const classToColor: Record<string, string> = classes.reduce(
        (acc, { slug, color }) => ({ ...acc, [slug]: color }),
        {},
    );

    if (loading) {
        return (
            <div {...props}>
                <div className="flex justify-center p-8">Loading rankings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div {...props}>
                <div className="flex justify-center p-8 text-red-500">
                    Error loading rankings: {error}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div {...props}>
                <div className="flex justify-center p-8">No data available</div>
            </div>
        );
    }

    const { rankings, count, pages, filteredCount, hasMorePages } = data;

    return (
        <div {...props}>
            {count != null && (
                <>
                    <p className="mb-2 text-center text-xl font-bold">
                        Page: {pages.join(",")} - showing {filteredCount} of{" "}
                        {count} results
                    </p>
                    <div className="flex justify-center">
                        <PageLinks showNext={hasMorePages} />
                    </div>
                </>
            )}
            {rankings?.length > 0 ? (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Name</th>
                            <th className="text-left">Date</th>
                            <th className="text-left">Guild</th>
                            <th className="text-left">Class</th>
                            <th className="text-left">Spec</th>
                            <th className="text-right">DPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map(
                            ({
                                name,
                                guild,
                                class: wowClass,
                                spec,
                                amount,
                                report: { code, fightID, startTime },
                            }) => {
                                const Cell = ({
                                    children,
                                    ...props
                                }: ComponentProps<"td">) => (
                                    <td {...props}>
                                        <a
                                            href={buildWclUrl({
                                                code,
                                                fightID,
                                            })}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block"
                                        >
                                            {children}
                                        </a>
                                    </td>
                                );

                                const classColor = classToColor[wowClass];

                                return (
                                    <tr
                                        key={code + name}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Cell
                                            className="text-left"
                                            style={{
                                                ...(classColor && {
                                                    color: classColor,
                                                }),
                                            }}
                                        >
                                            {name}
                                        </Cell>
                                        <Cell className="text-left">
                                            {new Date(
                                                startTime,
                                            ).toLocaleDateString()}
                                        </Cell>
                                        <Cell className="text-left">
                                            {guild?.name ?? null}
                                        </Cell>
                                        <Cell className="text-left">
                                            {wowClass}
                                        </Cell>
                                        <Cell className="text-left">{spec}</Cell>
                                        <Cell className="text-right font-mono">
                                            {Math.round(amount).toLocaleString()}
                                        </Cell>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            ) : (
                <h1>No results</h1>
            )}
        </div>
    );
}
