import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link2, Link2Off, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync content from outside
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, val: string = '') => {
        document.execCommand(command, false, val);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    return (
        <div className={`w-full border bg-white transition-all text-sm ${isFocused ? 'border-slate-400 ring-1 ring-slate-400' : 'border-slate-200'}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 p-2 select-none">
                <button
                    type="button"
                    onClick={() => execCommand('undo')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('redo')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h1>')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<p>')}
                    className="flex h-8 px-2 items-center justify-center rounded text-xs font-bold text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Normal Paragraph"
                >
                    Paragraph
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Underline"
                >
                    <Underline className="h-4 w-4" />
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => execCommand('justifyLeft')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('justifyCenter')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('justifyRight')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Enter website link URL:');
                        if (url) execCommand('createLink', url);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Insert Link"
                >
                    <Link2 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('unlink')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors"
                    title="Remove Link"
                >
                    <Link2Off className="h-4 w-4" />
                </button>
            </div>

            {/* Editable Area */}
            <div className="relative">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="min-h-[220px] max-h-[500px] overflow-y-auto p-4 outline-none text-slate-800 leading-relaxed rich-editor-content"
                />
                {!value && (
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 text-sm">
                        {placeholder || 'Write detailed product description...'}
                    </div>
                )}
            </div>
            {/* Custom styles inside the component to ensure standard lists display correctly inside editor */}
            <style>{`
                .rich-editor-content h1 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .rich-editor-content h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .rich-editor-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .rich-editor-content ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .rich-editor-content p {
                    margin-top: 0.25rem;
                    margin-bottom: 0.25rem;
                }
                .rich-editor-content a {
                    color: #3b82f6;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
