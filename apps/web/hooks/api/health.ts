import { trpc } from "~/trpc/client";

export function useHealth() {
    const { data, error, isFetching, isLoading, status } = trpc.health.getHealth.useQuery();

    return {
        data,
        error,
        isFetching,
        isLoading,
        status
    }
}