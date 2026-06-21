import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        <AppLayout breadcrumbs={[{ title: 'Automation', href: '/admin/bot-inbox' }, { title: 'AI Bot Inbox', href: '/admin/bot-inbox' }]}>
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
                                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${selectedConv?.id === conv.id ? 'bg-muted' : ''}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold">{conv.sender_id}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(conv.last_message_at).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm truncate text-muted-foreground w-3/4">
                                            {conv.messages[conv.messages.length - 1]?.content || 'No messages'}
                                        </span>
                                        {!conv.is_resolved && (
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        )}
                                    </div>
                                    <span className="text-xs uppercase mt-1 inline-block bg-blue-100 text-blue-800 px-1 rounded">{conv.channel}</span>
                                </div>
                            ))}
                            {conversations.data.length === 0 && (
                                <div className="p-4 text-center text-muted-foreground">No conversations found.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Chat View */}
                <Card className="flex-1 flex flex-col">
                    {selectedConv ? (
                        <>
                            <CardHeader className="border-b">
                                <CardTitle className="flex justify-between items-center">
                                    <span>{selectedConv.sender_id} ({selectedConv.channel})</span>
                                    <span className={`text-sm px-2 py-1 rounded ${selectedConv.is_resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {selectedConv.is_resolved ? 'Resolved' : 'Needs Human Attention'}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                                {selectedConv.messages.map((msg: any, idx: number) => (
                                    <div key={idx} className={`flex flex-col max-w-[70%] ${msg.role === 'user' ? 'self-start' : 'self-end'}`}>
                                        <div className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-gray-100' : (msg.role === 'bot' ? 'bg-blue-100' : 'bg-green-100')}`}>
                                            {msg.content}
                                        </div>
                                        <div className={`text-xs text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                                            {msg.role} • {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="p-4 border-t bg-muted/20">
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
                                    <Button type="submit" disabled={processing || !data.reply}>Send Reply</Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Select a conversation to view messages
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
