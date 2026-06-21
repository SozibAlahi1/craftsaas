import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, router, Link } from '@inertiajs/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Save, ArrowLeft, Monitor, Smartphone, Globe, LayoutGrid, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SortableSection } from '@/components/landing-builder/SortableSection';
import { SectionRenderer } from '@/components/landing-builder/SectionRenderer';
// import RightPanel from '@/components/landing-builder/RightPanel';
// import BuilderCanvas from '@/components/landing-builder/BuilderCanvas';

interface Page {
    id: number;
    title: string;
    slug: string;
    status: string;
    settings: any;
    sections: any[];
}

export default function Builder({ page }: { page: Page }) {
    const [sections, setSections] = useState<any[]>(page.sections || []);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [isPreviewMobile, setIsPreviewMobile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addSection = (type: string) => {
        const newSection = {
            id: `sec_${Date.now()}`,
            type,
            content: {},
            styles: {}
        };
        setSections([...sections, newSection]);
        setSelectedSectionId(newSection.id);
    };

    const updateSection = (id: string, updates: any) => {
        setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
        if (selectedSectionId === id) setSelectedSectionId(null);
    };

    const saveState = async () => {
        setIsSaving(true);
        try {
            await axios.post(route('admin.landing-pages.save', page.id), {
                sections,
                settings: page.settings,
            });
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    const publishPage = () => {
        if (confirm('Are you sure you want to publish this page?')) {
            router.post(route('admin.landing-pages.publish', page.id));
        }
    };

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            saveState();
        }, 30000);
        return () => clearInterval(interval);
    }, [sections]);

    const selectedSection = sections.find(s => s.id === selectedSectionId) || null;

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden font-sans">
            <Head title={`Builder: ${page.title}`} />

            {/* Topbar */}
            <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/landing-pages">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 leading-none">{page.title}</span>
                        <span className="text-[10px] font-bold uppercase text-slate-500 mt-1">{page.status}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setIsPreviewMobile(false)} 
                        className={`p-1.5 rounded-md transition-colors ${!isPreviewMobile ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Monitor className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => setIsPreviewMobile(true)} 
                        className={`p-1.5 rounded-md transition-colors ${isPreviewMobile ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Smartphone className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                        {isSaving ? 'Saving...' : 'All changes saved'}
                    </span>
                    <Button variant="outline" size="sm" onClick={saveState} disabled={isSaving} className="gap-2">
                        <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button size="sm" onClick={publishPage} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Globe className="h-4 w-4" /> Publish
                    </Button>
                </div>
            </header>

            {/* Main Builder Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-64 bg-white border-r border-slate-200 shrink-0 overflow-y-auto p-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">Add Section</h3>
                    <div className="grid gap-2">
                        {['hero', 'product_showcase', 'premium_hero', 'premium_showcase', 'premium_spice_grid', 'premium_features', 'premium_comparison', 'premium_reviews', 'premium_checkout'].map(type => (
                            <button
                                key={type}
                                onClick={() => addSection(type)}
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-left transition-colors group"
                            >
                                <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 font-black">
                                    +
                                </div>
                                <span className="text-sm font-bold text-slate-700 capitalize">{type.replace('_', ' ')}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Canvas */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100">
                    <div className={`transition-all duration-300 ease-in-out ${isPreviewMobile ? 'w-[375px]' : 'w-full max-w-5xl'}`}>
                        <div className={`bg-white min-h-[800px] shadow-xl ${isPreviewMobile ? 'rounded-[3rem] border-8 border-slate-900 overflow-hidden' : 'rounded-xl border border-slate-200'}`}>
                            
                            {sections.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                                    <LayoutGrid className="h-16 w-16 mb-4 opacity-20" />
                                    <p className="font-bold text-lg text-slate-900">Your page is empty</p>
                                    <p className="text-sm">Click a section on the left to add it.</p>
                                </div>
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                        <div className="divide-y divide-slate-100">
                                            {sections.map(section => (
                                                <SortableSection
                                                    key={section.id}
                                                    section={section}
                                                    isSelected={selectedSectionId === section.id}
                                                    onSelect={() => setSelectedSectionId(section.id)}
                                                    onDelete={() => deleteSection(section.id)}
                                                >
                                                    <div className={selectedSectionId === section.id ? 'opacity-90' : ''}>
                                                        <SectionRenderer section={section} />
                                                    </div>
                                                </SortableSection>
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}

                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-80 bg-white border-l border-slate-200 shrink-0 overflow-y-auto p-4 flex flex-col">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">Section Settings</h3>
                    
                    {!selectedSection ? (
                        <div className="text-center text-slate-400 p-8">
                            <p className="text-sm">Select a section to edit its properties.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs overflow-auto max-h-96">
                                <p className="font-bold mb-2 uppercase text-slate-500">Raw Data (Dev View)</p>
                                {JSON.stringify(selectedSection, null, 2)}
                            </div>

                            <div className="space-y-4 pb-12">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Custom CSS Classes</label>
                                    <Input 
                                        value={selectedSection.styles?.className || ''} 
                                        onChange={e => updateSection(selectedSection.id, { styles: { ...selectedSection.styles, className: e.target.value }})}
                                        placeholder="bg-indigo-600 text-white"
                                    />
                                </div>
                                
                                <div className="pt-4 border-t border-slate-200">
                                    <h4 className="text-sm font-bold text-slate-900 mb-3">Content Settings</h4>
                                    
                                    {(selectedSection.type === 'premium_hero' || selectedSection.type === 'premium_showcase' || selectedSection.type === 'premium_comparison' || selectedSection.type === 'premium_reviews' || selectedSection.type === 'premium_checkout') && (
                                        <div className="mb-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Headline / Title</label>
                                            <Input 
                                                value={selectedSection.content?.headline || ''} 
                                                onChange={e => updateSection(selectedSection.id, { content: { ...selectedSection.content, headline: e.target.value }})}
                                                placeholder="Enter headline..."
                                            />
                                        </div>
                                    )}

                                    {selectedSection.type === 'premium_hero' && (
                                        <div className="mb-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Subheadline</label>
                                            <Input 
                                                value={selectedSection.content?.subheadline || ''} 
                                                onChange={e => updateSection(selectedSection.id, { content: { ...selectedSection.content, subheadline: e.target.value }})}
                                            />
                                        </div>
                                    )}

                                    {selectedSection.type === 'premium_showcase' && (
                                        <div className="mb-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Description</label>
                                            <textarea 
                                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={selectedSection.content?.description || ''} 
                                                onChange={e => updateSection(selectedSection.id, { content: { ...selectedSection.content, description: e.target.value }})}
                                            />
                                        </div>
                                    )}

                                    {(selectedSection.type === 'premium_hero' || selectedSection.type === 'premium_showcase' || selectedSection.type === 'premium_spice_grid') && (
                                        <div className="mb-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Button Text</label>
                                            <Input 
                                                value={selectedSection.content?.button_text || ''} 
                                                onChange={e => updateSection(selectedSection.id, { content: { ...selectedSection.content, button_text: e.target.value }})}
                                            />
                                        </div>
                                    )}

                                    {selectedSection.type === 'premium_checkout' && (
                                        <>
                                            <div className="mb-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Product Name</label>
                                                <Input 
                                                    value={selectedSection.content?.product_name || ''} 
                                                    onChange={e => updateSection(selectedSection.id, { content: { ...selectedSection.content, product_name: e.target.value }})}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Price</label>
                                                <Input 
                                                    value={selectedSection.content?.price || ''} 
                                                    onChange={e => updateSection(selectedSection.id, { content: { ...selectedSection.content, price: e.target.value }})}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
// Note: This is a foundational shell. Real components for SortableSection and actual preview rendering will be added.
