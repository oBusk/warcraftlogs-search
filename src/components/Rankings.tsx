import { ReactNode } from "react";
import getRankings from "^/lib/rankings";
import { buildWclUrl } from "^/lib/utils";

export interface RankingsProps {
    encounter: number;
    partition?: number;
    klass?: number;
    spec?: number;
    className?: string;
    talent?: number;
}

export default async function Rankings({
    encounter,
    partition,
    klass,
    spec,
    className,
    talent,
}: RankingsProps) {
    const { rankings, count } = await getRankings(
        encounter,
        partition,
        klass,
        spec,
        talent,
    );

    return (
        <div className={className}>
            {count != null && (
                <p className="text-xl font-bold mb-2 text-center">
                    {count} results
                </p>
            )}
            {rankings?.length > 0 ? (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Name</th>
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
                                report: { code, fightID },
                            }) => {
                                const Cell = ({
                                    children,
                                    className,
                                }: {
                                    children: ReactNode;
                                    className?: string;
                                }) => (
                                    <td className={className}>
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

                                return (
                                    <tr
                                        key={code + name}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Cell className="text-left">
                                            {name}
                                        </Cell>
                                        <Cell className="text-left">
                                            {guild?.name ?? null}
                                        </Cell>
                                        <Cell className="text-left">
                                            {wowClass}
                                        </Cell>
                                        <Cell className="text-left">
                                            {spec}
                                        </Cell>
                                        <Cell className="text-right font-mono">
                                            {Math.round(
                                                amount,
                                            ).toLocaleString()}
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
