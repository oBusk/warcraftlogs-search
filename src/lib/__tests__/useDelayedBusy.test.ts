import { act, renderHook } from "@testing-library/react";

import { useDelayedBusy } from "../useDelayedBusy";

function advance(ms: number) {
    act(() => {
        jest.advanceTimersByTime(ms);
    });
}

describe("useDelayedBusy", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("a navigation that settles before 200ms shows nothing", () => {
        const { result, rerender } = renderHook(
            ({ pending }) => useDelayedBusy(pending),
            { initialProps: { pending: true } },
        );

        advance(150);
        rerender({ pending: false });
        advance(1000);

        expect(result.current.busy).toBe(false);
    });

    test("shows after 200ms", () => {
        const { result } = renderHook(() => useDelayedBusy(true));

        expect(result.current.busy).toBe(false);

        advance(199);
        expect(result.current.busy).toBe(false);

        advance(1);
        expect(result.current.busy).toBe(true);
    });

    test("a response arriving at 250ms is held for the 500ms minimum", () => {
        const { result, rerender } = renderHook(
            ({ pending }) => useDelayedBusy(pending),
            { initialProps: { pending: true } },
        );

        advance(250);
        expect(result.current.busy).toBe(true);

        rerender({ pending: false });

        advance(400);
        expect(result.current.busy).toBe(true);

        advance(100);
        expect(result.current.busy).toBe(false);
    });

    test("stays continuous when a second navigation starts while showing", () => {
        const { result, rerender } = renderHook(
            ({ pending }) => useDelayedBusy(pending),
            { initialProps: { pending: true } },
        );

        advance(250);
        expect(result.current.busy).toBe(true);

        rerender({ pending: false });
        advance(100);
        rerender({ pending: true });
        advance(2000);

        expect(result.current.busy).toBe(true);
    });

    test("reports stillLoading after 10s", () => {
        const { result } = renderHook(() => useDelayedBusy(true));

        advance(200);
        expect(result.current.busy).toBe(true);
        expect(result.current.stillLoading).toBe(false);

        advance(9_999);
        expect(result.current.stillLoading).toBe(false);

        advance(1);
        expect(result.current.stillLoading).toBe(true);
    });

    test("clears stillLoading once settled", () => {
        const { result, rerender } = renderHook(
            ({ pending }) => useDelayedBusy(pending),
            { initialProps: { pending: true } },
        );

        advance(200);
        advance(10_000);
        expect(result.current.stillLoading).toBe(true);

        rerender({ pending: false });
        advance(600);

        expect(result.current.busy).toBe(false);
        expect(result.current.stillLoading).toBe(false);
    });
});
