import { ErrorView } from "^/components/ErrorView";

export default function NotFound() {
    return <ErrorView isNotFound={true} />;
}
