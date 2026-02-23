import React from 'react';

const TabbedPageShell = ({ title, description, tabs, activeTab, onTabChange, children }) => {
    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-black">{title}</h1>
                <p className="mt-1 text-sm text-gray-600">{description}</p>

                <div className="mt-5 flex flex-wrap gap-2 border-b border-gray-200">
                    {tabs.map((tab) => {
                        const isActive = tab.key === activeTab;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => onTabChange(tab.key)}
                                className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? 'border-blue-600 text-blue-700'
                                        : 'border-transparent text-gray-600 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">{children}</div>
        </div>
    );
};

export default TabbedPageShell;
