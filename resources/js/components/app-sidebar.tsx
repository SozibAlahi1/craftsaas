import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Tags, Package, Menu, Settings, Boxes, ShoppingCart, Ban, User, UserX, Activity, Target, DollarSign, Receipt, MessageCircle, MessageSquare, Bot, HardDrive } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        url: '/admin/categories',
        icon: Tags,
    },
    {
        title: 'Products',
        url: '/admin/products',
        icon: Package,
    },
    {
        title: 'Stock Management',
        url: '/admin/stocks',
        icon: Boxes,
    },
    {
        title: 'Orders',
        url: '/admin/orders',
        icon: BookOpen,
    },
    {
        title: 'Abandoned Carts',
        url: '/admin/abandoned-carts',
        icon: ShoppingCart,
    },
    {
        title: 'Customers',
        url: '/admin/customers',
        icon: User,
    },
    {
        title: 'Leads CRM',
        url: '/admin/leads',
        icon: User,
    },
    {
        title: 'Blocked Customers',
        url: '/admin/blocked-customers',
        icon: UserX,
    },
    {
        title: 'Menus',
        url: '/admin/menu-items',
        icon: Menu,
    },
    {
        title: 'Finance Dashboard',
        url: '/admin/finance',
        icon: DollarSign,
    },
    {
        title: 'Expenses',
        url: '/admin/expenses',
        icon: Receipt,
    },
    {
        title: 'SMS Campaigns',
        url: '/admin/sms-campaigns',
        icon: MessageCircle,
    },
    {
        title: 'WhatsApp Campaigns',
        url: '/admin/whatsapp-campaigns',
        icon: MessageSquare,
    },
    {
        title: 'AI Bot Inbox',
        url: '/admin/bot-inbox',
        icon: Bot,
    },
    {
        title: 'AI Ad Copies',
        url: '/admin/ad-copies',
        icon: Bot,
    },
    {
        title: 'Landing Pages',
        url: '/admin/landing-pages',
        icon: LayoutGrid,
    },
    {
        title: 'Database Backups',
        url: '/admin/backups',
        icon: HardDrive,
    },
    {
        title: 'Analytics',
        url: '/admin/analytics',
        icon: Activity,
    },
    {
        title: 'Site Settings',
        url: '/admin/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
