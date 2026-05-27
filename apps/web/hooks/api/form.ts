import { trpc } from "~/trpc/client";

export function useCreateForm() {
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
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });

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

export function useListForm() {
    const {
        data: forms,
        error,
        failureCount,
        isError,
        isSuccess,
        isPending,
        status,
    } = trpc.form.listFormsbyUserId.useQuery();

    return {
        forms,
        error,
        failureCount,
        isError,
        isSuccess,
        isPending,
        status,
    }
}

