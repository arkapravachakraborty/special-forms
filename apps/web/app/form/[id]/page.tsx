"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Mail,
    Lock,
    Type,
    Hash,
    Check,
    AlertCircle,
    Loader2,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Undo2
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useGetFormWithFeilds } from "~/hooks/api/form"
import { useCreateSubmission } from "~/hooks/api/form-submission"

export default function PublicForm() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    // Fetch form and form fields
    const { form, isLoading, error } = useGetFormWithFeilds(id)

    // Real tRPC submission hook
    const { createSubmissionAsync } = useCreateSubmission()

    // Form inputs state
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

    // Initialize responses state when form fields are loaded
    useEffect(() => {
        if (form?.fields) {
            const initialResponses: Record<string, any> = {}
            form.fields.forEach(field => {
                if (field.type === "YES_NO") {
                    initialResponses[field.labelKey] = false
                } else {
                    initialResponses[field.labelKey] = ""
                }
            })
            setResponses(initialResponses)
        }
    }, [form])

    const handleInputChange = (labelKey: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [labelKey]: value
        }))
        if (formErrors[labelKey]) {
            setFormErrors(prev => ({
                ...prev,
                [labelKey]: ""
            }))
        }
    }

    const togglePasswordVisibility = (labelKey: string) => {
        setShowPassword(prev => ({
            ...prev,
            [labelKey]: !prev[labelKey]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form?.fields) return

        // Client-side validation checks
        const errors: Record<string, string> = {}
        form.fields.forEach(field => {
            const val = responses[field.labelKey]
            if (field.isRequired) {
                if (field.type === "YES_NO") {
                    if (val !== true) {
                        errors[field.labelKey] = `${field.label} must be checked/accepted`
                    }
                } else if (!val || String(val).trim() === "") {
                    errors[field.labelKey] = `${field.label} is required`
                }
            }

            // Email check
            if (field.type === "EMAIL" && val) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(String(val))) {
                    errors[field.labelKey] = "Please enter a valid email address"
                }
            }
        })

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error("Form Validation Error", {
                description: "Please check the required fields and try again."
            })
            return
        }

        // Real database tRPC submission
        setIsSubmitting(true)
        try {
            const submissionValues = form.fields.map(field => {
                const val = responses[field.labelKey]
                return {
                    fieldId: field.id,
                    value: val === undefined || val === null ? "" : String(val)
                }
            })

            await createSubmissionAsync({
                formId: id,
                values: submissionValues
            })

            // Koordinations-Highlight: Update submissions count in localStorage list
            const storedForms = localStorage.getItem("special_forms_data")
            if (storedForms) {
                try {
                    const formsList = JSON.parse(storedForms)
                    const updated = formsList.map((f: any) => {
                        if (f.id === id) {
                            return { ...f, submissions: f.submissions + 1 }
                        }
                        return f
                    })
                    localStorage.setItem("special_forms_data", JSON.stringify(updated))
                } catch (e) {
                    console.error("Local storage synchronizer error:", e)
                }
            }

            toast.success("Response Submitted!", {
                description: "Your submission has been securely captured by Special Forms."
            })
            setIsSuccess(true)
        } catch (err: any) {
            console.error(err)
            toast.error("Submission Failed", {
                description: err.message || "An unexpected error occurred. Please try again."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setIsSuccess(false)
        if (form?.fields) {
            const cleared: Record<string, any> = {}
            form.fields.forEach(field => {
                if (field.type === "YES_NO") {
                    cleared[field.labelKey] = false
                } else {
                    cleared[field.labelKey] = ""
                }
            })
            setResponses(cleared)
            setFormErrors({})
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#FAF9F6] text-zinc-900">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900 mb-4" />
                <span className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                    Fetching Form Schema...
                </span>
            </div>
        )
    }

    if (error || !form) {
        return (
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#FAF9F6] text-zinc-900 p-6 text-center select-none">
                <div className="size-16 rounded-2xl bg-white border border-zinc-200/50 shadow-2xs flex items-center justify-center mb-6 text-rose-500">
                    <AlertCircle className="size-8" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">Form Not Found</h2>
                <p className="text-zinc-500 text-sm font-medium max-w-[340px] leading-relaxed mb-6">
                    The form URL is invalid or the administrator has removed this form from Special Forms.
                </p>
                <Button
                    onClick={() => router.push("/")}
                    className="h-10 px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold"
                >
                    Back to Homepage
                </Button>
            </div>
        )
    }

    return (
        <div className="light min-h-screen w-full bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-x-hidden">

            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/10 rounded-full blur-3xl opacity-50 pointer-events-none z-0" />

            {/* Central Form Container */}
            <div className="relative z-10 w-full max-w-[560px] bg-white border border-zinc-200/70 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-300">

                {/* Form header branding */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200/50 shadow-2xs text-3xs font-bold text-zinc-500 uppercase tracking-wider mb-8 w-fit select-none mx-auto sm:mx-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/10" />
                    <span>Powered by Special Forms</span>
                </div>

                {!isSuccess ? (
                    <div className="space-y-8">
                        {/* Title block */}
                        <div className="text-center sm:text-left space-y-2 border-b border-zinc-100 pb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 leading-tight">{form.title}</h1>
                            {form.description && (
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                    {form.description}
                                </p>
                            )}
                        </div>

                        {/* Interactive Form fields rendering */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {form.fields.map((field) => (
                                <div key={field.id} className="space-y-1.5 text-left group">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor={field.labelKey} className="text-zinc-700 font-semibold text-xs flex items-center gap-1">
                                            {field.label}
                                            {field.isRequired && <span className="text-rose-500 text-xs">*</span>}
                                        </Label>
                                        {field.description && (
                                            <span className="text-4xs font-semibold text-zinc-400">
                                                {field.description}
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative">
                                        {/* Dynamic Icon Prefixes */}
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-950 transition-colors">
                                            {field.type === "EMAIL" && <Mail className="size-4" />}
                                            {field.type === "PASSWORD" && <Lock className="size-4" />}
                                            {field.type === "NUMBER" && <Hash className="size-4" />}
                                            {field.type === "TEXT" && <Type className="size-4" />}
                                        </div>

                                        {/* Inputs logic */}
                                        {field.type === "YES_NO" ? (
                                            <div className="flex items-center gap-3 p-3.5 border border-zinc-200 rounded-xl bg-white/40 backdrop-blur-xs hover:border-zinc-300 transition-colors">
                                                <input
                                                    id={field.labelKey}
                                                    type="checkbox"
                                                    checked={responses[field.labelKey] === true}
                                                    onChange={(e) => handleInputChange(field.labelKey, e.target.checked)}
                                                    disabled={isSubmitting}
                                                    className="w-4.5 h-4.5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 focus:ring-2 cursor-pointer disabled:opacity-50"
                                                />
                                                <Label htmlFor={field.labelKey} className="text-zinc-500 font-medium text-xs cursor-pointer select-none">
                                                    {field.placeholder || "I agree to the requested schema conditions."}
                                                </Label>
                                            </div>
                                        ) : (
                                            <>
                                                <Input
                                                    id={field.labelKey}
                                                    type={field.type === "PASSWORD" ? (showPassword[field.labelKey] ? "text" : "password") : field.type === "NUMBER" ? "number" : "text"}
                                                    placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                                                    value={responses[field.labelKey] || ""}
                                                    onChange={(e) => handleInputChange(field.labelKey, e.target.value)}
                                                    disabled={isSubmitting}
                                                    className="pl-10 pr-10 h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                                />

                                                {/* Password Show/Hide Toggle */}
                                                {field.type === "PASSWORD" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePasswordVisibility(field.labelKey)}
                                                        disabled={isSubmitting}
                                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
                                                    >
                                                        {showPassword[field.labelKey] ? (
                                                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Field-specific Validation Alerts */}
                                    {formErrors[field.labelKey] && (
                                        <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                                            <AlertCircle className="size-3.5" />
                                            {formErrors[field.labelKey]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Submit response CTA */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.99]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4.5 h-4.5 animate-spin mr-1" />
                                        Submitting Response...
                                    </>
                                ) : (
                                    <>
                                        Submit Response
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                ) : (
                    /* SUCCESS SCREEN */
                    <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 select-none">

                        {/* Huge Success Checkmark */}
                        <div className="size-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                            <CheckCircle2 className="size-9 animate-pulse" />
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-950">Response Submitted!</h2>
                            <p className="text-zinc-500 text-sm font-medium max-w-[340px] leading-relaxed mx-auto">
                                Thank you for filling out this form. Your response has been securely logged by Special Forms.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 max-w-[240px] mx-auto">
                            <Button
                                onClick={resetForm}
                                variant="outline"
                                className="w-full h-11 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 font-semibold shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                            >
                                <Undo2 className="size-4" />
                                Submit another response
                            </Button>
                        </div>

                    </div>
                )}

            </div>

            {/* Footer */}
            <span className="relative z-10 text-3xs font-semibold text-zinc-400/80 mt-8 select-none">
                This form is protected and encrypted by Special Forms Inc.
            </span>

        </div>
    )
}
