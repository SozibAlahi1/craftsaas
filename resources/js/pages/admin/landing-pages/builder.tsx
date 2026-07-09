import { SectionRenderer } from '@/components/landing-builder/SectionRenderer';
import { SortableSection } from '@/components/landing-builder/SortableSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Globe, LayoutGrid, Monitor, Save, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
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
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addSection = (type: string) => {
        const newSection = {
            id: `sec_${Date.now()}`,
            type,
            content: {},
            styles: {},
        };
        setSections([...sections, newSection]);
        setSelectedSectionId(newSection.id);
    };

    const updateSection = (id: string, updates: any) => {
        setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const deleteSection = (id: string) => {
        setSections(sections.filter((s) => s.id !== id));
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
            console.error('Failed to save:', error);
            alert('Failed to save. Check console.');
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

    const selectedSection = sections.find((s) => s.id === selectedSectionId) || null;

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 font-sans">
            <Head title={`Builder: ${page.title}`} />

            {/* Topbar */}
            <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/landing-pages">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex flex-col">
                        <span className="leading-none font-black text-slate-900">{page.title}</span>
                        <span className="mt-1 text-[10px] font-bold text-slate-500 uppercase">{page.status}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
                    <button
                        onClick={() => setIsPreviewMobile(false)}
                        className={`rounded-md p-1.5 transition-colors ${!isPreviewMobile ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Monitor className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsPreviewMobile(true)}
                        className={`rounded-md p-1.5 transition-colors ${isPreviewMobile ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Smartphone className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">{isSaving ? 'Saving...' : 'All changes saved'}</span>
                    <Button variant="outline" size="sm" onClick={saveState} disabled={isSaving} className="gap-2">
                        <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button size="sm" onClick={publishPage} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                        <Globe className="h-4 w-4" /> Publish
                    </Button>
                </div>
            </header>

            {/* Main Builder Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
                    <h3 className="mb-4 text-xs font-black tracking-wider text-slate-500 uppercase">Add Section</h3>
                    <div className="grid gap-2">
                        {[
                            'hero',
                            'product_showcase',
                            'premium_hero',
                            'premium_showcase',
                            'premium_spice_grid',
                            'premium_features',
                            'premium_comparison',
                            'premium_reviews',
                            'premium_checkout',
                        ].map((type) => (
                            <button
                                key={type}
                                onClick={() => addSection(type)}
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-indigo-600 hover:bg-indigo-50"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-black text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                                    +
                                </div>
                                <span className="text-sm font-bold text-slate-700 capitalize">{type.replace('_', ' ')}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Canvas */}
                <div className="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-8">
                    <div className={`transition-all duration-300 ease-in-out ${isPreviewMobile ? 'w-[375px]' : 'w-full max-w-5xl'}`}>
                        <div
                            className={`min-h-[800px] bg-white shadow-xl ${isPreviewMobile ? 'overflow-hidden rounded-[3rem] border-8 border-slate-900' : 'rounded-xl border border-slate-200'}`}
                        >
                            {sections.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center p-12 text-center text-slate-400">
                                    <LayoutGrid className="mb-4 h-16 w-16 opacity-20" />
                                    <p className="text-lg font-bold text-slate-900">Your page is empty</p>
                                    <p className="text-sm">Click a section on the left to add it.</p>
                                </div>
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                                        <div className="divide-y divide-slate-100">
                                            {sections.map((section) => (
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
                <div className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-4">
                    <h3 className="mb-4 text-xs font-black tracking-wider text-slate-500 uppercase">Section Settings</h3>

                    {!selectedSection ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">Select a section to edit its properties.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="max-h-96 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
                                <p className="mb-2 font-bold text-slate-500 uppercase">Raw Data (Dev View)</p>
                                {JSON.stringify(selectedSection, null, 2)}
                            </div>

                            <div className="space-y-4 pb-12">
                                <div>
                                    <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Custom CSS Classes</label>
                                    <Input
                                        value={selectedSection.styles?.className || ''}
                                        onChange={(e) =>
                                            updateSection(selectedSection.id, { styles: { ...selectedSection.styles, className: e.target.value } })
                                        }
                                        placeholder="bg-indigo-600 text-white"
                                    />
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <h4 className="mb-3 text-sm font-bold text-slate-900">Content Settings</h4>

                                    {(selectedSection.type === 'premium_hero' ||
                                        selectedSection.type === 'premium_showcase' ||
                                        selectedSection.type === 'premium_comparison' ||
                                        selectedSection.type === 'premium_reviews' ||
                                        selectedSection.type === 'premium_checkout') && (
                                        <div className="mb-3">
                                            <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                Headline / Title
                                            </label>
                                            <Input
                                                value={selectedSection.content?.headline || ''}
                                                onChange={(e) =>
                                                    updateSection(selectedSection.id, {
                                                        content: { ...selectedSection.content, headline: e.target.value },
                                                    })
                                                }
                                                placeholder="Enter headline..."
                                            />
                                        </div>
                                    )}

                                    {selectedSection.type === 'premium_hero' && (
                                        <div className="mb-3">
                                            <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                Subheadline
                                            </label>
                                            <Input
                                                value={selectedSection.content?.subheadline || ''}
                                                onChange={(e) =>
                                                    updateSection(selectedSection.id, {
                                                        content: { ...selectedSection.content, subheadline: e.target.value },
                                                    })
                                                }
                                            />
                                        </div>
                                    )}

                                    {selectedSection.type === 'premium_showcase' && (
                                        <div className="mb-3">
                                            <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                Description
                                            </label>
                                            <textarea
                                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                value={selectedSection.content?.description || ''}
                                                onChange={(e) =>
                                                    updateSection(selectedSection.id, {
                                                        content: { ...selectedSection.content, description: e.target.value },
                                                    })
                                                }
                                            />
                                        </div>
                                    )}

                                    {(selectedSection.type === 'premium_hero' ||
                                        selectedSection.type === 'premium_showcase' ||
                                        selectedSection.type === 'premium_spice_grid') && (
                                        <div className="mb-3">
                                            <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                Button Text
                                            </label>
                                            <Input
                                                value={selectedSection.content?.button_text || ''}
                                                onChange={(e) =>
                                                    updateSection(selectedSection.id, {
                                                        content: { ...selectedSection.content, button_text: e.target.value },
                                                    })
                                                }
                                            />
                                        </div>
                                    )}

                                    {selectedSection.type === 'premium_checkout' && (
                                        <>
                                            <div className="mb-3">
                                                <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                    Product Name
                                                </label>
                                                <Input
                                                    value={selectedSection.content?.product_name || ''}
                                                    onChange={(e) =>
                                                        updateSection(selectedSection.id, {
                                                            content: { ...selectedSection.content, product_name: e.target.value },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Price</label>
                                                <Input
                                                    value={selectedSection.content?.price || ''}
                                                    onChange={(e) =>
                                                        updateSection(selectedSection.id, {
                                                            content: { ...selectedSection.content, price: e.target.value },
                                                        })
                                                    }
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
