import { trpc } from "~/trpc/client";

export function userSignUp() {
    const utils = trpc.useUtils();
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    });

    return {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    }
}

export function userSignIn() {
    const utils = trpc.useUtils();
    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    });

    return {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        isPending,
        status,
    }
}

export function useUser() {
    const {
        data: user,
        error,
        failureCount,
        isError,
        isSuccess,
        isLoading,
        isPending,
        status,
    } = trpc.auth.getLoggedInUserInfo.useQuery();
    return {
        user,
        error,
        failureCount,
        isError,
        isSuccess,
        isLoading,
        isPending,
        status,
    }
}