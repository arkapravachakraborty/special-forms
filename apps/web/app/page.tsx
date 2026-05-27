"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { 
    ArrowRight, 
    Layers, 
    Cpu, 
    ShieldCheck, 
    Sparkles, 
    ChevronRight, 
    Loader2 
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { useUser } from "~/hooks/api/auth"

export default function Home() {
    const router = useRouter()
    const { user, isLoading } = useUser()

    const handleStart = () => {
        if (user) {
            router.push("/dashboard")
        } else {
            router.push("/signup")
        }
    }

    return (
        <div className="light min-h-screen w-full bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col relative overflow-x-hidden">
            
            {/* Soft Ambient Decorative Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/25 rounded-full blur-3xl opacity-60 -mr-64 -mt-64 z-0 pointer-events-none" />
            <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl opacity-50 -ml-64 z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-emerald-100/10 rounded-full blur-3xl opacity-40 z-0 pointer-events-none" />

            {/* HEADER NAVIGATION */}
            <header className="relative z-10 w-full border-b border-zinc-200/40 bg-[#FAF9F6]/75 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-950 text-white shadow-sm">
                            <svg
                                className="w-4.5 h-4.5"
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

                    {/* Nav Links - Desktop */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-500">
                        <a href="#" className="hover:text-zinc-900 transition-colors">Features</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Integrations</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Documentation</a>
                    </nav>

                    {/* Authentication Status CTA */}
                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-xs font-semibold text-zinc-900 leading-none">{user.name}</span>
                                    <span className="text-3xs text-zinc-400 font-medium">{user.email}</span>
                                </div>
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="h-9 px-4 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-sm text-sm cursor-pointer"
                                >
                                    Dashboard
                                </Button>
                            </div>
                        ) : (
                            <>
                                <a
                                    href="/signin"
                                    className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                                >
                                    Sign In
                                </a>
                                <Button
                                    onClick={() => router.push("/signup")}
                                    className="h-9 px-4 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-xs text-sm cursor-pointer"
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                </div>
            </header>

            {/* HERO SECTION */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 flex flex-col justify-center items-center text-center py-20 md:py-28 lg:py-32">
                
                {/* Intro Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/60 shadow-2xs text-xs font-semibold text-zinc-700 mb-8 transform hover:scale-[1.02] transition-transform select-none">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/10" />
                    <span>Introducing Special Forms 2.0</span>
                    <ChevronRight className="w-3 h-3 text-zinc-400" />
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 max-w-[900px] leading-[1.08] mb-6">
                    Smart forms for modern <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 bg-clip-text text-transparent">developer workflows.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-zinc-500 text-base sm:text-lg md:text-xl font-medium max-w-[620px] leading-relaxed mb-10">
                    Build, validate, and collect form submissions with complete TRPC type-safety and stunning light aesthetics.
                </p>

                {/* Dynamic Call To Action Block */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-[400px]">
                    {isLoading ? (
                        <Button disabled className="w-full sm:w-auto h-12 px-8 rounded-xl bg-zinc-950 text-white font-semibold">
                            <Loader2 className="w-4.5 h-4.5 animate-spin mr-2" />
                            Checking credentials...
                        </Button>
                    ) : user ? (
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                            Enter Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={handleStart}
                                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => router.push("/signin")}
                                variant="outline"
                                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-all font-semibold shadow-2xs cursor-pointer active:scale-[0.98]"
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </div>

                {/* Mockup Dashboard Preview Container */}
                <div className="mt-20 md:mt-24 lg:mt-28 w-full max-w-[1000px] p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-zinc-200/50 bg-white/50 backdrop-blur-md shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none rounded-2xl sm:rounded-3xl" />
                    
                    {/* Mock Dashboard App Frame */}
                    <div className="w-full aspect-[16/9] bg-white border border-zinc-200/60 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner flex flex-col">
                        
                        {/* Mock header */}
                        <div className="h-11 sm:h-12 border-b border-zinc-200/50 px-4 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="size-2.5 rounded-full bg-zinc-200" />
                                    <div className="size-2.5 rounded-full bg-zinc-200" />
                                    <div className="size-2.5 rounded-full bg-zinc-200" />
                                </div>
                                <div className="h-4 w-32 bg-zinc-100 rounded-md ml-4" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-zinc-200/80 rounded-md" />
                                <div className="h-5 w-8 bg-zinc-100 rounded-md" />
                            </div>
                        </div>

                        {/* Mock content grid */}
                        <div className="flex-1 p-4 sm:p-6 grid grid-cols-4 gap-4 bg-white">
                            {/* Left mock sidebar */}
                            <div className="col-span-1 hidden sm:flex flex-col gap-3 pr-2 border-r border-zinc-100">
                                <div className="h-6 w-full bg-zinc-100 rounded-md" />
                                <div className="h-6 w-4/5 bg-zinc-50 rounded-md" />
                                <div className="h-6 w-11/12 bg-zinc-50 rounded-md" />
                                <div className="h-6 w-3/4 bg-zinc-50 rounded-md" />
                            </div>

                            {/* Main mock board */}
                            <div className="col-span-4 sm:col-span-3 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-44 bg-zinc-200 rounded-md" />
                                    <div className="h-7 w-20 bg-zinc-950 rounded-md" />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="h-16 bg-zinc-50 border border-zinc-200/30 rounded-xl p-3 flex flex-col justify-between">
                                        <div className="h-3 w-16 bg-zinc-200 rounded-xs" />
                                        <div className="h-4 w-10 bg-zinc-300 rounded-xs" />
                                    </div>
                                    <div className="h-16 bg-zinc-50 border border-zinc-200/30 rounded-xl p-3 flex flex-col justify-between">
                                        <div className="h-3 w-14 bg-zinc-200 rounded-xs" />
                                        <div className="h-4 w-6 bg-zinc-300 rounded-xs" />
                                    </div>
                                    <div className="h-16 bg-zinc-50 border border-zinc-200/30 rounded-xl p-3 flex flex-col justify-between">
                                        <div className="h-3 w-20 bg-zinc-200 rounded-xs" />
                                        <div className="h-4 w-12 bg-zinc-300 rounded-xs" />
                                    </div>
                                </div>
                                <div className="flex-1 border border-zinc-200/30 bg-zinc-50/50 rounded-xl p-4 flex flex-col gap-2.5">
                                    <div className="h-4 w-full bg-zinc-200/60 rounded-xs" />
                                    <div className="h-4 w-full bg-zinc-100 rounded-xs" />
                                    <div className="h-4 w-11/12 bg-zinc-100 rounded-xs" />
                                    <div className="h-4 w-4/5 bg-zinc-100 rounded-xs" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            {/* FEATURES SECTION */}
            <section className="relative z-10 w-full border-t border-zinc-200/50 bg-white py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6">
                    
                    <div className="text-center max-w-[600px] mx-auto mb-16 space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-950">Engineered for absolute type safety</h2>
                        <p className="text-zinc-500 font-medium text-sm sm:text-base">
                            Built on top of tRPC, Next.js, and modern lightweight utilities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="space-y-4 p-6 rounded-2xl bg-[#FAF9F6]/50 border border-zinc-200/40 hover:border-zinc-200 hover:bg-[#FAF9F6] transition-all transform hover:-translate-y-0.5">
                            <div className="size-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-950">End-to-End Type Safety</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                Share models directly between backend DB schemas and your client-side form validations. Zero code generator steps required.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="space-y-4 p-6 rounded-2xl bg-[#FAF9F6]/50 border border-zinc-200/40 hover:border-zinc-200 hover:bg-[#FAF9F6] transition-all transform hover:-translate-y-0.5">
                            <div className="size-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-950">Premium White Aesthetics</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                Soft ivory canvases, glowing active selectors, sleek geometric layouts, and beautiful high-resolution abstract 3D visual panels.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="space-y-4 p-6 rounded-2xl bg-[#FAF9F6]/50 border border-zinc-200/40 hover:border-zinc-200 hover:bg-[#FAF9F6] transition-all transform hover:-translate-y-0.5">
                            <div className="size-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-950">Secure session handling</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                Protected http-only cookie tokens mapped to server-side authenticated procedures to verify identity seamlessly.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 w-full border-t border-zinc-200/40 bg-[#FAF9F6] py-12 text-center text-xs font-semibold text-zinc-400">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-zinc-500">© 2026 Special Forms Inc. All rights reserved.</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

        </div>
    )
}
