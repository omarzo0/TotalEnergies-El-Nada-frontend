import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useRouter } from "@/i18n/routing";
import { useAuth } from '@/hooks/useAuth';

export function useAuthActions() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setUser } = useAuth();

    // Login Mutation
    const loginMutation = useMutation({
        mutationFn: ({ email, password }: any) => authApi.login(email, password),
        onSuccess: (data) => {
            // Determine if data is an array (returned by backend) or an object
            const authData = Array.isArray(data) ? data[0] : data;
            const token = authData?.token;

            if (token) {
                const user = authData?.user;
                localStorage.setItem("token", token);
                localStorage.setItem("auth_user", JSON.stringify(user));

                // Update the global auth state immediately
                setUser(user);

                // Clear all queries on login to ensure no stale data from previous user
                queryClient.clear();

                router.push("/overview");
            }
        }
    });

    // Forgot Password Mutation
    const forgotPasswordMutation = useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email)
    });

    // Verify OTP Mutation
    const verifyOtpMutation = useMutation({
        mutationFn: ({ email, otp }: any) => authApi.verifyOtp(email, otp)
    });

    // Reset Password Mutation
    const resetPasswordMutation = useMutation({
        mutationFn: ({ email, password }: any) => authApi.resetPassword(email, password)
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        forgotPassword: forgotPasswordMutation.mutateAsync,
        isSendingOtp: forgotPasswordMutation.isPending,

        verifyOtp: verifyOtpMutation.mutateAsync,
        isVerifyingOtp: verifyOtpMutation.isPending,

        resetPassword: resetPasswordMutation.mutateAsync,
        isResettingPassword: resetPasswordMutation.isPending
    };
}
