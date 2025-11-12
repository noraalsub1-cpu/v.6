import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { StudyMaterial, Flashcard, QuizQuestion, ChatMessage, Lesson, QuizAnalysis, LessonSolution, SuggestedSource } from '../types';
import * as GeminiService from '../services/geminiService';
import { SummaryIcon, FlashcardIcon, QuizIcon, ChatIcon, FlipIcon, CheckCircleIcon, FileTextIcon, CircleIcon, SolutionsIcon, ChevronDownIcon, LinkIcon, ExternalLinkIcon, ShieldCheckIcon, GraduationCapIcon, BookOpenIcon, DocumentIcon, DownloadIcon } from './Icons';
import { MarkdownRenderer } from './MarkdownRenderer';

interface StudyMaterialViewProps {
  material: StudyMaterial;
  onToggleLessonComplete: (materialId: string, lessonId: string) => void;
  onRequestFeedback: (callback: () => void) => void;
  onQuizComplete: (analysis: QuizAnalysis, materialName: string) => void;
  onUseFeature: (materialId: string, lessonId: string, feature: keyof NonNullable<Lesson['featureUsage']>) => void;
  initialSelectedStage: string | null;
  initialSelectedSemester: string | null;
}

const ProgressView: React.FC<{ title: string }> = ({ title }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 20;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-full p-8 text-center bg-white rounded-b-lg">
            <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className="text-teal-500"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45" cx="50" cy="50"
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-teal-600">{Math.round(progress)}%</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-6">{title}</h2>
            <p className="text-gray-500 mt-2">يقوم مساعدك الذكي بإعداد المحتوى، انتظر لحظات.</p>
        </div>
    );
};


const SummaryView: React.FC<{ content: string }> = ({ content }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [sources, setSources] = useState<SuggestedSource[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isCancelled = false;
        const fetchSummaryAndSources = async () => {
            setIsLoading(true);
            setSummary(null);
            setSources(null);

            const summaryPromise = GeminiService.generateSummary(content);
            const sourcesPromise = GeminiService.generateSuggestedSources(content);
            const [summaryResult, sourcesResult] = await Promise.all([summaryPromise, sourcesPromise]);

            if (!isCancelled) {
                setSummary(summaryResult);
                setSources(sourcesResult.map((s, i) => ({ ...s, id: `source-${i}` })));
                setIsLoading(false);
            }
        };
        fetchSummaryAndSources();
        return () => { isCancelled = true; };
    }, [content]);
    
    return isLoading ? <ProgressView title="جاري إنشاء الشرح..." /> : (
        <div className="p-8 pb-16 bg-white rounded-b-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">شرح الدرس</h2>
            {summary && <MarkdownRenderer text={summary} />}
            
            {sources && sources.length > 0 && (
                <div className="mt-10 pt-8 border-t-2 border-gray-200">
                    <div className="flex items-center mb-6">
                        <LinkIcon className="w-7 h-7 text-teal-500" />
                        <h3 className="text-2xl font-bold text-gray-800 mr-3">مصادر مقترحة للاستزادة</h3>
                    </div>
                    <div className="space-y-4">
                        {sources.map(source => (
                            <a 
                                key={source.id} 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 group"
                            >
                                <div className="ml-4 flex-grow">
                                    <p className="font-bold text-gray-800 group-hover:text-teal-700">{source.title}</p>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mt-1 tracking-wider">{source.type}</p>
                                </div>
                                <ExternalLinkIcon className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors shrink-0" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};
const FlashcardsView: React.FC<{ content: string }> = ({ content }) => {
    const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    
    useEffect(() => {
        let isCancelled = false;
        GeminiService.generateFlashcards(content).then(results => {
            if(!isCancelled) {
                setFlashcards(results.map((f, i) => ({ ...f, id: `fc-${i}` })));
            }
        });
        return () => { isCancelled = true; };
    }, [content]);
    
    if (flashcards === null) {
        return <ProgressView title="جاري إنشاء بطاقات المراجعة..." />;
    }
    
    if (flashcards.length === 0) {
        return <div className="p-8 text-center">تعذر إنشاء بطاقات المراجعة لهذا المحتوى.</div>;
    }

    const handleNextCard = () => {
        if (flashcards && currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    const handleCardClick = () => {
        if (isComplete) return;
        setIsFlipped(prev => !prev);
    };
    
    const handleRestart = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setIsComplete(false);
    };

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-white rounded-b-lg">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">أحسنت!</h3>
                <p className="text-gray-600 mt-2 mb-6">لقد أكملت مراجعة جميع البطاقات.</p>
                <button
                    onClick={handleRestart}
                    className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors"
                >
                    المراجعة مرة أخرى
                </button>
            </div>
        );
    }
    
    const card = flashcards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

    return (
        <div className="p-4 pb-16 flex flex-col items-center h-full bg-white rounded-b-lg">
            <div className="w-full max-w-2xl mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>التقدم</span>
                    <span>{currentCardIndex + 1} / {flashcards.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center w-full">
                <div className="w-full max-w-2xl h-96 perspective-1000 group" onClick={handleCardClick}>
                    <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute w-full h-full backface-hidden bg-white shadow-2xl rounded-2xl flex flex-col justify-center p-8 text-center border-2 border-gray-200">
                             <p className="text-sm font-bold text-teal-500 uppercase tracking-widest mb-4">سؤال</p>
                             <p className="text-3xl font-bold text-gray-800 flex-grow flex items-center justify-center">{card.question}</p>
                             <div className="absolute bottom-4 left-4 text-gray-400 group-hover:text-teal-500 transition-colors flex items-center space-x-1 space-x-reverse opacity-90">
                                <FlipIcon className="w-5 h-5" />
                                <span className="text-xs font-semibold">اقلب البطاقة</span>
                            </div>
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full backface-hidden bg-teal-500 shadow-2xl rounded-2xl flex flex-col justify-center p-8 text-center rotate-y-180 border-2 border-teal-600">
                             <p className="text-sm font-bold text-teal-100 uppercase tracking-widest mb-4">الإجابة</p>
                             <div className="text-white flex-grow flex items-center justify-center font-semibold text-2xl overflow-y-auto"><p>{card.answer}</p></div>
                             <div className="absolute bottom-4 left-4 text-teal-200 group-hover:text-white transition-colors flex items-center space-x-1 space-x-reverse opacity-90">
                                <FlipIcon className="w-5 h-5" />
                                <span className="text-xs font-semibold">اقلب البطاقة</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {/* Navigation Controls */}
            <div className="w-full max-w-2xl flex justify-between items-center mt-6">
                <button 
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                    السابق
                </button>
                <button 
                    onClick={handleNextCard}
                    className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-500/40 transform hover:scale-105"
                >
                    {currentCardIndex === flashcards.length - 1 ? 'إنهاء المراجعة' : 'التالي'}
                </button>
            </div>
        </div>
    );
};
const QuizView: React.FC<{ content: string; onQuizComplete: (analysis: QuizAnalysis) => void; lessonTitle: string }> = ({ content, onQuizComplete, lessonTitle }) => {
    const [quizState, setQuizState] = useState<'config' | 'active' | 'results'>('config');
    const [difficulty, setDifficulty] = useState<'متوسط' | 'متقدم'>('متوسط');
    const [numQuestions, setNumQuestions] = useState(5);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState<QuizQuestion[]>([]);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [shortAnswerInput, setShortAnswerInput] = useState('');

    const startQuiz = async () => {
        setIsLoading(true);
        setQuizState('active');
        const results = await GeminiService.generateQuiz(content, difficulty, numQuestions);
        setQuestions(results.map((q, i) => ({ ...q, id: `q-${i}` })));
        setIsLoading(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setIncorrectAnswers([]);
        setAnalysisComplete(false);
        setShortAnswerInput('');
    };

    const handleOptionSelect = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        } else {
            setIncorrectAnswers(prev => [...prev, questions[currentQuestionIndex]]);
        }
    };
    
    const handleShortAnswerSubmit = () => {
        if (isAnswered) return;
        setSelectedAnswer(shortAnswerInput);
        setIsAnswered(true);
        setIncorrectAnswers(prev => [...prev, questions[currentQuestionIndex]]);
    };

    const handleNext = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setShortAnswerInput('');
        } else {
            setQuizState('results');
            const questionsToAnalyze = incorrectAnswers.filter(q => q.type !== 'short-answer');
            if (questionsToAnalyze.length > 0) {
                const analysis = await GeminiService.analyzeIncorrectAnswers(content, questionsToAnalyze);
                if (analysis && Array.isArray(analysis.main_topics_of_weakness) && analysis.main_topics_of_weakness.length > 0) {
                    onQuizComplete(analysis);
                    setAnalysisComplete(true);
                }
            }
        }
    };
    
    const handleRestart = () => {
        setQuizState('config');
        setQuestions([]);
    };

    if (quizState === 'config') {
        return (
            <div className="p-6 flex flex-col items-center justify-center text-center h-full bg-white rounded-b-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">إعدادات الاختبار</h2>
                <p className="text-gray-600 mb-8">اختر مستوى الصعوبة وعدد الأسئلة.</p>
                <div className="w-full max-w-sm space-y-6">
                    <div>
                        <label className="block text-right font-semibold text-gray-700 mb-2">مستوى الصعوبة</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as 'متوسط' | 'متقدم')}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value="متوسط">متوسط</option>
                            <option value="متقدم">متقدم</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-right font-semibold text-gray-700 mb-2">عدد الأسئلة: {numQuestions}</label>
                        <input
                            type="range"
                            min="3"
                            max="15"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <button onClick={startQuiz} className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                        بدء الاختبار
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) return <ProgressView title="جاري إنشاء الاختبار..." />;
    if (!questions.length && quizState === 'active') return <p className="p-8 text-center">تعذر إنشاء اختبار لهذا المحتوى.</p>;
    
    if (quizState === 'results') {
        const totalScorableQuestions = questions.filter(q => q.type !== 'short-answer').length;
        return (
            <div className="p-6 pb-16 text-center flex flex-col items-center h-full overflow-y-auto bg-white rounded-b-lg">
                 <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">أنهيت الاختبار!</h2>
                <p className="text-gray-600 mb-4">نتيجتك النهائية هي:</p>
                <p className="text-5xl font-bold text-teal-600 mb-6">{score} / {totalScorableQuestions > 0 ? totalScorableQuestions : questions.length}</p>
                {analysisComplete && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 animate-fade-in-fast max-w-md">
                        <p><strong>ملاحظة:</strong> تم تحديد نقاط ضعفك وإضافتها كمهام مراجعة في لوحة التحكم لمساعدتك على التحسن.</p>
                    </div>
                )}
                 {incorrectAnswers.length > 0 && (
                    <div className="my-8 text-right max-w-md mx-auto w-full">
                        <h3 className="text-xl font-bold mb-4">أسئلة للمراجعة:</h3>
                        <div className="space-y-4">
                            {incorrectAnswers.map((q) => (
                                <div key={q.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="font-semibold text-gray-800">{q.question}</p>
                                    <p className="text-sm mt-2"><span className="font-semibold text-green-700">الإجابة الصحيحة:</span> {q.correctAnswer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button onClick={handleRestart} className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors mt-auto">
                    إعادة الاختبار
                </button>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
         <div className="p-6 pb-16 flex flex-col bg-white rounded-b-lg">
            <p className="text-sm text-gray-500 mb-2">سؤال {currentQuestionIndex + 1} من {questions.length}</p>
            <h3 className="text-xl font-semibold mb-6">
                {currentQuestion.question}
            </h3>
            
            { (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') ? (
                <div className="space-y-3 mb-4">
                    {currentQuestion.options.map((opt, i) => {
                        let buttonClass = 'bg-gray-50 border-gray-200 hover:bg-gray-100';
                        if (isAnswered) {
                            if (opt === currentQuestion.correctAnswer) {
                                buttonClass = 'bg-green-100 border-green-500 text-green-800';
                            } else if (opt === selectedAnswer) {
                                 buttonClass = 'bg-red-100 border-red-500 text-red-800';
                            }
                        }
                        return (
                            <button key={i} onClick={() => handleOptionSelect(opt)} disabled={isAnswered} className={`block w-full text-right p-4 rounded-lg border-2 transition-colors font-medium ${buttonClass}`}>
                                {opt}
                            </button>
                        )
                    })}
                </div>
            ) : (
                <div className="mb-4">
                    <textarea 
                        value={shortAnswerInput}
                        onChange={(e) => setShortAnswerInput(e.target.value)}
                        disabled={isAnswered}
                        placeholder="اكتب إجابتك هنا..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                        rows={3}
                    />
                    {!isAnswered && (
                        <button onClick={handleShortAnswerSubmit} className="mt-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600">
                            تأكيد الإجابة
                        </button>
                    )}
                </div>
            )}

            {isAnswered && (
                 <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg animate-fade-in-fast">
                    <h4 className="font-bold text-teal-800">التفسير:</h4>
                     {currentQuestion.type === 'short-answer' && (
                        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm font-semibold text-green-800">الإجابة النموذجية:</p>
                            <div className="text-green-700">
                                {currentQuestion.correctAnswer}
                            </div>
                        </div>
                    )}
                    <div className="text-teal-700 mt-1">
                        {currentQuestion.explanation}
                    </div>
                    <div className="pt-4">
                        <button onClick={handleNext} disabled={!isAnswered} className="bg-teal-500 text-white px-8 py-3 rounded-lg w-full disabled:bg-gray-300 font-semibold transition-colors">
                            {currentQuestionIndex < questions.length - 1 ? 'السؤال التالي' : 'عرض النتائج'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
const ChatView: React.FC<{ content: string; lessonTitle: string; }> = ({ content, lessonTitle }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const systemInstruction = `أنت مدرس ذكاء اصطناعي متخصص في مادة ${lessonTitle}. وظيفتك هي الإجابة على أسئلة الطالب بناءً على محتوى الدرس المقدم فقط. كن ودودًا وواضحًا في إجاباتك. إذا كان السؤال خارج نطاق المحتوى، أجب بلطف أنك لا تملك معلومات حول ذلك. المحتوى هو:\n\n---\n${content}\n---`;

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
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

        const modelResponse = await GeminiService.chatWithTutor(geminiHistory.slice(0, -1), userInput, systemInstruction);
        setMessages([...newMessages, { role: 'model', text: modelResponse }]);
        setIsLoading(false);
    }
    
    return (
        <div className="h-full flex flex-col bg-white rounded-b-lg">
            <div ref={chatContainerRef} className="flex-grow p-4 pb-8 space-y-4 overflow-y-auto">
                {messages.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                        <ChatIcon className="w-16 h-16 mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-800">المساعد الذكي</h3>
                        <p className="mt-2 max-w-sm">أنا هنا لمساعدتك على فهم هذا الدرس. اطرح أي سؤال يخطر ببالك!</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0 text-sm font-bold">AI</div>}
                        <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0 text-sm font-bold">AI</div>
                         <div className="max-w-md p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                            <div className="flex items-center space-x-1 space-x-reverse">
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center bg-white rounded-b-lg">
                <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="اسأل أي شيء عن هذا الدرس..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    disabled={isLoading}
                />
                <button type="submit" className="mr-3 bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 disabled:bg-gray-300" disabled={isLoading || !userInput.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
        </div>
    );
};
const SolutionsView: React.FC<{ content: string }> = ({ content }) => {
    const [solutions, setSolutions] = useState<LessonSolution[] | null>(null);

    useEffect(() => {
        let isCancelled = false;
        GeminiService.generateLessonSolutions(content).then(results => {
            if (!isCancelled) {
                setSolutions(results.map((s, i) => ({ ...s, id: `sol-${i}` })));
            }
        });
        return () => { isCancelled = true; };
    }, [content]);
    
    if (solutions === null) {
        return <ProgressView title="جاري استخراج حلول التمارين..." />;
    }
    
    if (solutions.length === 0) {
        return <div className="p-8 text-center bg-white rounded-b-lg">لم يتم العثور على تمارين أو أسئلة في هذا الدرس.</div>;
    }

    return (
        <div className="p-8 pb-16 bg-white rounded-b-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">حلول تمارين الدرس</h2>
            <div className="space-y-6">
                {solutions.map(solution => (
                    <div key={solution.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-3">{solution.question}</h3>
                        <div className="p-4 bg-teal-50 border-r-4 border-teal-500 text-teal-800">
                            <div className="leading-relaxed">{solution.solution}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LessonView: React.FC<{
  lesson: Lesson;
  onBack: () => void;
  onRequestFeedback: (callback: () => void) => void;
  onQuizComplete: (analysis: QuizAnalysis) => void;
  onUseFeature: (feature: keyof NonNullable<Lesson['featureUsage']>) => void;
}> = ({ lesson, onBack, onRequestFeedback, onQuizComplete, onUseFeature }) => {
    type ActiveTool = 'summary' | 'flashcards' | 'quiz' | 'chat' | 'solutions';
    const [activeTool, setActiveTool] = useState<ActiveTool>('summary');
    const firstRender = useRef(true);

    useEffect(() => {
        if(firstRender.current) {
            onUseFeature('summary');
            firstRender.current = false;
        } else {
            onUseFeature(activeTool);
        }
    }, [activeTool, onUseFeature]);

    const handleToolChange = (tool: ActiveTool) => {
        setActiveTool(tool);
    };
    
    const handleEndSession = () => {
        onRequestFeedback(onBack);
    };

    const ToolButton: React.FC<{ tool: ActiveTool; label: string; icon: React.ReactNode; }> = ({ tool, label, icon }) => (
        <button
            onClick={() => handleToolChange(tool)}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-3 font-semibold border-b-4 transition-colors ${activeTool === tool ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeTool) {
            case 'summary': return <SummaryView content={lesson.content} />;
            case 'solutions': return <SolutionsView content={lesson.content} />;
            case 'flashcards': return <FlashcardsView content={lesson.content} />;
            case 'quiz': return <QuizView content={lesson.content} onQuizComplete={onQuizComplete} lessonTitle={lesson.name} />;
            case 'chat': return <ChatView content={lesson.content} lessonTitle={lesson.name} />;
            default: return null;
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
                <button onClick={handleEndSession} className="text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">
                    → العودة إلى قائمة الدروس
                </button>
                <h2 className="text-lg font-bold text-gray-800">{lesson.name}</h2>
            </div>
            <div className="border-b border-gray-200 bg-white">
                <nav className="flex space-x-4 space-x-reverse px-4">
                    <ToolButton tool="summary" label="شرح الدرس" icon={<SummaryIcon className="w-5 h-5" />} />
                    <ToolButton tool="solutions" label="حلول التمارين" icon={<SolutionsIcon className="w-5 h-5" />} />
                    <ToolButton tool="flashcards" label="بطاقات المراجعة" icon={<FlashcardIcon className="w-5 h-5" />} />
                    <ToolButton tool="quiz" label="اختبار" icon={<QuizIcon className="w-5 h-5" />} />
                    <ToolButton tool="chat" label="المساعد الذكي" icon={<ChatIcon className="w-5 h-5" />} />
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
                {renderContent()}
            </div>
        </div>
    );
};

const ORDERED_ACADEMIC_STAGES = [
    'أول ابتدائي', 'ثاني ابتدائي', 'ثالث ابتدائي', 'رابع ابتدائي', 'خامس ابتدائي', 'سادس ابتدائي',
    'أول متوسط', 'ثاني متوسط', 'ثالث متوسط',
    'أول ثانوي', 'ثاني ثانوي', 'ثالث ثانوي'
];

export const StudyMaterialView: React.FC<StudyMaterialViewProps> = ({ material, onToggleLessonComplete, onRequestFeedback, onQuizComplete, onUseFeature, initialSelectedStage, initialSelectedSemester }) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(initialSelectedStage);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(initialSelectedSemester);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  useEffect(() => {
    setSelectedStage(initialSelectedStage);
  }, [initialSelectedStage]);

  useEffect(() => {
    setSelectedSemester(initialSelectedSemester);
  }, [initialSelectedSemester]);

  const academicStagesWithStatus = useMemo(() => {
      if (!Array.isArray(material.lessons)) {
        return [];
      }
      return ORDERED_ACADEMIC_STAGES.map(stage => {
          const lessonsForStage = (material.lessons as any[]).filter(l => l && l.academicStage === stage);
          const isComingSoon = lessonsForStage.length > 0 && lessonsForStage.every(l => l && l.name && typeof l.name === 'string' && l.name.includes('(قريبًا)'));
          return { name: stage, isComingSoon };
      });
  }, [material.lessons]);
  
  const semesters = ['الفصل الأول', 'الفصل الثاني'];
  
  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };
  
  const handleBackFromLesson = () => {
    setSelectedLesson(null);
  };

  const handleUseFeatureInLesson = (feature: keyof NonNullable<Lesson['featureUsage']>) => {
    if (selectedLesson) {
        onUseFeature(material.id, selectedLesson.id, feature);
    }
  };
  
  const handleToggleLessonCompletion = (lessonId: string) => {
    onToggleLessonComplete(material.id, lessonId);
  };

  if (selectedLesson) {
    return <LessonView 
        lesson={selectedLesson} 
        onBack={handleBackFromLesson} 
        onRequestFeedback={onRequestFeedback}
        onQuizComplete={(analysis) => onQuizComplete(analysis, material.name)}
        onUseFeature={handleUseFeatureInLesson}
    />;
  }

  if (selectedStage && selectedSemester) {
    const filteredLessons = Array.isArray(material.lessons) ? material.lessons.filter(l => l && l.academicStage === selectedStage && l.semester === selectedSemester) : [];
    const groupedLessons = filteredLessons.reduce((acc, lesson) => {
      const unit = lesson.unit || 'دروس متنوعة';
      if (!acc[unit]) {
        acc[unit] = [];
      }
      acc[unit].push(lesson);
      return acc;
    }, {} as Record<string, Lesson[]>);

    const comprehensiveTests = [
      { title: "اختبارات فصلية", description: "تغطي أهم محاور الفصل الدراسي لتقييم فهمك." },
      { title: "الاختبار النهائي", description: "اختبار شامل يغطي جميع دروس الفصل الدراسي." },
      { title: "اختبار المراجعة الذكي", description: "اختبار مخصص فقط للدروس التي أكملتها." }
    ];

    const LessonRow: React.FC<{lesson: Lesson; onSelect: () => void; onToggleComplete: (lessonId: string) => void}> = ({lesson, onSelect, onToggleComplete}) => {
        const isComingSoon = lesson.name.includes('(قريبًا)');
        const usedFeatures = Object.values(lesson.featureUsage ?? {}).filter(Boolean).length;
        const progress = Math.round((usedFeatures / 5) * 100);

        const handleCheckboxClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!isComingSoon) {
              onToggleComplete(lesson.id);
            }
        };

        return (
            <div 
                onClick={isComingSoon ? undefined : onSelect}
                className={`w-full flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-teal-300 cursor-pointer'}`}
                title={isComingSoon ? 'هذه الدروس ستكون متاحة قريباً' : ''}
            >
                <div onClick={handleCheckboxClick} role="checkbox" aria-checked={lesson.completed} className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 ml-4 flex-shrink-0 ${isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer'} ${lesson.completed ? 'bg-teal-500 border-teal-500' : 'bg-white border-gray-300'}`}>
                    {lesson.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <div className="flex-grow text-right">
                    <h4 className="font-bold text-gray-800">{lesson.name}</h4>
                    {!isComingSoon && (
                      <div className="flex items-center mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 flex-grow">
                              <div className="bg-teal-500 h-1.5 rounded-full" style={{width: `${progress}%`}}></div>
                          </div>
                          <span className="text-xs text-gray-500 font-semibold mr-2">{progress}% مكتمل</span>
                      </div>
                    )}
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                    <BookOpenIcon className="w-5 h-5 text-gray-500" />
                </div>
            </div>
        )
    }
    
    const lessonGroups = Object.entries(groupedLessons) as [string, Lesson[]][];

    return (
        <div className="p-8 pb-16 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div>
                    <button 
                        onClick={() => { setSelectedStage(null); setSelectedSemester(null); }}
                        className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors mb-4"
                    >
                        → تغيير المرحلة أو الفصل الدراسي
                    </button>
                    <h1 className="text-4xl font-extrabold text-gray-800">{material.name}</h1>
                    <p className="text-gray-600 mt-2">اختر درسًا للبدء، أو تحدى نفسك باختبار شامل.</p>
                </div>
                
                <div className="my-8">
                    <a href="#" onClick={(e) => e.preventDefault()} className="block bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-teal-400 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-4 bg-red-100 text-red-600 rounded-xl ml-5 flex-shrink-0">
                                    <DocumentIcon className="w-10 h-10" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors">الكتاب الدراسي بصيغة PDF</h3>
                                    <p className="text-gray-600 font-semibold mt-1">حمّل الكتاب الدراسي</p>
                                </div>
                            </div>
                            <DownloadIcon className="w-8 h-8 text-gray-400 group-hover:text-teal-500 transition-colors" />
                        </div>
                    </a>
                </div>

                <div className="my-12">
                    <h2 className="text-2xl font-bold text-gray-800">الاختبارات الشاملة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        {comprehensiveTests.map((test, index) => (
                            <button key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-right hover:-translate-y-1.5 transition-transform duration-300 group h-full flex flex-col">
                                <div className="flex items-center mb-3">
                                    <ShieldCheckIcon className="w-7 h-7 text-green-500"/>
                                    <h3 className="text-lg font-bold text-gray-800 mr-3">{test.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed flex-grow">{test.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800">قائمة الدروس</h2>
                     <div className="space-y-6 mt-4">
                        {lessonGroups.map(([unit, lessons]) => (
                            <div key={unit}>
                                <h3 className="font-bold text-gray-600 mb-3">{unit} ({lessons.length} دروس)</h3>
                                <div className="space-y-3">
                                    {lessons.map(lesson => (
                                        <LessonRow 
                                            key={lesson.id} 
                                            lesson={lesson} 
                                            onSelect={() => handleLessonClick(lesson)}
                                            onToggleComplete={handleToggleLessonCompletion}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">اختر المرحلة والفصل الدراسي</h1>
        <p className="text-gray-600 mb-8">حدد المرحلة والفصل الدراسي لعرض الدروس المتاحة لمادة "{material.name}".</p>
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6">
          <div>
            <label htmlFor="stage-select" className="block text-right font-semibold text-gray-700 mb-2">المرحلة الدراسية</label>
            <select
              id="stage-select"
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white bg-no-repeat pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'left 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              defaultValue=""
            >
              <option value="" disabled>اختر المرحلة</option>
              {academicStagesWithStatus.map(stageInfo => (
                                <option
                                    key={stageInfo.name}
                                    value={stageInfo.name}
                                    disabled={stageInfo.isComingSoon}
                                    className={stageInfo.isComingSoon ? 'text-gray-400' : ''}
                                >
                                    {stageInfo.name} {stageInfo.isComingSoon ? '(قريبًا)' : ''}
                                </option>
                            ))}
            </select>
          </div>
           <div>
            <label htmlFor="semester-select" className="block text-right font-semibold text-gray-700 mb-2">الفصل الدراسي</label>
            <select
              id="semester-select"
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white bg-no-repeat pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'left 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              defaultValue=""
            >
              <option value="" disabled>اختر الفصل الدراسي</option>
              {semesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};