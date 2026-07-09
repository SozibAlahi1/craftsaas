import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function BotInboxIndex({ conversations }: { conversations: any }) {
    const [selectedConv, setSelectedConv] = useState<any>(null);

    const { data, setData, put, processing, reset } = useForm({
        reply: '',
        is_resolved: true,
    });

    const selectConversation = (conv: any) => {
        setSelectedConv(conv);
        setData('is_resolved', conv.is_resolved);
    };

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/bot-inbox/${selectedConv.id}`, {
            onSuccess: () => {
                reset('reply');
                // You'd typically reload the selected conv from props here
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Automation', href: '/admin/bot-inbox' },
                { title: 'AI Bot Inbox', href: '/admin/bot-inbox' },
            ]}
        >
            <Head title="Bot Inbox" />

            <div className="flex h-[calc(100vh-8rem)] gap-4 p-4">
                {/* Conversation List */}
                <Card className="w-1/3 overflow-y-auto">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {conversations.data.map((conv: any) => (
                                <div
                                    key={conv.id}
                                    onClick={() => selectConversation(conv)}
                                    className={`hover:bg-muted/50 cursor-pointer border-b p-4 ${selectedConv?.id === conv.id ? 'bg-muted' : ''}`}
                                >
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="font-semibold">{conv.sender_id}</span>
                                        <span className="text-muted-foreground text-xs">{new Date(conv.last_message_at).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground w-3/4 truncate text-sm">
                                            {conv.messages[conv.messages.length - 1]?.content || 'No messages'}
                                        </span>
                                        {!conv.is_resolved && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                                    </div>
                                    <span className="mt-1 inline-block rounded bg-blue-100 px-1 text-xs text-blue-800 uppercase">{conv.channel}</span>
                                </div>
                            ))}
                            {conversations.data.length === 0 && <div className="text-muted-foreground p-4 text-center">No conversations found.</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Chat View */}
                <Card className="flex flex-1 flex-col">
                    {selectedConv ? (
                        <>
                            <CardHeader className="border-b">
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        {selectedConv.sender_id} ({selectedConv.channel})
                                    </span>
                                    <span
                                        className={`rounded px-2 py-1 text-sm ${selectedConv.is_resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {selectedConv.is_resolved ? 'Resolved' : 'Needs Human Attention'}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                                {selectedConv.messages.map((msg: any, idx: number) => (
                                    <div key={idx} className={`flex max-w-[70%] flex-col ${msg.role === 'user' ? 'self-start' : 'self-end'}`}>
                                        <div
                                            className={`rounded-xl p-3 ${msg.role === 'user' ? 'bg-gray-100' : msg.role === 'bot' ? 'bg-blue-100' : 'bg-green-100'}`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div className={`text-muted-foreground mt-1 text-xs ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                                            {msg.role} • {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="bg-muted/20 border-t p-4">
                                <form onSubmit={submitReply} className="flex gap-2">
                                    <Input
                                        placeholder="Type your reply as Admin..."
                                        value={data.reply}
                                        onChange={(e) => setData('reply', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="outline" onClick={() => setData('is_resolved', !data.is_resolved)}>
                                        {data.is_resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                                    </Button>
                                    <Button type="submit" disabled={processing || !data.reply}>
                                        Send Reply
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground flex flex-1 items-center justify-center">Select a conversation to view messages</div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
