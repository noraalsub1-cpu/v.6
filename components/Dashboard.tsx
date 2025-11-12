
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DetailsViewType, Task } from '../types';
import { DocumentIcon, QuizIcon, FlashcardIcon, TrendingUpIcon, TrendingDownIcon, PlusIcon, PencilIcon, TrashIcon, DownloadIcon, GraduationCapIcon, CheckCircleIcon } from './Icons';

// StatCard now has a color prop for better visual distinction
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  onClick: () => void;
  footer?: React.ReactNode;
  color?: 'teal' | 'indigo';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick, footer, color = 'teal' }) => {
    const colorClasses = {
        teal: 'bg-teal-100 text-teal-600',
        indigo: 'bg-indigo-100 text-indigo-600',
    };
    return (
        <button onClick={onClick} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-right w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 font-semibold">{title}</p>
                 <div className={`${colorClasses[color]} p-2 rounded-lg`}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 flex-grow">{value}</p>
            {footer || <div className="mt-2 h-5"></div>}
        </button>
    );
};


const TrendFooter: React.FC<{change: string, changeType: 'increase' | 'decrease'}> = ({change, changeType}) => {
    const isIncrease = changeType === 'increase';
    return (
        <div className="mt-2 flex items-center text-sm">
            <span className={`flex items-center font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                {isIncrease ? <TrendingUpIcon className="w-4 h-4 ml-1" /> : <TrendingDownIcon className="w-4 h-4 ml-1" />}
                {change}
            </span>
            <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
        </div>
    );
};


// Weekly Activity Chart Component
const initialWeeklyActivityData = [
    { name: 'السبت', 'دقائق الدراسة': 30, 'الدروس المكتملة': 1, 'بطاقات المراجعة': 10, 'الاختبارات': 0 },
    { name: 'الأحد', 'دقائق الدراسة': 45, 'الدروس المكتملة': 1, 'بطاقات المراجعة': 25, 'الاختبارات': 1 },
    { name: 'الاثنين', 'دقائق الدراسة': 60, 'الدروس المكتملة': 2, 'بطاقات المراجعة': 40, 'الاختبارات': 1 },
    { name: 'الثلاثاء', 'دقائق الدراسة': 20, 'الدروس المكتملة': 1, 'بطاقات المراجعة': 15, 'الاختبارات': 0 },
    { name: 'الأربعاء', 'دقائق الدراسة': 75, 'الدروس المكتملة': 3, 'بطاقات المراجعة': 50, 'الاختبارات': 2 },
    { name: 'الخميس', 'دقائق الدراسة': 50, 'الدروس المكتملة': 2, 'بطاقات المراجعة': 30, 'الاختبارات': 1 },
    { name: 'الجمعة', 'دقائق الدراسة': 15, 'الدروس المكتملة': 0, 'بطاقات المراجعة': 20, 'الاختبارات': 0 },
].reverse(); // Reverse for RTL display

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-right">
                <p className="font-bold text-gray-800 mb-2">{label}</p>
                <ul className="space-y-1">
                    <li className="text-sm text-teal-600 font-semibold">{`دقائق الدراسة: ${data['دقائق الدراسة']}`}</li>
                    <li className="text-xs text-gray-500">{`الدروس المكتملة: ${data['الدروس المكتملة']}`}</li>
                    <li className="text-xs text-gray-500">{`بطاقات المراجعة: ${data['بطاقات المراجعة']}`}</li>
                    <li className="text-xs text-gray-500">{`الاختبارات: ${data['الاختبارات']}`}</li>
                </ul>
            </div>
        );
    }
    return null;
};

const WeeklyActivityChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <div className="h-80 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 14, fontFamily: 'Tajawal' }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 14, fontFamily: 'Tajawal' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }} />
                    <Bar dataKey="دقائق الدراسة" name="دقائق الدراسة" fill="#14B8A6" radius={[10, 10, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Standardized Test Activity Chart Component & Tooltip
const initialStdTestActivityData = [
    { name: 'السبت', 'أسئلة محلولة': 25, 'متوسط الدقة': 88 },
    { name: 'الأحد', 'أسئلة محلولة': 30, 'متوسط الدقة': 91 },
    { name: 'الاثنين', 'أسئلة محلولة': 45, 'متوسط الدقة': 85 },
    { name: 'الثلاثاء', 'أسئلة محلولة': 20, 'متوسط الدقة': 93 },
    { name: 'الأربعاء', 'أسئلة محلولة': 50, 'متوسط الدقة': 90 },
    { name: 'الخميس', 'أسئلة محلولة': 35, 'متوسط الدقة': 89 },
    { name: 'الجمعة', 'أسئلة محلولة': 15, 'متوسط الدقة': 95 },
].reverse();

const StdTestCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-right">
                <p className="font-bold text-gray-800 mb-2">{label}</p>
                <ul className="space-y-1">
                    <li className="text-sm text-indigo-600 font-semibold">{`أسئلة محلولة: ${data['أسئلة محلولة']}`}</li>
                    <li className="text-xs text-gray-500">{`متوسط الدقة: ${data['متوسط الدقة']}%`}</li>
                </ul>
            </div>
        );
    }
    return null;
};

const StdTestActivityChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <div className="h-80 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 14, fontFamily: 'Tajawal' }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 14, fontFamily: 'Tajawal' }} />
                    <Tooltip content={<StdTestCustomTooltip />} cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }} />
                    <Bar dataKey="أسئلة محلولة" name="أسئلة محلولة" fill="#818CF8" radius={[10, 10, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

interface DashboardProps {
  onShowDetails: (viewType: DetailsViewType) => void;
  tasks: Task[];
  onToggleTaskComplete: (id: string) => void;
  onUpdateTaskNotes: (id: string, notes: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (title: string) => void;
}

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onUpdateNotes: (id: string, notes: string) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onUpdateNotes, onDelete }) => {
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState(task.notes);

    const handleSaveNotes = () => {
        onUpdateNotes(task.id, notes);
        setIsNotesOpen(false);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center">
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ml-4 flex-shrink-0 cursor-pointer ${task.completed ? 'bg-teal-500 border-teal-500' : 'bg-white border-gray-300 hover:border-teal-400'}`}
                    aria-label={`Mark task ${task.title} as complete`}
                >
                     {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <div className="bg-gray-100 text-gray-600 p-3 rounded-lg ml-3">
                    {task.icon}
                </div>
                <div className="flex-grow">
                    <p className={`font-bold text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                    <div className="flex items-center mt-1">
                        <p className={`text-xs text-gray-500 ${task.completed ? 'line-through' : ''}`}>{task.subtitle}</p>
                        {task.category && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${
                                task.category === 'stdTest' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                                {task.category === 'stdTest' ? 'اختبارات معيارية' : 'مواد دراسية'}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                    <button onClick={() => setIsNotesOpen(p => !p)} className="p-2 text-gray-400 hover:text-yellow-500 rounded-full hover:bg-yellow-50 transition-colors" aria-label="Add or edit notes">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(task.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors" aria-label="Delete task">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {isNotesOpen && (
                <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in-fast">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="أضف ملاحظاتك هنا..."
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500"
                        rows={2}
                    />
                    <div className="flex justify-end mt-2">
                        <button onClick={handleSaveNotes} className="px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-md hover:bg-teal-600">
                            حفظ الملاحظات
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ onShowDetails, tasks, onToggleTaskComplete, onUpdateTaskNotes, onDeleteTask, onAddTask }) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    const [dateRange, setDateRange] = useState('last7days');
    const [activityData, setActivityData] = useState(initialWeeklyActivityData);
    const [stdTestActivityData, setStdTestActivityData] = useState(initialStdTestActivityData);
    const [stats, setStats] = useState({
      studyTime: '3.2 ساعة', flashcards: '158', quizAverage: '88%', completedLessons: '12',
      studyTimeChange: '+15%', flashcardsChange: '+8%', quizAverageChange: '-2%', completedLessonsChange: '+10%',
      studyTimeChangeType: 'increase' as const, flashcardsChangeType: 'increase' as const,
      quizAverageChangeType: 'decrease' as const, completedLessonsChangeType: 'increase' as const,
      stdTestAccuracy: '92%', stdTestAccuracyChange: '+3%', stdTestAccuracyChangeType: 'increase' as const,
      stdTestQuestionsAnswered: '240', stdTestQuestionsAnsweredChange: '+25%', stdTestQuestionsAnsweredChangeType: 'increase' as const,
      stdTestBestSubject: 'الأحياء', stdTestWorstSubject: 'الرياضيات',
    });
    const [chartView, setChartView] = useState<'study' | 'stdTest'>('study');

    useEffect(() => {
        // This effect simulates fetching new data based on the selected date range.
        const numDays = dateRange === 'last30days' ? 30 : 7;
        
        const generateData = () => {
             setActivityData(Array.from({ length: numDays }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (numDays - 1 - i));
                const dayName = date.toLocaleDateString('ar-SA', { weekday: 'short' });
                return {
                    name: dayName,
                    'دقائق الدراسة': Math.floor(Math.random() * 80) + 10,
                    'الدروس المكتملة': Math.floor(Math.random() * 4),
                    'بطاقات المراجعة': Math.floor(Math.random() * 50),
                    'الاختبارات': Math.floor(Math.random() * 3),
                };
            }));
             setStdTestActivityData(Array.from({ length: numDays }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (numDays - 1 - i));
                const dayName = date.toLocaleDateString('ar-SA', { weekday: 'short' });
                return {
                    name: dayName,
                    'أسئلة محلولة': Math.floor(Math.random() * 40) + 5,
                    'متوسط الدقة': Math.floor(Math.random() * 25) + 70,
                };
            }));
        };
        generateData();
    }, [dateRange]);


    const handleAddTaskForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        onAddTask(newTaskTitle);
        setNewTaskTitle('');
        setIsAddingTask(false);
    };

  return (
    <div className="p-8 pb-16 h-full overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم</h1>
      <p className="text-gray-500 mb-8">مرحباً بعودتك! إليك نظرة شاملة على تقدمك الدراسي.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
             {/* Performance Indicators */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">احصائيات مساعدي الذكي</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard title="وقت الدراسة" value={stats.studyTime} icon={<DocumentIcon className="w-6 h-6"/>} onClick={() => onShowDetails('studyTime')} footer={<TrendFooter change={stats.studyTimeChange} changeType={stats.studyTimeChangeType} />} />
                    <StatCard title="متوسط الاختبارات" value={stats.quizAverage} icon={<QuizIcon className="w-6 h-6"/>} onClick={() => onShowDetails('quizAverage')} footer={<TrendFooter change={stats.quizAverageChange} changeType={stats.quizAverageChangeType} />} />
                    <StatCard title="الدقة (المعيارية)" value={stats.stdTestAccuracy} color="indigo" icon={<GraduationCapIcon className="w-6 h-6"/>} onClick={() => onShowDetails('standardizedTestPerformance')} footer={<TrendFooter change={stats.stdTestAccuracyChange} changeType={stats.stdTestAccuracyChangeType} />} />
                    <StatCard title="الدروس المكتملة" value={stats.completedLessons} icon={<CheckCircleIcon className="w-6 h-6"/>} onClick={() => onShowDetails('studyTime')} footer={<TrendFooter change={stats.completedLessonsChange} changeType={stats.completedLessonsChangeType} />} />
                </div>
            </div>

            {/* Combined Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">النشاط الأسبوعي</h2>
                    <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setChartView('study')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'study' ? 'bg-white text-teal-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}>
                            دقائق دراسية
                        </button>
                        <button onClick={() => setChartView('stdTest')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartView === 'stdTest' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}>
                            الاختبارات المعيارية
                        </button>
                    </div>
                </div>
                {chartView === 'study' ? <WeeklyActivityChart data={activityData} /> : <StdTestActivityChart data={stdTestActivityData} />}
            </div>
        </div>

        {/* Tasks Sidebar */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">مهامك القادمة</h2>
                    <button onClick={() => setIsAddingTask(p => !p)} className="flex items-center text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors">
                        <PlusIcon className="w-5 h-5 ml-1" />
                        <span>أضف مهمة</span>
                    </button>
                </div>
                
                {isAddingTask && (
                <form onSubmit={handleAddTaskForm} className="mb-4 p-3 bg-gray-50 rounded-lg animate-fade-in-fast">
                    <input 
                    type="text" 
                    value={newTaskTitle} 
                    onChange={(e) => setNewTaskTitle(e.target.value)} 
                    placeholder="اكتب عنوان المهمة..."
                    className="w-full p-2 border border-gray-200 rounded-md mb-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <div className="flex justify-end space-x-2 space-x-reverse">
                    <button type="button" onClick={() => setIsAddingTask(false)} className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
                    <button type="submit" className="px-3 py-1 text-xs font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600">حفظ</button>
                    </div>
                </form>
                )}
                
                <div className="space-y-3 flex-grow">
                {tasks.map(task => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleTaskComplete}
                        onUpdateNotes={onUpdateTaskNotes}
                        onDelete={onDeleteTask}
                    />
                ))}
                {tasks.length === 0 && !isAddingTask && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-8">
                        <CheckCircleIcon className="w-12 h-12 mb-3 text-gray-300" />
                        <p>لا توجد مهام حالياً.</p>
                        <p className="text-xs">أضف مهمة جديدة للبدء!</p>
                    </div>
                )}
                </div>
                
                <button onClick={() => onShowDetails('nextSteps')} className="w-full mt-4 bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    عرض كل المهام
                </button>
            </div>
        </div>

      </div>

    </div>
  );
};