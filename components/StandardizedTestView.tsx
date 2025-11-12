import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { StandardizedTestSubject, QuizQuestion, ChatMessage } from '../types';
import * as GeminiService from '../services/geminiService';
import { ChatIcon, GraduationCapIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon, CogIcon } from './Icons';
import { EquationRenderer } from './EquationRenderer';
import { ChatMarkdownRenderer } from './MarkdownRenderer';

const testDetailsMap: Record<StandardizedTestSubject, { title: string; skills: string[]; tutorPrompt: string; }> = {
    'qudrat-verbal': {
        title: 'القدرات - القسم اللفظي',
        skills: ['التناظر اللفظي', 'إكمال الجمل', 'الخطأ السياقي', 'الارتباط والاختلاف', 'استيعاب المقروء'],
        tutorPrompt: 'أنت مدرس خصوصي خبير في القسم اللفظي لاختبار القدرات العامة السعودي (قياس). وظيفتك هي الإجابة على أسئلة الطالب وشرح المفاهيم والاستراتيجيات المتعلقة بالقسم اللفظي فقط. كن واضحاً ومباشراً وقدم أمثلة عند الحاجة. استخدم تنسيق الماركداون.'
    },
    'qudrat-quantitative': {
        title: 'القدرات - القسم الكمي',
        skills: ['الجبر', 'الهندسة', 'الحساب', 'التحليل والإحصاء'],
        tutorPrompt: 'أنت مدرس رياضيات خبير في القسم الكمي لاختبار القدرات العامة السعودي (قياس). وظيفتك هي الإجابة على أسئلة الطالب، وشرح القوانين، وحل المسائل خطوة بخطوة. ركز على المفاهيم والاستراتيجيات المتعلقة بالقسم الكمي فقط. استخدم تنسيق الماركداون.'
    },
    'tahseeli-math': {
        title: 'التحصيلي - الرياضيات',
        skills: ['التفاضل والتكامل', 'الجبر', 'الهندسة التحليلية', 'المتجهات', 'الاحتمالات'],
        tutorPrompt: 'أنت مدرس رياضيات خبير في منهج الرياضيات للاختبار التحصيلي السعودي. وظيفتك هي شرح الدروس المعقدة، وحل المسائل، والإجابة على استفسارات الطالب المتعلقة بمنهج الرياضيات للمرحلة الثانوية. استخدم تنسيق الماركداون.'
    },
    'tahseeli-physics': {
        title: 'التحصيلي - الفيزياء',
        skills: ['الميكانيكا الكلاسيكية', 'الكهرومغناطيسية', 'الديناميكا الحرارية', 'الفيزياء الحديثة'],
        tutorPrompt: 'أنت مدرس فيزياء خبير في منهج الفيزياء للاختبار التحصيلي السعودي. وظيفتك هي شرح القوانين والنظريات الفيزيائية، وحل المسائل، والإجابة على استفسارات الطالب المتعلقة بمنهج الفيزياء للمرحلة الثانوية. استخدم تنسيق الماركداون.'
    },
    'tahseeli-chemistry': {
        title: 'التحصيلي - الكيمياء',
        skills: ['الكيمياء العضوية', 'الكيمياء غير العضوية', 'الكيمياء الفيزيائية', 'الكيمياء التحليلية'],
        tutorPrompt: 'أنت مدرس كيمياء خبير في منهج الكيمياء للاختبار التحصيلي السعودي. وظيفتك هي شرح التفاعلات الكيميائية، والمفاهيم، وحل المسائل، والإجابة على استفسارات الطالب المتعلقة بمنهج الكيمياء للمرحلة الثانوية. استخدم تنسيق الماركداون.'
    },
    'tahseeli-biology': {
        title: 'التحصيلي - الأحياء',
        skills: ['علم الخلية', 'الوراثة', 'علم البيئة', 'تشريح ووظائف الأعضاء'],
        tutorPrompt: 'أنت مدرس أحياء خبير في منهج الأحياء للاختبار التحصيلي السعودي. وظيفتك هي شرح العمليات الحيوية، والمفاهيم، والإجابة على استفسارات الطالب المتعلقة بمنهج الأحياء للمرحلة الثانوية. استخدم تنسيق الماركداون.'
    }
};

const TutorChat: React.FC<{
    initialPrompt: string;
    currentQuestion: QuizQuestion | null;
}> = ({ initialPrompt, currentQuestion }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            setMessages([{
                role: 'model',
                text: 'مرحباً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك بهذا السؤال؟'
            }]);
            isFirstRender.current = false;
        }
    }, []);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!userInput.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const geminiHistory = newMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        
        let systemInstruction = initialPrompt;
        if (currentQuestion) {
            systemInstruction += `\n\n---
            سياق السؤال الحالي الذي يتدرب عليه الطالب (لا تذكره إلا إذا كان سؤاله متعلقًا به مباشرة):
            السؤال: ${currentQuestion.question}
            الخيارات: ${currentQuestion.options.join(', ')}
            الإجابة الصحيحة: ${currentQuestion.correctAnswer}
            الشرح: ${currentQuestion.explanation}
            ---`;
        }

        const modelResponse = await GeminiService.chatWithTutor(geminiHistory.slice(0, -1), userInput, systemInstruction);
        setMessages([...newMessages, { role: 'model', text: modelResponse }]);
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="bg-teal-100 text-teal-600 p-2 rounded-lg">
                    <ChatIcon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 mr-3">المساعد الذكي</h2>
            </div>
            <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0 text-sm font-bold">AI</div>}
                        <div className={`max-w-xs p-3 rounded-2xl ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-br-none shadow-sm' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
                           <ChatMarkdownRenderer text={msg.text} size="small" />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0 text-sm font-bold">AI</div>
                        <div className="p-3 rounded-2xl bg-white border border-gray-200">
                            <div className="flex items-center space-x-1 space-x-reverse">
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center bg-white">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="اسأل أي شيء..."
                    className="flex-grow p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    disabled={isLoading}
                />
                <button type="submit" className="mr-3 bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 disabled:bg-gray-300 shadow-sm transition-all" disabled={isLoading || !userInput.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
        </div>
    );
};


export const StandardizedTestView: React.FC<{ 
    testSubject: StandardizedTestSubject;
    onUpdateScore: (result: 'correct' | 'incorrect') => void;
}> = ({ testSubject, onUpdateScore }) => {
    const details = testDetailsMap[testSubject];

    const [selectedSkill, setSelectedSkill] = useState(details.skills[0]);
    const [difficulty, setDifficulty] = useState<'متوسط' | 'صعب' | 'متقدم'>('متوسط');
    const [question, setQuestion] = useState<QuizQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [sessionScore, setSessionScore] = useState({ correct: 0, incorrect: 0 });

    const generateQuestion = useCallback(async () => {
        setIsLoading(true);
        setQuestion(null);
        setSelectedAnswer(null);
        setIsAnswered(false);
        const result = await GeminiService.generateStandardizedTestQuestion(details.title, selectedSkill, difficulty);
        setQuestion(result ? { ...result, id: `q-${Date.now()}` } : null);
        setIsLoading(false);
    }, [details.title, selectedSkill, difficulty]);

    useEffect(() => {
        generateQuestion();
    }, [selectedSkill, difficulty, generateQuestion]);

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered || !question) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        const result = answer === question.correctAnswer ? 'correct' : 'incorrect';
        setSessionScore(s => ({ ...s, [result]: s[result] + 1 }));
        onUpdateScore(result);
    };

    const totalAnswered = sessionScore.correct + sessionScore.incorrect;
    const accuracy = totalAnswered > 0 ? Math.round((sessionScore.correct / totalAnswered) * 100) : 0;

    return (
        <div className="h-full bg-gray-50 overflow-hidden p-6 flex flex-col gap-6">
            <header className="flex items-center shrink-0">
                <div className="bg-teal-100 text-teal-600 p-2 rounded-lg">
                    <GraduationCapIcon className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mr-4">{details.title}</h1>
            </header>
            
            <div className="grid grid-cols-12 gap-6 flex-grow min-h-0">
                {/* Right Column: Training Settings */}
                <div className="col-span-12 lg:col-span-3 h-full flex flex-col">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <div className="bg-gray-100 text-gray-600 p-2 rounded-lg">
                                <CogIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-800 mr-3 text-lg">إعدادات التدريب</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="font-bold text-gray-700 block mb-2">المهارة</label>
                                <div className="flex flex-wrap gap-2">
                                    {details.skills.map(skill => (
                                        <button 
                                            key={skill} 
                                            onClick={() => setSelectedSkill(skill)}
                                            className={`px-3 py-1.5 font-semibold rounded-lg transition-all duration-200 text-xs border ${
                                                selectedSkill === skill
                                                ? 'bg-teal-100 text-teal-800 border-teal-200'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-gray-700 block mb-2">الصعوبة</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {(['متوسط', 'صعب', 'متقدم'] as const).map(level => (
                                        <button 
                                            key={level} 
                                            onClick={() => setDifficulty(level)} 
                                            className={`w-full text-center px-2 py-1.5 font-semibold rounded-md transition-all duration-200 text-xs ${difficulty === level ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Column: Main Content */}
                <div className="col-span-12 lg:col-span-6 h-full flex flex-col gap-6">
                    <main className="flex-grow bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col justify-center items-center overflow-y-auto min-h-0">
                         {isLoading ? (
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full border-4 border-teal-500 animate-spin mx-auto" style={{ borderTopColor: 'transparent' }}></div>
                                <p className="mt-4 text-gray-600 font-semibold">جاري إنشاء سؤال جديد...</p>
                            </div>
                        ) : question ? (
                            <div className="w-full max-w-2xl animate-fade-in-fast">
                                <div className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed text-center">
                                    <EquationRenderer text={question.question} />
                                </div>
                                <div className="space-y-3">
                                    {question.options.map((option, i) => {
                                        let stateClass = 'bg-gray-50 border-gray-200 hover:border-teal-400 hover:bg-white text-gray-800';
                                        if (isAnswered) {
                                            if (option === question.correctAnswer) {
                                                stateClass = 'bg-green-100 border-green-500 text-green-800 font-bold';
                                            } else if (option === selectedAnswer) {
                                                stateClass = 'bg-red-100 border-red-500 text-red-800';
                                            } else {
                                                stateClass = 'bg-gray-100 border-gray-200 text-gray-500 opacity-70 cursor-not-allowed';
                                            }
                                        }
                                        return (
                                            <button 
                                                key={i} 
                                                onClick={() => handleAnswerSelect(option)} 
                                                disabled={isAnswered}
                                                className={`block w-full text-right p-4 rounded-xl border-2 transition-all duration-200 text-base font-semibold ${stateClass}`}
                                            >
                                                <EquationRenderer text={option} />
                                            </button>
                                        );
                                    })}
                                </div>
                                {isAnswered && (
                                    <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded-md animate-fade-in-fast">
                                        <h4 className="font-bold text-blue-800">التفسير:</h4>
                                        <div className="text-blue-700 mt-2 text-sm leading-relaxed">
                                            <EquationRenderer text={question.explanation || ''} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                             <div className="text-center text-gray-500">
                                <p>عذرًا، لم نتمكن من إنشاء سؤال. يرجى المحاولة مرة أخرى.</p>
                                <button onClick={generateQuestion} className="mt-4 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg">
                                    المحاولة مرة أخرى
                                </button>
                            </div>
                        )}
                    </main>
                    <footer className="shrink-0 flex items-stretch gap-4">
                        <div className="flex-grow bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-x-6">
                                <div className="flex items-center" title="الإجابات الصحيحة">
                                    <CheckCircleIcon className="w-6 h-6 text-green-500"/>
                                    <span className="font-bold text-xl text-green-600 mr-2">{sessionScore.correct}</span>
                                </div>
                                <div className="flex items-center" title="الإجابات الخاطئة">
                                    <XCircleIcon className="w-6 h-6 text-red-500"/>
                                    <span className="font-bold text-xl text-red-600 mr-2">{sessionScore.incorrect}</span>
                                </div>
                                <div className="text-center">
                                    <span className="font-bold text-xl text-gray-700">{accuracy}%</span>
                                    <span className="text-xs text-gray-500 block">الدقة</span>
                                </div>
                            </div>
                            <button onClick={() => setSessionScore({ correct: 0, incorrect: 0 })} className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors" title="إعادة تعيين إحصائيات الجلسة">
                                إعادة تعيين
                            </button>
                        </div>
                        <button 
                            onClick={generateQuestion} 
                            disabled={isLoading}
                            className="w-1/3 flex items-center justify-center bg-teal-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-500/40 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:shadow-none"
                        >
                            <span>{isAnswered ? 'السؤال التالي' : 'توليد سؤال'}</span>
                            <ArrowRightIcon className="w-5 h-5 mr-2 transform -rotate-180" />
                        </button>
                    </footer>
                </div>

                {/* Left Column: Tutor Chat */}
                <div className="col-span-12 lg:col-span-3 h-full">
                    <TutorChat initialPrompt={details.tutorPrompt} currentQuestion={question} />
                </div>

            </div>
        </div>
    );
};