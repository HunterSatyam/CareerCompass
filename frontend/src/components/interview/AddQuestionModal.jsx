import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';

const blankForm = {
    companyId: '',
    title: '',
    description: '',
    questionType: 'Subjective',
    difficulty: 'Medium',
    category: 'Technical',
    role: '',
    tagsText: '',
    optionsText: '',
    correctOption: 0,
    sampleAnswer: '',
    codeSnippet: '',
    solutionCode: '',
    tips: ''
};

const AddQuestionModal = ({ open, onClose, companies = [], roles = [], defaults = {}, onQuestionAdded }) => {
    const [form, setForm] = useState({ ...blankForm, ...defaults });
    const selectedCompany = companies.find((company) => company._id === form.companyId);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (open) setForm({ ...blankForm, ...defaults });
    }, [open, defaults]);

    if (!open) return null;

    const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

    const buildQuestion = () => {
        const options = form.optionsText
            .split('\n')
            .map((option) => option.trim())
            .filter(Boolean);
        const tags = form.tagsText
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        return {
            _id: `local-${Date.now()}`,
            company: selectedCompany,
            companyId: form.companyId,
            companyName: selectedCompany?.name,
            title: form.title.trim(),
            description: form.description.trim(),
            questionType: form.questionType,
            type: form.questionType,
            difficulty: form.difficulty,
            category: form.category,
            role: form.role,
            tags,
            options,
            correctOption: Number(form.correctOption) || 0,
            sampleAnswer: form.sampleAnswer,
            codeSnippet: form.codeSnippet,
            solutionCode: form.solutionCode,
            tips: form.tips,
            explanation: form.sampleAnswer || form.solutionCode || form.tips
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.title.trim()) {
            toast.error('Question title is required');
            return;
        }

        const localQuestion = buildQuestion();
        if (!form.companyId) {
            toast.error('Select a company to save a real interview question');
            return;
        }

        try {
            const payload = {
                companyId: form.companyId,
                title: localQuestion.title,
                description: localQuestion.description,
                questionType: localQuestion.questionType,
                difficulty: localQuestion.difficulty,
                category: localQuestion.category,
                role: localQuestion.role,
                tags: localQuestion.tags,
                options: localQuestion.options,
                correctOption: localQuestion.correctOption,
                sampleAnswer: localQuestion.sampleAnswer,
                codeSnippet: localQuestion.codeSnippet,
                solutionCode: localQuestion.solutionCode,
                tips: localQuestion.tips
            };
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/question/create`, payload, { withCredentials: true });
            onQuestionAdded?.(res.data?.question || localQuestion);
            toast.success('Question added');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save question');
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            <button type="button" aria-label="Close add question modal" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <form onSubmit={handleSubmit} className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-white p-6 shadow-2xl dark:bg-zinc-900">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-500">Mock preparation</p>
                        <h2 className="text-2xl font-black">Add interview question</h2>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Question title</label>
                        <Input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Enter question title" className="rounded-xl" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Description</label>
                        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Add prompt details" className="min-h-24 w-full rounded-xl border border-border bg-background p-3" />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Company</label>
                        <select value={form.companyId} onChange={(event) => updateField('companyId', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3">
                            <option value="">No company</option>
                            {companies.map((company) => <option key={company._id || company.name} value={company._id || ''}>{company.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Role</label>
                        <select value={form.role} onChange={(event) => updateField('role', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3">
                            <option value="">Any role</option>
                            {roles.map((role) => <option key={role.name} value={role.name}>{role.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Type</label>
                        <select value={form.questionType} onChange={(event) => updateField('questionType', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3">
                            <option>Subjective</option>
                            <option>Objective</option>
                            <option>Coding</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Difficulty</label>
                        <select value={form.difficulty} onChange={(event) => updateField('difficulty', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Category</label>
                        <Input value={form.category} onChange={(event) => updateField('category', event.target.value)} placeholder="Technical, HR, DSA..." className="rounded-xl" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Tags</label>
                        <Input value={form.tagsText} onChange={(event) => updateField('tagsText', event.target.value)} placeholder="DSA, API, SQL, React" className="rounded-xl" />
                    </div>

                    {form.questionType === 'Objective' && (
                        <>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Options, one per line</label>
                                <textarea value={form.optionsText} onChange={(event) => updateField('optionsText', event.target.value)} className="min-h-28 w-full rounded-xl border border-border bg-background p-3" placeholder="Option A&#10;Option B&#10;Option C&#10;Option D" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Correct option number</label>
                                <Input type="number" min="0" value={form.correctOption} onChange={(event) => updateField('correctOption', event.target.value)} className="rounded-xl" />
                            </div>
                        </>
                    )}

                    {form.questionType === 'Coding' && (
                        <>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Starter code</label>
                                <textarea value={form.codeSnippet} onChange={(event) => updateField('codeSnippet', event.target.value)} className="min-h-28 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Solution</label>
                                <textarea value={form.solutionCode} onChange={(event) => updateField('solutionCode', event.target.value)} className="min-h-24 w-full rounded-xl border border-border bg-background p-3" />
                            </div>
                        </>
                    )}

                    {form.questionType === 'Subjective' && (
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Sample answer</label>
                            <textarea value={form.sampleAnswer} onChange={(event) => updateField('sampleAnswer', event.target.value)} className="min-h-24 w-full rounded-xl border border-border bg-background p-3" />
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-500">Tips</label>
                        <textarea value={form.tips} onChange={(event) => updateField('tips', event.target.value)} className="min-h-20 w-full rounded-xl border border-border bg-background p-3" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
                    <Button type="submit" className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Add Question</Button>
                </div>
            </form>
        </div>
    );
};

export default AddQuestionModal;
