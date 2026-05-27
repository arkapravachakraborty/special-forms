"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
    ArrowLeft, 
    FileSpreadsheet, 
    Calendar, 
    Download, 
    CheckCircle, 
    XCircle, 
    HelpCircle, 
    Loader2, 
    Share2, 
    Copy,
    AlertTriangle,
    Database
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { useUser } from "~/hooks/api/auth"
import { useGetFormWithFeilds } from "~/hooks/api/form"
import { useGetSubmissionsByFormId } from "~/hooks/api/form-submission"

export default function SubmissionsViewer() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    // Fetch user context for authentication check
    const { user, isLoading: userLoading } = useUser()

    // Fetch form structure
    const { form, isLoading: formLoading, error: formError } = useGetFormWithFeilds(id)

    // Fetch submissions
    const { submissions, isLoading: subsLoading, error: subsError } = useGetSubmissionsByFormId(id)

    // Enforce authentication
    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/signin")
        }
    }, [user, userLoading, router])

    const handleCopyLink = () => {
        const url = `${window.location.origin}/form/${id}`
        navigator.clipboard.writeText(url)
        toast.success("Public URL Copied!", {
            description: "Form link copied to clipboard. Share it with your respondents!"
        })
    }

    if (userLoading || formLoading || subsLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#FAF9F6] text-zinc-900">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900 mb-4" />
                <span className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                    Loading Submissions...
                </span>
            </div>
        )
    }

    // Access authorization check
    if (formError || subsError || !form) {
        return (
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#FAF9F6] text-zinc-900 p-6 text-center select-none">
                <div className="size-16 rounded-2xl bg-white border border-zinc-200/50 shadow-2xs flex items-center justify-center mb-6 text-amber-600">
                    <AlertTriangle className="size-8" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">Access Restrained</h2>
                <p className="text-zinc-500 text-sm font-medium max-w-[360px] leading-relaxed mb-6">
                    You do not have permission to view submissions for this form. Only the authenticated form creator can access response details.
                </p>
                <Button 
                    onClick={() => router.push("/dashboard")}
                    className="h-10 px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold"
                >
                    Return to Workspace
                </Button>
            </div>
        )
    }

    // Helper to extract submission values by form field ID
    const getFieldValue = (subValues: Array<{ fieldId: string, value: string }>, fieldId: string) => {
        const match = subValues.find(v => v.fieldId === fieldId)
        return match ? match.value : ""
    }

    return (
        <div className="light min-h-screen w-full bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col relative overflow-x-hidden">
            
            {/* Ambient decorative glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/25 rounded-full blur-3xl opacity-60 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/15 rounded-full blur-3xl opacity-50 pointer-events-none z-0" />

            {/* HEADER NAVBAR */}
            <header className="relative z-10 w-full border-b border-zinc-200/40 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="size-9 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Back to Workspace"
                        >
                            <ArrowLeft className="size-4.5" />
                        </button>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-zinc-900 leading-none">{form.title}</span>
                            <span className="text-3xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
                                Submissions Inspector
                            </span>
                        </div>
                    </div>

                    {/* Quick share action */}
                    <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="h-9 px-4 rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 font-semibold shadow-2xs text-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Copy className="size-3.5" />
                        Copy Share Link
                    </Button>

                </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-12 flex flex-col gap-8">
                
                {/* Greeting & Header Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Responses</h1>
                        <p className="text-zinc-500 text-sm font-medium">
                            Analyze database responses collected via your public tRPC schema endpoint.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-zinc-200/50 px-4 py-2.5 rounded-xl shadow-2xs">
                        <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Database className="size-4.5" />
                        </div>
                        <div className="text-left">
                            <div className="text-4xs font-bold uppercase tracking-wider text-zinc-400">Total Submissions</div>
                            <div className="text-sm font-bold text-zinc-900">{submissions?.length || 0}</div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC DATA TABLE / EMPTY STATE */}
                <div className="w-full flex-1 min-h-[360px]">
                    {submissions && submissions.length > 0 ? (
                        <div className="bg-white border border-zinc-200/70 rounded-2xl shadow-2xs overflow-hidden flex flex-col">
                            
                            {/* Table Frame with horizontal scroll wrapper */}
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50/50 border-b border-zinc-200/40">
                                            {/* Static count column */}
                                            <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider w-16 text-center">
                                                #
                                            </th>
                                            
                                            {/* Dynamic Schema Columns */}
                                            {form.fields.map(field => (
                                                <th 
                                                    key={field.id}
                                                    className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[140px]"
                                                >
                                                    {field.label}
                                                </th>
                                            ))}

                                            {/* Timestamp column */}
                                            <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[160px]">
                                                Submitted At
                                            </th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {submissions.map((sub, sIdx) => (
                                            <tr 
                                                key={sub.id}
                                                className="border-b border-zinc-100 hover:bg-[#FAF9F6]/20 transition-colors"
                                            >
                                                {/* Count index */}
                                                <td className="p-4 text-xs font-bold text-zinc-400 text-center">
                                                    {sIdx + 1}
                                                </td>

                                                {/* Dynamic Values mapping based on database schemas */}
                                                {form.fields.map(field => {
                                                    const rawVal = getFieldValue(sub.values, field.id)
                                                    
                                                    return (
                                                        <td key={field.id} className="p-4 text-sm font-medium text-zinc-800">
                                                            {field.type === "YES_NO" ? (
                                                                rawVal === "true" ? (
                                                                    <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-full">
                                                                        <CheckCircle className="size-3" />
                                                                        Yes
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-2xs font-bold text-zinc-400 bg-zinc-50 border border-zinc-200/50 px-2.5 py-0.5 rounded-full">
                                                                        <XCircle className="size-3" />
                                                                        No
                                                                    </span>
                                                                )
                                                            ) : field.type === "PASSWORD" ? (
                                                                <span className="text-zinc-400 font-mono tracking-wider">••••••••</span>
                                                            ) : (
                                                                rawVal || <span className="text-zinc-300 font-normal italic">empty</span>
                                                            )}
                                                        </td>
                                                    )
                                                })}

                                                {/* Date and time */}
                                                <td className="p-4 text-xs font-semibold text-zinc-500">
                                                    {sub.createdAt ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="size-3.5 text-zinc-400" />
                                                            {new Date(sub.createdAt).toLocaleString(undefined, {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </div>
                                                    ) : "--"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    ) : (
                        /* Empty state responses */
                        <div className="flex flex-col items-center justify-center text-center p-12 md:p-16 border border-dashed border-zinc-200/80 bg-white/40 rounded-2xl min-h-[360px] backdrop-blur-xs select-none">
                            <div className="size-16 rounded-2xl bg-white border border-zinc-200/50 shadow-2xs flex items-center justify-center mb-6">
                                <FileSpreadsheet className="size-8 text-zinc-400" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-950 mb-2">No responses yet</h3>
                            <p className="text-zinc-500 text-sm font-medium max-w-[340px] leading-relaxed mb-8">
                                Share your public form schema URL with your audience to begin gathering encrypted records.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleCopyLink}
                                    className="h-11 px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center gap-2 cursor-pointer"
                                >
                                    <Copy className="size-4" />
                                    Copy Public Link
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </main>

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
