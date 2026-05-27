import { trpc } from "~/trpc/client";

export function createForm() {
    const utils = trpc.useUtils();
    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.form.createForm.useMutation();

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    }
}

