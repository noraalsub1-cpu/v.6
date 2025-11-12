import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { DetailsViewType } from '../types';
import { 
    UsersIcon, CurrencyDollarIcon, DocumentReportIcon, LifebuoyIcon, ServerIcon, DashboardIcon,
    ArrowUpIcon, ArrowDownIcon, ShieldCheckIcon, DownloadIcon
} from './Icons';

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; }> = ({ title, icon, children, className }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col ${className}`}>
        <div className="flex items-center mb-4">
            <div className="bg-teal-100 text-teal-600 p-2 rounded-lg">{icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mr-3">{title}</h2>
        </div>
        <div className="flex-grow space-y-4">
            {children}
        </div>
    </div>
);

interface MetricProps {
    label: string;
    value: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
    onClick?: () => void;
}

const Metric: React.FC<MetricProps> = ({ label, value, change, changeType, onClick }) => {
    const content = (
        <div className="flex justify-between items-center py-2 px-2">
            <p className="text-gray-600">{label}</p>
            <div className="flex items-center">
                <p className="font-bold text-lg text-gray-800">{value}</p>
                {change && (
                    <span className={`flex items-center text-sm font-semibold mr-2 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                        {changeType === 'increase' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                        {change}
                    </span>
                )}
            </div>
        </div>
    );

    if (onClick) {
        return (
            <button 
                onClick={onClick} 
                className="w-full text-right hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
                aria-label={`View details for ${label}`}
            >
                {content}
            </button>
        );
    }

    return <div className="border-b border-gray-100">{content}</div>;
};


const ProgressBar: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-medium text-gray-700">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

// Dummy Data
const initialUserGrowthData = [
    { name: 'يناير', users: 400 }, { name: 'فبراير', users: 300 }, { name: 'مارس', users: 500 },
    { name: 'أبريل', users: 450 }, { name: 'مايو', users: 600 }, { name: 'يونيو', users: 800 }
];
const initialUserSegmentData = [ { name: 'طلاب', value: 400 }, { name: 'معلمون', value: 300 }, { name: 'مؤسسات', value: 100 } ];
const featureAdoptionData = [ { name: 'اختبارات', value: 450 }, { name: 'بطاقات', value: 320 }, { name: 'شروحات', value: 550 }, { name: 'دردشة', value: 200 } ];

const COLORS = ['#14B8A6', '#FBBF24', '#60A5FA', '#F87171'];
const revenueData = [
    { name: 'يناير', revenue: 2000 }, { name: 'فبراير', revenue: 2500 }, { name: 'مارس', revenue: 2200 },
    { name: 'أبريل', revenue: 3000 }, { name: 'مايو', revenue: 3500 }, { name: 'يونيو', revenue: 4000 }
];

const initialModerationItems = [
    { id: 'mod1', name: 'ملخص تاريخ الفن الحديث', user: 'نورة خالد', date: '2024-05-20' },
    { id: 'mod2', name: 'شرح قصيدة المتنبي', user: 'علي الأحمدي', date: '2024-05-19' },
    { id: 'mod3', name: 'فيديو تعليم التفاضل', user: 'مدرسة الرياض الثانوية', date: '2024-05-19' },
];

interface AdminDashboardProps {
  onShowDetails: (viewType: DetailsViewType) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onShowDetails }) => {
    const [moderationQueue, setModerationQueue] = useState(initialModerationItems.slice(0, 2));
    const [dateRange, setDateRange] = useState('last30days');
    
    // Simulate data fetching based on date range
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 12543,
        monthlyActiveUsers: 8912,
        retentionRate: 75,
        newSignups: 543,
        avgSessions: 2.1,
        materialsGenerated: 1204,
        userGrowthData: initialUserGrowthData,
    });

    useEffect(() => {
        // This function simulates fetching new data when the date range changes.
        const updateData = () => {
            const multiplier = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
            setDashboardData({
                totalUsers: Math.floor(12543 * multiplier),
                monthlyActiveUsers: Math.floor(8912 * multiplier),
                retentionRate: Math.floor(75 * (0.95 + Math.random() * 0.1)),
                newSignups: Math.floor(543 * multiplier),
                avgSessions: parseFloat((2.1 * multiplier).toFixed(1)),
                materialsGenerated: Math.floor(1204 * multiplier),
                userGrowthData: initialUserGrowthData.map(d => ({ ...d, users: Math.floor(d.users * multiplier) })),
            });
        };
        updateData();
    }, [dateRange]);


    const handleModeration = (id: string) => {
        setModerationQueue(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="p-8 pb-16 h-full overflow-y-auto bg-gray-50">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المدير</h1>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2.5"
                    >
                        <option value="last7days">آخر 7 أيام</option>
                        <option value="last30days">آخر 30 يومًا</option>
                        <option value="last90days">آخر 90 يومًا</option>
                        <option value="alltime">كل الأوقات</option>
                    </select>
                    <button 
                        onClick={() => alert('جاري إنشاء التقرير...')}
                        className="flex items-center bg-teal-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        <DownloadIcon className="w-5 h-5 ml-2" />
                        <span>تصدير التقرير</span>
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Global Overview */}
                <SectionCard title="المؤشرات العامة" icon={<DashboardIcon className="w-6 h-6" />} className="lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                         <Metric label="إجمالي المستخدمين" value={dashboardData.totalUsers.toLocaleString()} onClick={() => onShowDetails('totalUsers')} />
                        <Metric label="النشطون شهريًا" value={dashboardData.monthlyActiveUsers.toLocaleString()} />
                        <Metric label="معدل الاحتفاظ" value={`${dashboardData.retentionRate}%`} change="-2%" changeType="decrease" />
                        <Metric label="اشتراكات جديدة (الشهر)" value={dashboardData.newSignups.toLocaleString()} change="+12%" changeType="increase"/>
                        <Metric label="متوسط الجلسات/مستخدم" value={dashboardData.avgSessions.toString()} />
                        <Metric label="مواد تم إنشاؤها" value={dashboardData.materialsGenerated.toLocaleString()} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 mt-4 border-t border-gray-100">
                        <div>
                             <h3 className="font-bold text-gray-700 mb-2">نمو المستخدمين</h3>
                             <div className="h-40 -mx-2">
                                <ResponsiveContainer>
                                    <BarChart data={dashboardData.userGrowthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="users" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">أكثر الأدوات استخدامًا</h3>
                            <div className="h-40 flex items-center justify-center -my-2">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={featureAdoptionData} cx="50%" cy="50%" labelLine={false} outerRadius={55} fill="#8884d8" dataKey="value" nameKey="name">
                                            {featureAdoptionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* User Analytics */}
                <SectionCard title="تحليلات المستخدمين" icon={<UsersIcon className="w-6 h-6" />}>
                    <Metric label="متوسط مدة الجلسة" value="18 دقيقة" />
                    <Metric label="مستخدمون جدد (آخر 30 يومًا)" value="1,204" />
                    <Metric label="التوزيع الجغرافي الأعلى" value="الرياض" />
                    <div className="h-48 flex items-center justify-center -my-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={initialUserSegmentData} cx="50%" cy="50%" labelLine={false} outerRadius={60} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => entry.name}>
                                    {initialUserSegmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>

                {/* Revenue & Subscription Insights */}
                <SectionCard title="الأداء المالي" icon={<CurrencyDollarIcon className="w-6 h-6" />}>
                    <Metric label="الإيرادات الشهرية" value="25,180 ريال" change="+8%" changeType="increase" onClick={() => onShowDetails('monthlyRevenue')}/>
                    <Metric label="الاشتراكات النشطة" value="1,450" />
                    <Metric label="معدل التحويل" value="5.2%" />
                    <Metric label="متوسط الإيراد لكل مستخدم" value="17.36 ريال" />
                     <div className="h-40 -mx-2">
                        <ResponsiveContainer>
                           <LineChart data={revenueData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis fontSize={12} tickLine={false} axisLine={false} unit="k" tickFormatter={(v) => `${v/1000}`}/>
                                <Tooltip formatter={(value) => `${value} ريال`} />
                                <Line type="monotone" dataKey="revenue" stroke="#14B8A6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>

                {/* Content Moderation */}
                <SectionCard title="مراقبة المحتوى" icon={<ShieldCheckIcon className="w-6 h-6" />}>
                    <p className="text-sm text-gray-500 -mt-2 mb-2">المحتوى المرفوع حديثًا في انتظار المراجعة.</p>
                    {moderationQueue.length > 0 ? (
                        moderationQueue.map(item => (
                            <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">بواسطة: {item.user}</p>
                                    <div className="flex space-x-2 space-x-reverse">
                                        <button onClick={() => handleModeration(item.id)} className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600">قبول</button>
                                        <button onClick={() => handleModeration(item.id)} className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600">رفض</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">لا يوجد محتوى في قائمة الانتظار.</p>
                    )}
                    <button onClick={() => onShowDetails('contentModeration')} className="w-full mt-2 bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        عرض كل القائمة
                    </button>
                </SectionCard>


                {/* Support & Experience */}
                <SectionCard title="الدعم الفني وتجربة المستخدم" icon={<LifebuoyIcon className="w-6 h-6" />}>
                     <Metric label="التذاكر الجديدة (أسبوعيًا)" value="42" onClick={() => onShowDetails('supportTickets')} />
                     <Metric label="متوسط زمن الاستجابة" value="3.5 ساعة" />
                     <Metric label="رضا المستخدمين" value="4.7 / 5" />
                     <ProgressBar label="تذاكر مغلقة" value={92} color="bg-green-500" />
                     <ProgressBar label="تذاكر معلقة" value={8} color="bg-yellow-400" />
                </SectionCard>

                {/* System Health */}
                <SectionCard title="الأداء التقني" icon={<ServerIcon className="w-6 h-6" />}>
                    <Metric label="زمن استجابة الخادم" value="120ms" onClick={() => onShowDetails('systemHealth')} />
                    <Metric label="أخطاء النظام (24 ساعة)" value="3" />
                    <ProgressBar label="API Success Rate" value={99.9} color="bg-teal-500" />
                    <ProgressBar label="Integrations Uptime" value={100} color="bg-blue-500" />
                </SectionCard>

            </div>
        </div>
    );
};