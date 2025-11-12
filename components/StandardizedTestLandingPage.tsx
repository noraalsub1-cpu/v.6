import React, { useState } from 'react';
import type { StandardizedTestSubject } from '../types';
import { GraduationCapIcon, UploadIcon, CalculatorIcon, ChatIcon as VerbalIcon, BeakerIcon, DnaIcon, BookOpenIcon, DownloadIcon, ArrowRightIcon } from './Icons';

interface StandardizedTestLandingProps {
  onSelectTest: (subject: StandardizedTestSubject) => void;
}

type TestType = 'qudrat' | 'tahseeli';

const TestCard: React.FC<{ icon: React.ReactNode, name: string, description: string, onSelect: () => void }> = ({ icon, name, description, onSelect }) => {
    return (
        <button 
            onClick={onSelect} 
            className="group relative text-right bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 w-full h-full flex flex-col"
        >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-tr from-teal-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-xl transition-colors group-hover:bg-white group-hover:shadow-md mb-4 self-start">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-4">{description}</p>
                <div className="mt-auto flex justify-end items-center">
                    <span className="font-bold text-teal-600">ابدأ التدريب</span>
                    <ArrowRightIcon className="w-5 h-5 text-teal-600 mr-2 transform transition-transform group-hover:-translate-x-1" />
                </div>
            </div>
        </button>
    );
};

const ResourceCard: React.FC<{ title: string, description: string, color: string, onDownload: () => void }> = ({ title, description, color, onDownload }) => (
    <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${color}`}>
            <BookOpenIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-grow">
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        <button onClick={onDownload} className="p-2 text-gray-400 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <DownloadIcon className="w-5 h-5" />
        </button>
    </div>
);


export const StandardizedTestLandingPage: React.FC<StandardizedTestLandingProps> = ({ onSelectTest }) => {
    const [activeTest, setActiveTest] = useState<TestType>('qudrat');
    
    const qudratSubjects = [
        { subject: 'qudrat-verbal', name: 'القسم اللفظي', description: 'تدرب على التناظر اللفظي، إكمال الجمل، الخطأ السياقي، واستيعاب المقروء بأسئلة متجددة.', icon: <VerbalIcon className="w-7 h-7" /> },
        { subject: 'qudrat-quantitative', name: 'القسم الكمي', description: 'عزز مهاراتك في الجبر والهندسة والحساب والتحليل الإحصائي عبر تدريبات مكثفة.', icon: <CalculatorIcon className="w-7 h-7" /> }
    ];

    const tahseeliSubjects = [
        { subject: 'tahseeli-math', name: 'الرياضيات', description: 'مراجعة شاملة لمفاهيم التفاضل والتكامل والجبر والهندسة.', icon: <CalculatorIcon className="w-7 h-7" /> },
        { subject: 'tahseeli-physics', name: 'الفيزياء', description: 'تدرب على أسئلة في الميكانيكا، الكهرومغناطيسية، والفيزياء الحديثة.', icon: <BeakerIcon className="w-7 h-7" /> },
        { subject: 'tahseeli-chemistry', name: 'الكيمياء', description: 'أسئلة تغطي الكيمياء العضوية، غير العضوية، والفيزيائية.', icon: <BeakerIcon className="w-7 h-7" /> },
        { subject: 'tahseeli-biology', name: 'الأحياء', description: 'اختبر معلوماتك في علم الخلية، الوراثة، وعلم البيئة.', icon: <DnaIcon className="w-7 h-7" /> }
    ];
    
    const readyBooks = [
        { title: 'ملخص شامل للقسم اللفظي', description: 'يجمع أهم الاستراتيجيات و500+ سؤال تدريبي.', color: 'bg-teal-500' },
        { title: 'بنك أسئلة القسم الكمي', description: 'أسئلة محلولة ومقسمة حسب المهارات.', color: 'bg-blue-500' },
        { title: 'أهم قوانين الفيزياء للتحصيلي', description: 'كتيب يلخص جميع القوانين الهامة.', color: 'bg-indigo-500' }
    ];

    return (
        <div className="h-full overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        استعد للاختبارات المعيارية
                    </h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
                        تدريب ذكي ومكثّف لاختبارات القدرات والتحصيلي، مصمم لمساعدتك على تحقيق أعلى الدرجات.
                    </p>
                </header>

                <main className="space-y-24">
                    {/* Interactive Training Section */}
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                ابدأ تدريبك التفاعلي
                            </h2>
                             <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                                اختر الاختبار الذي تستعد له وابدأ التدريب فوراً بأسئلة متجددة وشروحات وافية.
                            </p>
                        </div>
                         {/* Tabs */}
                        <div className="flex justify-center mb-10">
                            <div className="bg-gray-200 p-1.5 rounded-xl flex space-x-2">
                                <button 
                                    onClick={() => setActiveTest('qudrat')}
                                    className={`px-8 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${activeTest === 'qudrat' ? 'bg-white text-teal-700 shadow-md' : 'text-gray-600 hover:bg-gray-300'}`}
                                >
                                    اختبار القدرات العامة
                                </button>
                                <button 
                                    onClick={() => setActiveTest('tahseeli')}
                                    className={`px-8 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${activeTest === 'tahseeli' ? 'bg-white text-teal-700 shadow-md' : 'text-gray-600 hover:bg-gray-300'}`}
                                >
                                    الاختبار التحصيلي
                                </button>
                            </div>
                        </div>

                         {/* Content based on tab */}
                        {activeTest === 'qudrat' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in-fast">
                                {qudratSubjects.map(test => (
                                    <TestCard 
                                        key={test.subject}
                                        icon={test.icon}
                                        name={test.name}
                                        description={test.description}
                                        onSelect={() => onSelectTest(test.subject as StandardizedTestSubject)}
                                    />
                                ))}
                            </div>
                        )}
                        {activeTest === 'tahseeli' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-fast">
                                {tahseeliSubjects.map(test => (
                                    <TestCard 
                                        key={test.subject}
                                        icon={test.icon}
                                        name={test.name}
                                        description={test.description}
                                        onSelect={() => onSelectTest(test.subject as StandardizedTestSubject)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                    
                     {/* Additional Resources Section */}
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">عزز استعدادك بمصادر إضافية</h2>
                            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">استخدم كتبك الخاصة أو حمّل ملخصاتنا الجاهزة التي أعدها الخبراء.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* Upload Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-teal-200 flex flex-col items-center text-center transition-all duration-300 hover:shadow-teal-100 hover:border-teal-300">
                                <div className="p-4 bg-teal-100 text-teal-600 rounded-2xl mb-4">
                                    <UploadIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-gray-800">لديك كتابك الخاص؟</h3>
                                <p className="text-gray-600 mt-2 mb-6 max-w-xs">
                                    ارفعه بصيغة PDF وحوّله إلى تجربة تفاعلية غنية بالأدوات الذكية من شروحات واختبارات.
                                </p>
                                <button className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-transform transform hover:scale-105">
                                    ارفع كتابك الآن
                                </button>
                            </div>

                             {/* Ready Books Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                                <div className="flex items-center mb-6">
                                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
                                        <DownloadIcon className="w-12 h-12" />
                                    </div>
                                    <div className="mr-4">
                                        <h3 className="text-2xl font-extrabold text-gray-800">كتب وملخصات جاهزة</h3>
                                        <p className="text-gray-600">حمّل مصادرنا الحصرية التي أعدها خبراء.</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {readyBooks.map((book, index) => (
                                        <ResourceCard key={index} title={book.title} description={book.description} color={book.color} onDownload={() => alert(`Downloading ${book.title}`)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};