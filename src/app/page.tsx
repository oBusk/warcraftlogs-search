import getRankings from "^/lib/get-rankings";

export default async function Home() {
    const rankings = await getRankings();

    return (
        <table>
            {rankings.map((ranking) => (
                <tr key={ranking.report.code}>
                    <td>{ranking.name}</td>
                    <td>{ranking.spec}</td>
                    <td>{ranking.amount.toLocaleString()}</td>
                </tr>
            ))}
        </table>
    );
}
