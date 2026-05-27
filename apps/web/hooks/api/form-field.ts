import { trpc } from "~/trpc/client";

export function useCreateField(formId: string) {
    const utils = trpc.useUtils();
    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.formField.createField.useMutation({
        onSuccess: async () => {
            await utils.formField.getFields.invalidate({ formId });
        },
    });
    return {
        createFieldAsync,
        createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    }
}

export function useGetFeild(formId: string) {
    const {
        data: fields,
        error,
        isFetched,
        isLoading,
        isSuccess,
        isPending,
    } = trpc.formField.getFields.useQuery({ formId });
    return {
        fields,
        error,
        isFetched,
        isLoading,
        isSuccess,
        isPending,
    }
}
