import React, { useState } from 'react';
import type { User } from '../types';

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => {
    return (
        <label htmlFor={label} className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <span className="text-gray-700 font-semibold">{label}</span>
            <div className="relative">
                <input id={label} type="checkbox" className="sr-only" checked={enabled} onChange={() => onChange(!enabled)} />
                <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
            </div>
        </label>
    );
};

interface SettingsProps {
    user: User;
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
    const [notifications, setNotifications] = useState({
        weeklyReport: true,
        newFeatures: true,
    });

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    const SettingRow: React.FC<{ label: string; value: string; action?: React.ReactNode; }> = ({ label, value, action }) => (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
            </div>
            {action && <div>{action}</div>}
        </div>
    );

    return (
        <div className="p-8 pb-16 h-full overflow-y-auto bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">الإعدادات</h1>
            <div className="max-w-2xl mx-auto space-y-10">
                
                {/* Account Section */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">الحساب والاشتراك</h2>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <SettingRow label="الاسم الكامل" value={user.name} />
                        <SettingRow label="البريد الإلكتروني" value={user.email} />
                        <SettingRow label="الخطة الحالية" value={user.plan} action={
                            <button className="text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors">
                                إدارة الاشتراك
                            </button>
                        }/>
                        <SettingRow label="كلمة المرور" value="••••••••" action={
                             <button className="text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors">
                                تغيير
                            </button>
                        }/>
                    </div>
                </div>

                {/* Notifications Section */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">الإشعارات</h2>
                    <div className="space-y-3">
                        <ToggleSwitch label="تقرير التقدم الأسبوعي" enabled={notifications.weeklyReport} onChange={(val) => handleNotificationChange('weeklyReport', val)} />
                        <ToggleSwitch label="إعلانات الميزات الجديدة" enabled={notifications.newFeatures} onChange={(val) => handleNotificationChange('newFeatures', val)} />
                    </div>
                </div>

                {/* Actions Section */}
                <div>
                     <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">إجراءات الحساب</h2>
                     <div className="space-y-3">
                        <button onClick={onLogout} className="w-full text-right p-4 font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            تسجيل الخروج
                        </button>
                        <button className="w-full text-right p-4 font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                            حذف الحساب نهائياً
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};