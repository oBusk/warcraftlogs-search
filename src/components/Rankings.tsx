import getRankings from "^/lib/rankings";
import { buildWclUrl } from "^/lib/utils";

export interface RankingsProps {
    encounter: number;
}

export default async function Rankings({ encounter }: RankingsProps) {
    const rankings = await getRankings(encounter);

    return (
        <div className="px-8">
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
                    {rankings.rankings.map(
                        ({
                            name,
                            guild,
                            class: wowClass,
                            spec,
                            amount,
                            report: { code, fightID },
                        }) => (
                            <a
                                key={code + name}
                                href={buildWclUrl({
                                    code,
                                    fightID,
                                })}
                                className="table-row hover:bg-gray-100"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <td className="text-left">{name}</td>
                                <td className="text-left">
                                    {guild?.name ?? null}
                                </td>
                                <td className="text-left">{wowClass}</td>
                                <td className="text-left">{spec}</td>
                                <td className="text-right font-mono">
                                    {Math.round(amount).toLocaleString()}
                                </td>
                            </a>
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );
}
