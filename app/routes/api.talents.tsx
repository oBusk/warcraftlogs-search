import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { nullGetTalents } from "^/lib/nullGetTalents";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const classIdParam = url.searchParams.get("classId");
    const specIdParam = url.searchParams.get("specId");

    if (!classIdParam || !specIdParam) {
        return json([]);
    }

    const classId = Number(classIdParam);
    const specId = Number(specIdParam);

    if (isNaN(classId) || isNaN(specId)) {
        return json([]);
    }

    try {
        const talents = await nullGetTalents(classId, specId);
        return json(talents);
    } catch (error) {
        console.error("Error fetching talents:", error);
        return json([]);
    }
}
