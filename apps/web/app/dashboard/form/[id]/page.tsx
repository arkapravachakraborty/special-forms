"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Plus,
    FileText,
    Check,
    HelpCircle,
    Loader2,
    Eye,
    Sparkles,
    Asterisk,
    FileCheck,
    Layers
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useCreateField, useGetFeild } from "~/hooks/api/form-field"

export default function FormBuilder() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    // Get field query and mutation hooks
    const { fields, isLoading: fieldsLoading } = useGetFeild(id)
    const { createFieldAsync, isPending: createPending } = useCreateField(id)

    // Form metadata state from localStorage fallback
    const [formTitle, setFormTitle] = useState("Form Schema Builder")
    const [formDesc, setFormDesc] = useState("")

    // New field state
    const [label, setLabel] = useState("")
    const [type, setType] = useState<"TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD">("TEXT")
    const [placeholder, setPlaceholder] = useState("")
    const [description, setDescription] = useState("")
    const [isRequired, setIsRequired] = useState(false)
    const [formErrors, setFormErrors] = useState({ label: "" })

    useEffect(() => {
        const storedForms = localStorage.getItem("special_forms_data")
        if (storedForms && id) {
            try {
                const formsList = JSON.parse(storedForms)
                const currentForm = formsList.find((f: any) => f.id === id)
                if (currentForm) {
                    setFormTitle(currentForm.title)
                    setFormDesc(currentForm.description || "")
                }
            } catch (e) {
                console.error(e)
            }
        }
    }, [id])

    const handleAddField = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!label.trim()) {
            setFormErrors({ label: "Field label is required" })
            return
        }

        try {
            await createFieldAsync({
                formId: id,
                label,
                type,
                placeholder: placeholder || undefined,
                description: description || undefined,
                isRequired
            })

            toast.success("Field Added to Schema!", {
                description: `Successfully created "${label}" as a ${type} field.`
            })

            // Reset field states
            setLabel("")
            setType("TEXT")
            setPlaceholder("")
            setDescription("")
            setIsRequired(false)
            setFormErrors({ label: "" })
        } catch (err: any) {
            console.error(err)
            toast.error("Failed to Add Field", {
                description: err.message || "An unexpected error occurred."
            })
        }
    }

    return (
        <div className="light min-h-screen w-full bg-[#FAF9F6] text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col relative overflow-x-hidden">

            {/* Background ambient glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/25 rounded-full blur-3xl opacity-60 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/15 rounded-full blur-3xl opacity-50 pointer-events-none z-0" />

            {/* HEADER NAVBAR */}
            <header className="relative z-10 w-full border-b border-zinc-200/40 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Back Navigation & Info */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="size-9 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Back to Workspace"
                        >
                            <ArrowLeft className="size-4.5" />
                        </button>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-zinc-900 leading-none">{formTitle}</span>
                            <span className="text-3xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
                                Schema Builder
                            </span>
                        </div>
                    </div>

                    {/* Platform Tag */}
                    <div className="px-3 py-1 rounded-full bg-zinc-950 text-white text-3xs font-bold tracking-wide uppercase shadow-sm">
                        ✦ Special Forms v2.0
                    </div>

                </div>
            </header>

            {/* MAIN SCHEMA WORKSPACE */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-12 flex flex-col lg:flex-row gap-8">

                {/* LEFT PANEL - DYNAMIC SCHEMA PREVIEW */}
                <div className="flex-1 flex flex-col gap-6 lg:max-w-[60%]">

                    <div className="bg-white border border-zinc-200/60 p-6 rounded-2xl shadow-2xs space-y-2">
                        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Form Preview Outline</h2>
                        <p className="text-zinc-500 text-sm font-medium">
                            {formDesc || "This schema outlines the fields collected upon form submission."}
                        </p>
                    </div>

                    {/* Form Fields List */}
                    <div className="flex-1 flex flex-col gap-4 min-h-[300px]">
                        {fieldsLoading ? (
                            <div className="flex-1 flex flex-col justify-center items-center p-12 border border-dashed border-zinc-200 bg-white/40 rounded-2xl min-h-[300px]">
                                <Loader2 className="w-7 h-7 animate-spin text-zinc-400 mb-3" />
                                <span className="text-2xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Loading Schema Fields...
                                </span>
                            </div>
                        ) : fields && fields.length > 0 ? (
                            <div className="space-y-4">
                                {fields.map((field, idx) => (
                                    <div
                                        key={field.id}
                                        className="bg-white border border-zinc-200/65 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-zinc-300 transition-all relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Index circle */}
                                            <div className="size-8 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-400 flex items-center justify-center">
                                                {idx + 1}
                                            </div>

                                            <div className="text-left space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-zinc-950 text-sm">{field.label}</span>
                                                    {field.isRequired && (
                                                        <Asterisk className="size-3.5 text-rose-500" />
                                                    )}
                                                </div>
                                                <div className="flex gap-2 items-center text-3xs font-bold uppercase text-zinc-400">
                                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100/30">
                                                        {field.type}
                                                    </span>
                                                    <span>Key: {field.labelKey}</span>
                                                </div>
                                                {field.placeholder && (
                                                    <p className="text-3xs text-zinc-400 font-medium italic">
                                                        Placeholder: "{field.placeholder}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-3xs font-semibold text-zinc-400">
                                                {field.createdAt ? field.createdAt.split("T")[0] : "--"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-200/80 bg-white/40 rounded-2xl min-h-[300px] backdrop-blur-xs select-none">
                                <div className="size-12 rounded-xl bg-white border border-zinc-200/50 shadow-2xs flex items-center justify-center mb-4">
                                    <FileText className="size-6 text-zinc-400" />
                                </div>
                                <h3 className="font-bold text-zinc-950 text-sm mb-1.5">No schema fields added yet</h3>
                                <p className="text-zinc-500 text-2xs font-medium max-w-[280px] leading-relaxed">
                                    Add your first input field on the right panel to define your form validation parameters.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT PANEL - DYNAMIC SCHEMA MODIFIERS */}
                <div className="w-full lg:w-[40%]">

                    <div className="bg-white border border-zinc-200/65 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 flex flex-col">

                        <div className="flex items-start gap-3 border-b border-zinc-100 pb-4">
                            <div className="size-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                                <Sparkles className="size-4.5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-sm text-zinc-950">Add Input Field</h3>
                                <p className="text-zinc-500 text-3xs font-semibold">
                                    Configure new field keys for database validation.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAddField} className="space-y-4">

                            {/* Field Label */}
                            <div className="space-y-1.5">
                                <Label htmlFor="field-label" className="text-zinc-700 font-semibold text-xs">
                                    Field Label
                                </Label>
                                <Input
                                    id="field-label"
                                    type="text"
                                    placeholder="e.g. Email Address, Phone Number"
                                    value={label}
                                    onChange={(e) => {
                                        setLabel(e.target.value)
                                        if (e.target.value) setFormErrors({ label: "" })
                                    }}
                                    disabled={createPending}
                                    className="h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                />
                                {formErrors.label && (
                                    <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 mt-1">
                                        <Loader2 className="size-3.5" />
                                        {formErrors.label}
                                    </p>
                                )}
                            </div>

                            {/* Field Type Select */}
                            <div className="space-y-1.5">
                                <Label htmlFor="field-type" className="text-zinc-700 font-semibold text-xs">
                                    Field Type
                                </Label>
                                <select
                                    id="field-type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    disabled={createPending}
                                    className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-3 shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-zinc-900 focus-visible:ring-[3px] focus-visible:ring-zinc-900/5 text-sm font-medium text-zinc-900 cursor-pointer"
                                >
                                    <option value="TEXT">TEXT (Single-line Input)</option>
                                    <option value="EMAIL">EMAIL (Standard Email check)</option>
                                    <option value="PASSWORD">PASSWORD (Secured Input)</option>
                                    <option value="NUMBER">NUMBER (Integer / Float value)</option>
                                    <option value="YES_NO">YES_NO (Boolean Checkbox)</option>
                                </select>
                            </div>

                            {/* Placeholder */}
                            <div className="space-y-1.5">
                                <Label htmlFor="field-placeholder" className="text-zinc-700 font-semibold text-xs">
                                    Placeholder Text <span className="text-zinc-400 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="field-placeholder"
                                    type="text"
                                    placeholder="e.g. johndoe@company.com"
                                    value={placeholder}
                                    onChange={(e) => setPlaceholder(e.target.value)}
                                    disabled={createPending}
                                    className="h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                />
                            </div>

                            {/* Description Helper */}
                            <div className="space-y-1.5">
                                <Label htmlFor="field-desc" className="text-zinc-700 font-semibold text-xs">
                                    Description <span className="text-zinc-400 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="field-desc"
                                    type="text"
                                    placeholder="Provide brief helper text shown under input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={createPending}
                                    className="h-11 rounded-xl bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900/5 focus-visible:border-zinc-900 shadow-2xs transition-all"
                                />
                            </div>

                            {/* Is Required toggle checkbox */}
                            <div className="flex items-center gap-2.5 pt-2">
                                <input
                                    id="field-required"
                                    type="checkbox"
                                    checked={isRequired}
                                    onChange={(e) => setIsRequired(e.target.checked)}
                                    disabled={createPending}
                                    className="w-4.5 h-4.5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 focus:ring-2 cursor-pointer disabled:opacity-50"
                                />
                                <Label htmlFor="field-required" className="text-zinc-600 font-semibold text-xs cursor-pointer select-none">
                                    Mark as required field
                                </Label>
                            </div>

                            {/* Add CTA */}
                            <Button
                                type="submit"
                                disabled={createPending}
                                className="w-full h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all font-semibold shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                            >
                                {createPending ? (
                                    <>
                                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                        Adding to Schema...
                                    </>
                                ) : (
                                    <>
                                        Add Field to Schema
                                        <Plus className="size-4" />
                                    </>
                                )}
                            </Button>

                        </form>

                    </div>

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
