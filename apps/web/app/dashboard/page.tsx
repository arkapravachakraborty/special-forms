"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    Layers,
    FileText,
    Activity,
    ChevronRight,
    PlusCircle,
    Search,
    Sliders,
    Settings,
    LogOut,
    ExternalLink,
    Trash2,
    Edit2,
    AlertCircle,
    Loader2,
    ArrowUpRight,
    User as UserIcon,
    X
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useUser } from "~/hooks/api/auth"
import { useCreateForm, useListForm } from "~/hooks/api/form"

interface FormItem {
    id: string
    title: string
    description?: string
    submissions: number
    createdAt: string
}

export default function Dashboard() {
    const router = useRouter()
    const { user, isLoading: userLoading } = useUser()
    const { createFormAsync, isPending: createPending } = useCreateForm()
    const { forms: backendForms, isPending: formsLoading } = useListForm()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Form inputs state
    const [formTitle, setFormTitle] = useState("")
    const [formDesc, setFormDesc] = useState("")
    const [formErrors, setFormErrors] = useState({ title: "" })

    // Check authentication redirect
    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/signin")
        }
    }, [user, userLoading, router])

    const handleCreateFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formTitle.trim()) {
            setFormErrors({ title: "Title is required" })
            return
        }

        try {
            // Call backend TRPC mutation
            await createFormAsync({
                title: formTitle,
                description: formDesc || undefined
            })

            toast.success("Form Created Successfully!", {
                description: `"${formTitle}" is now ready to receive submissions.`
            })

            // Reset state
            setFormTitle("")
            setFormDesc("")
            setFormErrors({ title: "" })
            setIsCreateOpen(false)
        } catch (err: any) {
            console.error(err)
            toast.error("Failed to Create Form", {
                description: err.message || "An unexpected error occurred."
            })
        }
    }

    const handleDeleteForm = (id: string, title: string) => {
        toast.info("Deletion Not Supported Yet", {
            description: `Deleting "${title}" is not implemented on the server.`
        })
    }

    // Map backend forms to FormItem structure
    const forms: FormItem[] = (backendForms || []).map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description || undefined,
        submissions: 0,
        createdAt: f.createdAt ? new Date(f.createdAt).toISOString().split("T")[0]! : "",
    }))

    // Filter forms based on search query
    const filteredForms = forms.filter(form =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Calculate dynamic dashboard stats
    const totalSubmissions = forms.reduce((acc, f) => acc + f.submissions, 0)
    const activeFormsCount = forms.length

    if (userLoading || formsLoading || !user) {
        return (
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#FAF9F6] text-zinc-900">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900 mb-4" />
                <span className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                    {userLoading ? "Securing Workspace..." : "Loading Forms..."}
                </span>
            </div>
        )
    }

    return (
        <div className="light min-h-screen w-full bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col relative overflow-x-hidden">

            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/25 rounded-full blur-3xl opacity-60 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/15 rounded-full blur-3xl opacity-50 pointer-events-none z-0" />

            {/* DASHBOARD NAVBAR */}
            <header className="relative z-10 w-full border-b border-zinc-200/40 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Brand */}
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

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-3 border-r border-zinc-200/60">
                            <div className="size-9 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                                {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="hidden sm:flex flex-col items-start text-left">
                                <span className="text-xs font-bold text-zinc-900 leading-none">{user.name}</span>
                                <span className="text-4xs text-zinc-400 font-semibold">{user.email}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <LogOut className="size-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>

                </div>
            </header>

            {/* MAIN DASHBOARD PANEL */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-12 flex flex-col gap-8">

                {/* Greeting & Quick Action */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Workspace</h1>
                        <p className="text-zinc-500 text-sm font-medium">
                            Create and manage smart type-safe forms.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-11 px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="size-5" />
                        Create Form
                    </Button>
                </div>

                {/* STATS HIGHLIGHT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Stat card 1 */}
                    <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-2xs flex items-center justify-between hover:translate-y-[-1px] transition-all">
                        <div className="space-y-1">
                            <span className="text-2xs font-semibold uppercase tracking-wider text-zinc-400">Active Forms</span>
                            <h3 className="text-2xl font-bold text-zinc-900">{activeFormsCount}</h3>
                        </div>
                        <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FileText className="size-5" />
                        </div>
                    </div>

                    {/* Stat card 2 */}
                    <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-2xs flex items-center justify-between hover:translate-y-[-1px] transition-all">
                        <div className="space-y-1">
                            <span className="text-2xs font-semibold uppercase tracking-wider text-zinc-400">Submissions</span>
                            <h3 className="text-2xl font-bold text-zinc-900">{totalSubmissions}</h3>
                        </div>
                        <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Activity className="size-5" />
                        </div>
                    </div>

                    {/* Stat card 3 */}
                    <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-2xs flex items-center justify-between hover:translate-y-[-1px] transition-all">
                        <div className="space-y-1">
                            <span className="text-2xs font-semibold uppercase tracking-wider text-zinc-400">Response Rate</span>
                            <h3 className="text-2xl font-bold text-zinc-900">
                                {activeFormsCount > 0 ? "98.4%" : "--"}
                            </h3>
                        </div>
                        <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Sliders className="size-5" />
                        </div>
                    </div>
                </div>

                {/* SEARCH & FILTERS */}
                <div className="w-full flex items-center gap-3">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-950 transition-colors">
                            <Search className="size-4.5" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search forms by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                        />
                    </div>
                </div>

                {/* FORMS LISTING / EMPTY STATE CONTAINER */}
                <div className="w-full min-h-[300px]">
                    {filteredForms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredForms.map((form) => (
                                <div
                                    key={form.id}
                                    className="bg-white border border-zinc-200/65 rounded-2xl p-6 shadow-2xs flex flex-col justify-between hover:border-zinc-300 hover:shadow-xs transition-all relative overflow-hidden group"
                                >
                                    {/* Glass visual border detail */}
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500/20 via-zinc-950/10 to-transparent" />

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-zinc-950 group-hover:text-zinc-900 transition-colors">
                                                {form.title}
                                            </h3>
                                            <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200/30">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-2">
                                            {form.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-100">
                                        <div className="flex gap-4 items-center">
                                            <div>
                                                <div className="text-3xs font-semibold uppercase tracking-wider text-zinc-400">Submissions</div>
                                                <div className="text-sm font-bold text-zinc-800">{form.submissions}</div>
                                            </div>
                                            <div className="h-6 w-[1px] bg-zinc-100" />
                                            <div>
                                                <div className="text-3xs font-semibold uppercase tracking-wider text-zinc-400">Created</div>
                                                <div className="text-xs font-semibold text-zinc-500">{form.createdAt}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2.5">
                                            <button
                                                onClick={() => router.push(`/dashboard/form/${form.id}`)}
                                                className="size-8.5 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center transition-colors cursor-pointer"
                                                title="Edit Form"
                                            >
                                                <Edit2 className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteForm(form.id, form.title)}
                                                className="size-8.5 rounded-lg border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                                                title="Delete Form"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                            <button
                                                className="h-8.5 px-3 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                                            >
                                                View API
                                                <ArrowUpRight className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-12 md:p-16 border border-dashed border-zinc-200/80 bg-white/40 rounded-2xl min-h-[360px] relative overflow-hidden backdrop-blur-xs select-none">
                            <div className="size-16 rounded-2xl bg-white border border-zinc-200/50 shadow-2xs flex items-center justify-center mb-6">
                                <PlusCircle className="size-8 text-zinc-400" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-950 mb-2">Create your first form</h3>
                            <p className="text-zinc-500 text-sm font-medium max-w-[340px] leading-relaxed mb-8">
                                Choose a title and description, and start collecting structured responses with absolute type safety.
                            </p>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                className="h-11 px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="size-4.5" />
                                Create Form
                            </Button>
                        </div>
                    )}
                </div>

            </main>

            {/* CREATE FORM DIALOG MODAL */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCreateOpen(false)}
                    />

                    {/* Modal Box */}
                    <div className="relative w-full max-w-[460px] bg-white border border-zinc-200/80 rounded-2xl shadow-2xl p-6 sm:p-8 transform scale-100 transition-all z-10 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-zinc-900">Create new form</h3>
                                <p className="text-zinc-500 text-xs font-semibold">
                                    Set up your form parameters to generate a tRPC route.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="size-7.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFormSubmit} className="space-y-4">

                            {/* Title */}
                            <div className="space-y-1.5">
                                <Label htmlFor="form-title" className="text-zinc-700 font-semibold text-xs">
                                    Form Title
                                </Label>
                                <Input
                                    id="form-title"
                                    type="text"
                                    placeholder="e.g. User Contact Form"
                                    value={formTitle}
                                    onChange={(e) => {
                                        setFormTitle(e.target.value)
                                        if (e.target.value) setFormErrors({ title: "" })
                                    }}
                                    disabled={createPending}
                                    className="h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                />
                                {formErrors.title && (
                                    <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 mt-1">
                                        <AlertCircle className="size-3.5" />
                                        {formErrors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <Label htmlFor="form-desc" className="text-zinc-700 font-semibold text-xs">
                                    Description <span className="text-zinc-400 font-normal">(Optional)</span>
                                </Label>
                                <textarea
                                    id="form-desc"
                                    placeholder="Describe the purpose of this form..."
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    disabled={createPending}
                                    rows={3}
                                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-base shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-zinc-900 focus-visible:ring-[3px] focus-visible:ring-zinc-900/5 placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed md:text-sm"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    disabled={createPending}
                                    className="flex-1 h-11 rounded-xl border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold transition-all cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createPending}
                                    className="flex-1 h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                                >
                                    {createPending ? (
                                        <>
                                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Form
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* FOOTER */}
            <footer className="relative z-10 w-full border-t border-zinc-200/40 bg-white py-8 text-center text-xs font-semibold text-zinc-400 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-zinc-500">© 2026 Special Forms Inc. All rights reserved.</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    )
}
