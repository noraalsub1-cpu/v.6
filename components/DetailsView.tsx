

import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import type { DetailsViewType } from '../types';
import { CloseIcon, ClockIcon, FlashcardIcon, QuizIcon, CheckCircleIcon, XCircleIcon, UsersIcon, CurrencyDollarIcon, LifebuoyIcon, ServerIcon, DocumentReportIcon, CircleIcon, ShieldCheckIcon, GraduationCapIcon } from './Icons';

// Dummy data for the charts and lists
const studyTimeData = [
    { name: 'السبت', 'دقائق': 30 }, { name: 'الأحد', 'دقائق': 45 }, { name: 'الاثنين', 'دقائق': 60 },
    { name: 'الثلاثاء', 'دقائق': 20 }, { name: 'الأربعاء', 'دقائق': 75 }, { name: 'الخميس', 'دقائق': 50 },
    { name: 'الجمعة', 'دقائق': 15 },
];

const quizHistory = [
    { name: 'اختبار الذكاء الاصطناعي', score: 90, date: '2024-05-10' },
    { name: 'مقدمة في الشبكات', score: 75, date: '2024-05-12' },
    { name: 'اختبار الشبكات المتقدم', score: 88, date: '2024-05-15' },
    { name: 'أساسيات تعلم الآلة', score: 95, date: '2024-05-18' }
];

const renderStudyTimeDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <ClockIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل وقت الدراسة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">إجمالي الساعات</p><p className="font-bold text-xl">3.2 ساعة</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">أطول جلسة</p><p className="font-bold text-xl">75 دقيقة</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">متوسط الجلسة</p><p className="font-bold text-xl">42 دقيقة</p></div>
        </div>
        <h3 className="font-bold text-lg mb-4">النشاط اليومي (آخر 7 أيام)</h3>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <LineChart data={studyTimeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="دقائق" stroke="#14B8A6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// Data for flashcard review details
const reviewedData = [
  { name: 'تمت مراجعتها', value: 158 },
  { name: 'لم تتم مراجعتها', value: 250 - 158 },
];
const REVIEW_COLORS = ['#14B8A6', '#E5E7EB'];


const renderFlashcardsDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <FlashcardIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل بطاقات المراجعة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={reviewedData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {reviewedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={REVIEW_COLORS[index % REVIEW_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]}/>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-4xl font-bold text-gray-800">{Math.round((158/250)*100)}%</span>
                     <span className="text-gray-500">مكتمل</span>
                </div>
            </div>
            
            <div className="space-y-4">
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-gray-500 font-semibold mb-2">مجموع البطاقات</p>
                    <p className="text-4xl font-extrabold text-gray-800">250</p>
                </div>
                 <div className="bg-teal-50 p-6 rounded-2xl border border-teal-200">
                    <p className="text-teal-700 font-semibold mb-2">تمت مراجعتها</p>
                    <p className="text-4xl font-extrabold text-teal-600">158</p>
                </div>
            </div>
        </div>
    </div>
);


const renderQuizDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <QuizIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل الاختبارات</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
             <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">متوسط النتيجة</p><p className="font-bold text-xl">88%</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">أعلى نتيجة</p><p className="font-bold text-xl text-green-600">95%</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">أدنى نتيجة</p><p className="font-bold text-xl text-red-600">75%</p></div>
        </div>
        <h3 className="font-bold text-lg mb-4">سجل الاختبارات</h3>
        <div className="space-y-3">
             {quizHistory.map((quiz, i) => (
                <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                     {quiz.score >= 80 ? <CheckCircleIcon className="w-6 h-6 text-green-500 ml-3"/> : <XCircleIcon className="w-6 h-6 text-red-500 ml-3"/>}
                    <div className="flex-grow"><p className="font-semibold">{quiz.name}</p><p className="text-xs text-gray-500">{quiz.date}</p></div>
                    <p className={`font-bold text-lg ${quiz.score >= 80 ? 'text-green-600' : 'text-red-600'}`}>{quiz.score}%</p>
                </div>
            ))}
        </div>
    </div>
);

// New dummy data for next steps
const nextStepsItems = [
    { title: "مراجعة ملخص الذكاء الاصطناعي", subtitle: "الفصل الأول", type: "ملخص", status: "أولوية", completed: false },
    { title: "اختبار في شبكات الحاسب", subtitle: "5 أسئلة سريعة", type: "اختبار", status: "جديد", completed: false },
    { title: "بطاقات مراجعة مصطلحات أساسية", subtitle: "مقدمة في علوم الحاسب", type: "بطاقات", status: "مراجعة", completed: true },
    { title: "إكمال درس الانقسام الخلوي", subtitle: "مادة العلوم", type: "درس", status: "لم يبدأ", completed: false },
    { title: "مشاهدة فيديو عن الوراثة", subtitle: "مادة العلوم", type: "فيديو", status: "مقترح", completed: false },
];

const renderNextStepsDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <DocumentReportIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">خطة الدراسة والمهام</h2>
        </div>
        <p className="text-gray-600 mb-6">هذه هي الخطوات المقترحة لمساعدتك على البقاء على المسار الصحيح. أكمل المهام لتعزيز فهمك.</p>
        <div className="space-y-3">
            {nextStepsItems.map((item, i) => (
                <div key={i} className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mr-4">
                        {item.completed ? <CheckCircleIcon className="w-7 h-7 text-teal-500" /> : <CircleIcon className="w-7 h-7 text-gray-300" />}
                    </div>
                    <div className="flex-grow">
                        <p className={`font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{item.title}</p>
                        <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        item.status === 'أولوية' ? 'bg-red-100 text-red-700' :
                        item.status === 'جديد' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'مراجعة' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {item.status}
                    </span>
                </div>
            ))}
        </div>
    </div>
);


const testPerformanceData = [
    { name: 'اللفظي', accuracy: 85 },
    { name: 'الكمي', accuracy: 92 },
    { name: 'الرياضيات', accuracy: 78 },
    { name: 'الفيزياء', accuracy: 88 },
    { name: 'الكيمياء', accuracy: 81 },
    { name: 'الأحياء', accuracy: 95 },
];

const renderStandardizedTestDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <GraduationCapIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">أداء الاختبارات المعيارية</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">متوسط الدقة الإجمالي</p><p className="font-bold text-xl">92%</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">أعلى أداء</p><p className="font-bold text-xl text-green-600">الأحياء</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">أقل أداء</p><p className="font-bold text-xl text-red-600">الرياضيات</p></div>
        </div>
        <h3 className="font-bold text-lg mb-4">مستوى الدقة حسب المادة</h3>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <BarChart data={testPerformanceData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6B7280' }} unit="%" />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#6B7280', textAnchor: 'end' }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="accuracy" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// New dummy data and render functions for admin views

const totalUsersData = [
    { name: 'Jan', users: 4000 }, { name: 'Feb', users: 3000 }, { name: 'Mar', users: 5000 },
    { name: 'Apr', users: 4500 }, { name: 'May', users: 6000 }, { name: 'Jun', users: 8000 },
    { name: 'Jul', users: 9500 }, { name: 'Aug', users: 10000 }, { name: 'Sep', users: 11000 },
    { name: 'Oct', users: 11500 }, { name: 'Nov', users: 12000 }, { name: 'Dec', users: 12543 },
];
const recentUsers = [
    { name: 'أحمد الغامدي', plan: 'فردي', date: 'قبل 5 دقائق' },
    { name: 'جامعة الملك سعود', plan: 'مؤسسي', date: 'قبل 2 ساعة' },
    { name: 'سارة عبدالله', plan: 'مجاني', date: 'قبل 3 ساعة' },
];

const renderTotalUsersDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <UsersIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل المستخدمين</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">إجمالي المستخدمين</p><p className="font-bold text-xl">12,543</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">جدد هذا الشهر</p><p className="font-bold text-xl text-green-600">+543</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">مستخدمون غادروا</p><p className="font-bold text-xl text-red-600">-89</p></div>
        </div>
        <h3 className="font-bold text-lg mb-4">نمو المستخدمين (آخر 12 شهر)</h3>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <LineChart data={totalUsersData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#14B8A6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <h3 className="font-bold text-lg mb-4 mt-8">آخر المسجلين</h3>
        <div className="space-y-3">
             {recentUsers.map((user, i) => (
                <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex-grow"><p className="font-semibold">{user.name}</p><p className="text-xs text-gray-500">{user.plan}</p></div>
                    <p className="text-sm text-gray-500">{user.date}</p>
                </div>
            ))}
        </div>
    </div>
);


const monthlyRevenueData = [
    { name: 'الأسبوع 1', 'إيرادات': 5000, 'تكاليف': 1200 },
    { name: 'الأسبوع 2', 'إيرادات': 6200, 'تكاليف': 1500 },
    { name: 'الأسبوع 3', 'إيرادات': 7000, 'تكاليف': 1600 },
    { name: 'الأسبوع 4', 'إيرادات': 6980, 'تكاليف': 1400 },
];
const renderMonthlyRevenueDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <CurrencyDollarIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل الإيرادات الشهرية</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">إجمالي الإيرادات</p><p className="font-bold text-xl">25,180 ريال</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">التكاليف</p><p className="font-bold text-xl">5,700 ريال</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">صافي الربح</p><p className="font-bold text-xl text-green-600">19,480 ريال</p></div>
        </div>
        <h3 className="font-bold text-lg mb-4">الأداء الأسبوعي</h3>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                 <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }}/>
                    <YAxis tick={{ fill: '#6B7280' }}/>
                    <Tooltip formatter={(value) => `${value} ريال`} />
                    <Legend />
                    <Bar dataKey="إيرادات" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="تكاليف" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);


const supportTickets = [
    { id: '#8762', topic: 'مشكلة في الدفع', user: 'خالد محمد', priority: 'عاجل', status: 'مفتوحة' },
    { id: '#8761', topic: 'اقتراح ميزة جديدة', user: 'فاطمة علي', priority: 'منخفض', status: 'مفتوحة' },
    { id: '#8759', topic: 'لا يمكن رفع ملف', user: 'عبدالله السعيد', priority: 'متوسط', status: 'قيد المراجعة' }
];

const renderSupportTicketsDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <LifebuoyIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل الدعم الفني</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">تذاكر مفتوحة</p><p className="font-bold text-xl">8</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">تم حلها اليوم</p><p className="font-bold text-xl">12</p></div>
            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-500 text-sm">متوسط وقت الحل</p><p className="font-bold text-xl">5.2 ساعة</p></div>
        </div>
        <h3 className="font-bold text-lg mb-4">التذاكر المفتوحة حالياً</h3>
        <div className="space-y-3">
            {supportTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex-grow">
                        <p className="font-semibold">{ticket.topic} <span className="text-sm text-gray-500">{ticket.id}</span></p>
                        <p className="text-xs text-gray-500">من: {ticket.user}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{ticket.priority}</span>
                </div>
            ))}
        </div>
    </div>
);

const systemHealthData = [
    { time: '12:00', latency: 110 }, { time: '13:00', latency: 130 }, { time: '14:00', latency: 125 },
    { time: '15:00', latency: 150 }, { time: '16:00', latency: 90 }, { time: '17:00', latency: 120 },
];

const renderSystemHealthDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <ServerIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">تفاصيل أداء النظام</h2>
        </div>
        <h3 className="font-bold text-lg mb-4">حالة الخدمات</h3>
        <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><p>API الرئيسية</p><span className="flex items-center text-green-600 font-semibold"><CheckCircleIcon className="w-5 h-5 ml-1"/> عامل</span></div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><p>قاعدة البيانات</p><span className="flex items-center text-green-600 font-semibold"><CheckCircleIcon className="w-5 h-5 ml-1"/> عامل</span></div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><p>خدمة Gemini AI</p><span className="flex items-center text-green-600 font-semibold"><CheckCircleIcon className="w-5 h-5 ml-1"/> عامل</span></div>
        </div>
        <h3 className="font-bold text-lg mb-4">زمن الاستجابة (آخر 6 ساعات)</h3>
         <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <LineChart data={systemHealthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} unit="ms"/>
                    <Tooltip formatter={(value) => `${value}ms`}/>
                    <Line type="monotone" dataKey="latency" stroke="#14B8A6" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const fullModerationQueue = [
    { id: 'mod1', name: 'ملخص تاريخ الفن الحديث', user: 'نورة خالد', date: '2024-05-20', type: 'pdf' },
    { id: 'mod2', name: 'شرح قصيدة المتنبي', user: 'علي الأحمدي', date: '2024-05-19', type: 'word' },
    { id: 'mod3', name: 'فيديو تعليم التفاضل', user: 'مدرسة الرياض الثانوية', date: '2024-05-19', type: 'youtube' },
    { id: 'mod4', name: 'عرض تقديمي عن الثورة الصناعية', user: 'سالم العتيبي', date: '2024-05-18', type: 'powerpoint' },
    { id: 'mod5', name: 'ملاحظات محاضرة الكيمياء العضوية', user: 'فهد الزهراني', date: '2024-05-18', type: 'pdf' },
    { id: 'mod6', name: 'واجب البرمجة المتقدمة', user: 'أمل الغامدي', date: '2024-05-17', type: 'word' },
];

// New render function for Content Moderation
const RenderContentModerationDetails = () => {
    const [queue, setQueue] = useState(fullModerationQueue);

    const handleModeration = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-teal-500" />
                <h2 className="text-2xl font-bold text-gray-800 mr-3">قائمة مراقبة المحتوى</h2>
            </div>
            <p className="text-gray-600 mb-6">
                راجع المحتوى الذي قام المستخدمون برفعه. يمكنك قبول المحتوى لجعله متاحًا أو رفضه لإزالته.
            </p>
            {queue.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {queue.map((item) => (
                        <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    بواسطة: {item.user} - بتاريخ: {item.date}
                                </p>
                            </div>
                            <div className="flex space-x-2 space-x-reverse shrink-0">
                                <button
                                    onClick={() => handleModeration(item.id)}
                                    className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                    <CheckCircleIcon className="w-4 h-4 ml-1" />
                                    قبول
                                </button>
                                <button
                                    onClick={() => handleModeration(item.id)}
                                    className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    <XCircleIcon className="w-4 h-4 ml-1" />
                                    رفض
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10">
                    رائع! تم مراجعة كل المحتوى.
                </p>
            )}
        </div>
    );
};


// New render function for Privacy Policy
const renderPrivacyPolicyDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <ShieldCheckIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">سياسة الخصوصية</h2>
        </div>
        <div className="space-y-4 text-gray-600 text-right max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed">
            <h3 className="font-bold text-lg text-gray-800 pt-2">1. قبول الشروط</h3>
            <p>باستخدامك مساعدي الذكي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق على أي جزء منها، يرجى عدم استخدام المنصة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">2. عن منصة مساعدي الذكي</h3>
            <p>منصة مساعدي الذكي تتيح لك رفع الملفات التعليمية وتحويلها إلى محتوى تفاعلي. نحتفظ بحق تعديل أو إيقاف الخدمة في أي وقت، دون إشعار مسبق.</p>

            <h3 className="font-bold text-lg text-gray-800 pt-2">3. مسؤوليات المستخدم</h3>
            <ul className="list-disc list-inside pr-5">
                <li>يجب أن تمتلك حقوق الطبع والنشر للمحتوى الذي ترفعه أو تحصل على إذن من صاحب الحقوق.</li>
                <li>أنت المسؤول عن أي محتوى تقوم برفعه، وتوافق على عدم انتهاك حقوق الآخرين.</li>
            </ul>

            <h3 className="font-bold text-lg text-gray-800 pt-2">4. ملكية المحتوى المرفوع</h3>
            <p>تمنح منصة مساعدي الذكي ترخيصًا غير حصري لاستخدام، نسخ، تعديل، نشر، توزيع، وعرض المحتوى عبر أي وسيلة حالية أو مستقبلية. يشمل الترخيص إنشاء أعمال مشتقة من المحتوى عند الحاجة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">5. الاستخدام غير القانوني</h3>
            <ul className="list-disc list-inside pr-5">
                <li>لا يجوز استخدام المنصة لأغراض غير قانونية أو مخالفة للشروط.</li>
                <li>يمنع رفع أي محتوى ضار، فيروسات، أو أكواد خبيثة.</li>
            </ul>

            <h3 className="font-bold text-lg text-gray-800 pt-2">6. إنهاء الوصول</h3>
            <p>يمكن لمنصة مساعدي الذكي إنهاء وصولك للمنصة في أي وقت دون إشعار أو مسؤولية. عند الإنهاء، يجب التوقف فورًا عن استخدام المنصة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">7. المسؤولية</h3>
            <p>منصة مساعدي الذكي غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة، بما في ذلك فقدان الأرباح أو البيانات.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">8. القانون السائد</h3>
            <p>هذه الشروط تخضع للقانون السعودي وأي نزاع يتم رفعه أمام محاكم المملكة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">9. تعديل الشروط</h3>
            <p>نحتفظ بحق تعديل الشروط في أي وقت. استمرارك في استخدام المنصة بعد التعديل يعني موافقتك على الشروط الجديدة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">10. الاشتراكات</h3>
            <p>نقدم خطط اشتراك شهرية، ربع سنوية، وسنوية. الاشتراكات تتجدد تلقائيًا، مع إعلام المستخدم بأي تغييرات في السعر أو الشروط. يمكن إلغاء الاشتراك في أي وقت، وسيستمر حتى نهاية دورة الفوترة الحالية دون استرداد جزئي.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">11. حذف الحساب وخصوصية البيانات</h3>
            <p>يمكنك طلب حذف حسابك وبياناتك عبر البريد الإلكتروني: support@studymind.com. بعد التحقق، يتم حذف جميع البيانات بشكل دائم من خوادمنا. ستتلقى تأكيدًا عند اكتمال العملية. نحن ملتزمون بحماية بياناتك وامتثال القوانين الدولية والمحلية، بما في ذلك GDPR.</p>

            <p className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
                💡 <strong>ملاحظة للمستخدمين:</strong> باستخدام مساعدي الذكي، أنت توافق على جميع ما سبق لضمان تجربة آمنة وموثوقة.
            </p>
        </div>
    </div>
);


const renderTermsAndConditionsDetails = () => (
    <div>
        <div className="flex items-center mb-6">
            <DocumentReportIcon className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800 mr-3">الأحكام والشروط</h2>
        </div>
        <div className="space-y-4 text-gray-600 text-right max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed">
            <h3 className="font-bold text-lg text-gray-800 pt-2">1. قبول الشروط</h3>
            <p>باستخدامك مساعدي الذكي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق على أي جزء منها، يرجى عدم استخدام المنصة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">2. عن منصة مساعدي الذكي</h3>
            <p>منصة مساعدي الذكي تتيح لك رفع الملفات التعليمية وتحويلها إلى محتوى تفاعلي. نحتفظ بحق تعديل أو إيقاف الخدمة في أي وقت، دون إشعار مسبق.</p>

            <h3 className="font-bold text-lg text-gray-800 pt-2">3. مسؤوليات المستخدم</h3>
            <ul className="list-disc list-inside pr-5">
                <li>يجب أن تمتلك حقوق الطبع والنشر للمحتوى الذي ترفعه أو تحصل على إذن من صاحب الحقوق.</li>
                <li>أنت المسؤول عن أي محتوى تقوم برفعه، وتوافق على عدم انتهاك حقوق الآخرين.</li>
            </ul>

            <h3 className="font-bold text-lg text-gray-800 pt-2">4. ملكية المحتوى المرفوع</h3>
            <p>تمنح منصة مساعدي الذكي ترخيصًا غير حصري لاستخدام، نسخ، تعديل، نشر، توزيع، وعرض المحتوى عبر أي وسيلة حالية أو مستقبلية. يشمل الترخيص إنشاء أعمال مشتقة من المحتوى عند الحاجة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">5. الاستخدام غير القانوني</h3>
            <ul className="list-disc list-inside pr-5">
                <li>لا يجوز استخدام المنصة لأغراض غير قانونية أو مخالفة للشروط.</li>
                <li>يمنع رفع أي محتوى ضار، فيروسات، أو أكواد خبيثة.</li>
            </ul>

            <h3 className="font-bold text-lg text-gray-800 pt-2">6. إنهاء الوصول</h3>
            <p>يمكن لمنصة مساعدي الذكي إنهاء وصولك للمنصة في أي وقت دون إشعار أو مسؤولية. عند الإنهاء، يجب التوقف فورًا عن استخدام المنصة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">7. المسؤولية</h3>
            <p>منصة مساعدي الذكي غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة، بما في ذلك فقدان الأرباح أو البيانات.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">8. القانون السائد</h3>
            <p>هذه الشروط تخضع للقانون السعودي وأي نزاع يتم رفعه أمام محاكم المملكة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">9. تعديل الشروط</h3>
            <p>نحتفظ بحق تعديل الشروط في أي وقت. استمرارك في استخدام المنصة بعد التعديل يعني موافقتك على الشروط الجديدة.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">10. الاشتراكات</h3>
            <p>نقدم خطط اشتراك شهرية، ربع سنوية، وسنوية. الاشتراكات تتجدد تلقائيًا، مع إعلام المستخدم بأي تغييرات في السعر أو الشروط. يمكن إلغاء الاشتراك في أي وقت، وسيستمر حتى نهاية دورة الفوترة الحالية دون استرداد جزئي.</p>
            
            <h3 className="font-bold text-lg text-gray-800 pt-2">11. حذف الحساب وخصوصية البيانات</h3>
            <p>يمكنك طلب حذف حسابك وبياناتك عبر البريد الإلكتروني: support@studymind.com. بعد التحقق، يتم حذف جميع البيانات بشكل دائم من خوادمنا. ستتلقى تأكيدًا عند اكتمال العملية. نحن ملتزمون بحماية بياناتك وامتثال القوانين الدولية والمحلية، بما في ذلك GDPR.</p>

            <p className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
                💡 <strong>ملاحظة للمستخدمين:</strong> باستخدام مساعدي الذكي، أنت توافق على جميع ما سبق لضمان تجربة آمنة وموثوقة.
            </p>
        </div>
    </div>
);


interface DetailsViewProps {
    viewType: DetailsViewType;
    onClose: () => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ viewType, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const handleClickOutside = (event: MouseEvent) => {
             if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        window.addEventListener('keydown', handleEsc);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    const renderContent = () => {
        switch (viewType) {
            case 'studyTime': return renderStudyTimeDetails();
            case 'flashcards': return renderFlashcardsDetails();
            case 'quizAverage': return renderQuizDetails();
            case 'nextSteps': return renderNextStepsDetails();
            case 'totalUsers': return renderTotalUsersDetails();
            case 'monthlyRevenue': return renderMonthlyRevenueDetails();
            case 'supportTickets': return renderSupportTicketsDetails();
            case 'systemHealth': return renderSystemHealthDetails();
            case 'contentModeration': return <RenderContentModerationDetails />;
            case 'privacyPolicy': return renderPrivacyPolicyDetails();
            case 'termsAndConditions': return renderTermsAndConditionsDetails();
            case 'standardizedTestPerformance': return renderStandardizedTestDetails();
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 transform animate-slide-up-fast relative">
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors z-10">
                    <CloseIcon className="w-7 h-7" />
                </button>
                {renderContent()}
            </div>
        </div>
    )
}