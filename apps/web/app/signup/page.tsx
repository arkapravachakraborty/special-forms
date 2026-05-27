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
    User,
    AlertCircle,
    ChevronRight,
    Loader2
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { userSignUp } from "~/hooks/api/auth"

// Define the validation schema
const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUp() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // TRPC signup hook
    const { mutateAsync: registerUser, isPending } = userSignUp()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const passwordValue = watch("password") || ""
    const confirmPasswordValue = watch("confirmPassword") || ""

    // Dynamic Password Strength Calculations
    const calculatePasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, label: "Very Weak", color: "bg-zinc-200" }

        let score = 0
        if (pass.length >= 8) score += 1
        if (/[A-Z]/.test(pass)) score += 1
        if (/[0-9]/.test(pass)) score += 1
        if (/[^A-Za-z0-9]/.test(pass)) score += 1

        switch (score) {
            case 1:
                return { score: 25, label: "Weak", color: "bg-rose-500" }
            case 2:
                return { score: 50, label: "Fair", color: "bg-amber-500" }
            case 3:
                return { score: 75, label: "Good", color: "bg-indigo-500" }
            case 4:
                return { score: 100, label: "Strong", color: "bg-emerald-500" }
            default:
                return { score: 0, label: "Very Weak", color: "bg-zinc-200" }
        }
    }

    const pwdStrength = calculatePasswordStrength(passwordValue)

    const onSubmit = async (data: SignUpFormValues) => {
        if (!agreedToTerms) {
            toast.error("Terms & Conditions", {
                description: "Please accept the terms of service and privacy policy to continue."
            })
            return
        }

        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password
            })

            toast.success("Account Created!", {
                description: "Welcome aboard! Your registration was completed successfully."
            })
            reset()
            setAgreedToTerms(false)
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err)
            toast.error("Registration Failed", {
                description: err.message || "An unexpected error occurred. Please try again."
            })
        }
    }

    return (
        <div className="light min-h-screen w-full flex bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200">

            {/* LEFT PANEL - SIGNUP FORM */}
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
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create your account</h1>
                        <p className="text-zinc-500 text-sm">
                            Start building beautiful smart forms in minutes. No credit card required.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-zinc-700 font-semibold text-xs">
                                Full Name
                            </Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <User className="size-4" />
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    disabled={isPending}
                                    className="pl-9 h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-rose-500 text-xs font-medium flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="size-3.5" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

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
                            <Label htmlFor="password" className="text-zinc-700 font-semibold text-xs">
                                Password
                            </Label>
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

                            {/* Password strength micro-animation bar */}
                            {passwordValue.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex justify-between items-center text-2xs font-semibold uppercase tracking-wider text-zinc-400">
                                        <span>Complexity</span>
                                        <span className="text-zinc-600 font-bold">{pwdStrength.label}</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${pwdStrength.color} transition-all duration-500 ease-out`}
                                            style={{ width: `${pwdStrength.score}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-rose-500 text-xs font-medium flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="size-3.5" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className="text-zinc-700 font-semibold text-xs">
                                Confirm Password
                            </Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <Lock className="size-4" />
                                </div>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    disabled={isPending}
                                    className="pl-9 pr-10 h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={isPending}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-rose-500 text-xs font-medium flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="size-3.5" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2.5 pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    disabled={isPending}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 focus:ring-2 cursor-pointer disabled:opacity-50"
                                />
                            </div>
                            <Label htmlFor="terms" className="text-zinc-500 text-xs font-medium leading-tight cursor-pointer">
                                I agree to the{" "}
                                <a href="#" className="underline text-zinc-900 hover:text-black">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="underline text-zinc-900 hover:text-black">
                                    Privacy Policy
                                </a>.
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-zinc-500 mt-12">
                    Already have an account?{" "}
                    <a href="/signin" className="font-semibold text-zinc-950 hover:underline">
                        Sign in
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
