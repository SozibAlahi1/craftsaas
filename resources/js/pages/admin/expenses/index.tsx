import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const CATEGORIES = ['Salary', 'Office Rent', 'Packaging', 'Marketing', 'Software', 'Miscellaneous'];

export default function ExpensesIndex({ expenses, summary }: { expenses: any; summary: any }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        category: '',
        title: '',
        amount: '',
        type: 'fixed',
        date: new Date().toISOString().split('T')[0],
        note: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/expenses', {
            onSuccess: () => reset('title', 'amount', 'note'),
        });
    };

    const deleteExpense = (id: number) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(`/admin/expenses/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Finance', href: '/admin/finance' }, { title: 'Expenses', href: '/admin/expenses' }]}>
            <Head title="Expense Management" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>This Month's Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">
                                ৳ {summary.total_this_month.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Record New Expense</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Select onValueChange={(val) => setData('category', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((c) => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
                                    </div>

                                    <div>
                                        <Input 
                                            placeholder="Expense Title" 
                                            value={data.title} 
                                            onChange={(e) => setData('title', e.target.value)} 
                                        />
                                        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                                    </div>
                                    
                                    <div>
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            placeholder="Amount (৳)" 
                                            value={data.amount} 
                                            onChange={(e) => setData('amount', e.target.value)} 
                                        />
                                        {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
                                    </div>

                                    <div>
                                        <Input 
                                            type="date" 
                                            value={data.date} 
                                            onChange={(e) => setData('date', e.target.value)} 
                                        />
                                        {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                                    </div>
                                    
                                    <div className="col-span-2 flex gap-2">
                                        <Select onValueChange={(val) => setData('type', val)} defaultValue="fixed">
                                            <SelectTrigger className="w-1/3">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed</SelectItem>
                                                <SelectItem value="variable">Variable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        
                                        <Input 
                                            placeholder="Note (optional)" 
                                            value={data.note} 
                                            onChange={(e) => setData('note', e.target.value)} 
                                            className="w-2/3"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" disabled={processing}>Record Expense</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Recent Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount (৳)</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.data.map((expense: any) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell>{expense.title}</TableCell>
                                        <TableCell className="capitalize">{expense.type}</TableCell>
                                        <TableCell className="text-right text-red-600 font-medium">
                                            {Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => deleteExpense(expense.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
