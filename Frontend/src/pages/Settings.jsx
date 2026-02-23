import React from 'react';
import { LockKeyhole, Settings2, Users2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import TabbedPageShell from '../components/TabbedPageShell';

const tabs = [
    { key: 'roles-users', label: 'Roles & Users' },
    { key: 'system-config', label: 'System Config' }
];

const tabConfig = {
    'roles-users': {
        icon: Users2,
        title: 'Roles & Users',
        description: 'Manage access levels and user account permissions.'
    },
    'system-config': {
        icon: Settings2,
        title: 'System Configuration',
        description: 'Control global settings for system behavior and defaults.'
    }
};

const Settings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const rawTab = searchParams.get('tab') || 'roles-users';
    const activeTab = tabs.some((tab) => tab.key === rawTab) ? rawTab : 'roles-users';
    const section = tabConfig[activeTab];
    const Icon = section.icon;

    const onTabChange = (tab) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', tab);
        setSearchParams(next);
    };

    return (
        <TabbedPageShell
            title="Settings"
            description="System-level configuration and user access control."
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-black">{section.title}</h2>
                    <p className="text-sm text-gray-600">{section.description}</p>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-black">Access Policy</p>
                    <p className="mt-1 text-sm text-gray-600">
                        Role-based rendering remains linked to <code>role_name</code> for stable permission control.
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <LockKeyhole size={16} className="text-blue-600" />
                        <span>Security section in header is intentionally disabled for now as requested.</span>
                    </div>
                </div>
            </div>
        </TabbedPageShell>
    );
};

export default Settings;
