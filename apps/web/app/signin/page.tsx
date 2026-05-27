"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    ChevronRight,
    Loader2
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { userSignIn } from "~/hooks/api/auth"

// Define the validation schema
const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignIn() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    // TRPC signin hook
    const { mutateAsync: loginUser, isPending } = userSignIn()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: SignInFormValues) => {
        try {
            await loginUser({
                email: data.email,
                password: data.password
            })

            toast.success("Welcome back!", {
                description: "You have signed in successfully."
            })
            reset()
            router.push("/dashboard")
        } catch (err: any) {
            console.error(err)
            toast.error("Sign In Failed", {
                description: err.message || "Invalid credentials. Please try again."
            })
        }
    }

    return (
        <div className="light min-h-screen w-full flex bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200">

            {/* LEFT PANEL - SIGNIN FORM */}
            <div className="w-full md:w-[50%] flex flex-col justify-between p-6 md:p-12 lg:p-16 xl:p-24 relative overflow-y-auto">

                {/* Sleek Branding Logo */}
                <div className="flex items-center gap-2.5 mb-12">
                    <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-950 text-white shadow-md">
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-zinc-950">Special Forms</span>
                </div>

                {/* Center Card Container */}
                <div className="w-full max-w-[440px] mx-auto my-auto py-4">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Sign in to your account</h1>
                        <p className="text-zinc-500 text-sm">
                            Welcome back! Enter your details to access your dashboard.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-zinc-700 font-semibold text-xs">
                                Email Address
                            </Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <Mail className="size-4" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your Email"
                                    disabled={isPending}
                                    className="pl-9 h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-rose-500 text-xs font-medium flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="size-3.5" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-zinc-700 font-semibold text-xs">
                                    Password
                                </Label>
                                <a href="#" className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <Lock className="size-4" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    disabled={isPending}
                                    className="pl-9 pr-10 h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isPending}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-rose-500 text-xs font-medium flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="size-3.5" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-start gap-2.5 pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    disabled={isPending}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 focus:ring-2 cursor-pointer disabled:opacity-50"
                                />
                            </div>
                            <Label htmlFor="remember" className="text-zinc-500 text-xs font-medium leading-tight cursor-pointer">
                                Remember my preference on this device
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900/20 active:scale-[0.99] transition-all font-semibold shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-zinc-500 mt-12">
                    Don't have an account?{" "}
                    <a href="/signup" className="font-semibold text-zinc-950 hover:underline">
                        Sign up
                    </a>
                </div>

            </div>

            {/* RIGHT PANEL - PREMIUM GRAPHIC & TESTIMONIAL SPLASH */}
            <div className="hidden md:flex md:w-[50%] relative overflow-hidden bg-white border-l border-zinc-200/60 flex-col justify-between p-12 lg:p-16 xl:p-24 select-none">

                {/* Soft Animated Decorative Radial Ambient Glows in Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl opacity-60 -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl opacity-50 -ml-64 -mb-64" />

                {/* Main Background Image - Curated high-resolution light abstract geometric fluid visual */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none p-8 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                        alt="Holographic Abstract Glass Shape"
                        className="w-full h-full object-cover rounded-3xl opacity-90 shadow-inner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/70 via-white/20 to-transparent mix-blend-overlay" />
                </div>

                {/* Dynamic header detail */}
                <div className="relative z-10 flex justify-end">
                    <div className="px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-zinc-200/50 shadow-xs text-xs font-semibold text-zinc-800 tracking-wide">
                        ★ Special Forms Platform
                    </div>
                </div>

                {/* Premium Testimonial Card with Glassmorphic design */}
                <div className="relative z-10 w-full max-w-[460px] mx-auto mt-auto">
                    <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/50 shadow-2xl p-8 rounded-2xl space-y-6 transform hover:translate-y-[-2px] transition-transform duration-300">

                        {/* Stars */}
                        <div className="flex gap-1 text-amber-500">
                            {"★★★★★".split("").map((star, i) => (
                                <span key={i} className="text-base">★</span>
                            ))}
                        </div>

                        {/* Testimonial body */}
                        <blockquote className="text-zinc-800 font-medium text-base leading-relaxed">
                            "Special Forms has completely transformed how our team manages high-throughput forms. The clean developer experience and TRPC type-safety is unmatched."
                        </blockquote>

                        {/* Author info */}
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                                AC
                            </div>
                            <div>
                                <div className="font-bold text-sm text-zinc-900">AC</div>
                                <div className="text-xs text-zinc-500 font-medium">CEO at Special Forms Inc</div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}
