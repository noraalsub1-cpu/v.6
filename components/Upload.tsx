
import React, { useState, useEffect, useRef } from 'react';
import { 
    UploadIcon, DocumentIcon, PowerpointIcon, YoutubeIcon, FileWordIcon,
    SummaryIcon, FlashcardIcon, QuizIcon, GlossaryIcon, CheckCircleIcon, FlipIcon, XCircleIcon,
    ChatIcon,
    DashboardIcon,
    LinkIcon,
    ExternalLinkIcon
} from './Icons';
import * as GeminiService from '../services/geminiService';
import type { StudyMaterial, Flashcard, QuizQuestion, GlossaryTerm, ChatMessage, QuizAnalysis, SuggestedSource } from '../types';
import { MarkdownRenderer, ChatMarkdownRenderer } from './MarkdownRenderer';

interface UploadProps {
  onUpload: (name: string, type: StudyMaterial['type'], content: string) => void;
  onRequestFeedback: (callback: () => void) => void;
  onQuizComplete: (analysis: QuizAnalysis, sourceMaterialName: string) => void;
}

type UploadState = 'idle' | 'processing' | 'processed';
type ActiveTool = 'overview' |'summary' | 'flashcards' | 'quiz' | 'glossary' | 'chat';

interface ProcessedData {
    summary: string | null;
    flashcards: Flashcard[] | null;
    quiz: QuizQuestion[];
    glossary: GlossaryTerm[] | null;
    suggestedSources: SuggestedSource[] | null;
    sourceName: string;
    sourceType: StudyMaterial['type'];
    sourceContent: string;
}

const DUMMY_CONTENT_FOR_PROCESSING = `تاريخ وتطور الذكاء الاصطناعي وتطبيقاته المعاصرة

مقدمة:
الذكاء الاصطناعي (AI) هو مجال واسع في علوم الكمبيوتر يركز على إنشاء آلات قادرة على أداء مهام تتطلب عادةً ذكاءً بشريًا. يتضمن ذلك القدرة على التعلم، والاستدلال، وحل المشكلات، والإدراك، وفهم اللغة الطبيعية. منذ بداياته النظرية في منتصف القرن العشرين، تطور الذكاء الاصطناعي ليصبح قوة تحويلية في التكنولوجيا والمجتمع.

نبذة تاريخية:
يمكن تتبع جذور الذكاء الاصطناعي إلى ورشة عمل دارتموث في عام 1956، حيث صاغ جون مكارثي مصطلح "الذكاء الاصطناعي". شهدت العقود الأولى تقدمًا في حل المشكلات الرمزية والألعاب مثل الشطرنج. ومع ذلك، واجه المجال فترات من "شتاء الذكاء الاصطناعي" بسبب نقص التمويل والقوة الحاسوبية المحدودة. شهدت الثمانينيات عودة الأنظمة الخبيرة، بينما أدى ظهور الإنترنت وزيادة البيانات والقوة الحاسوبية في التسعينيات والعقد الأول من القرن الحادي والعشرين إلى ثورة تعلم الآلة.

أنواع الذكاء الاصطناعي:
1.  الذكاء الاصطناعي الضيق (Narrow AI): هو النوع الأكثر شيوعًا اليوم، وهو مصمم لأداء مهمة محددة بكفاءة عالية، مثل المساعدين الصوتيين (Siri, Alexa) أو أنظمة التعرف على الوجه.
2.  الذكاء الاصطناعي العام (Artificial General Intelligence - AGI): هو مستوى افتراضي من الذكاء الاصطناعي يمكنه فهم أو تعلم أي مهمة فكرية يمكن للإنسان القيام بها. لا يزال تحقيق الذكاء الاصطناعي العام هدفًا بعيد المنال.
3.  الذكاء الاصطناعي الفائق (Artificial Superintelligence - ASI): هو شكل من الذكاء يتجاوز بكثير أذكى العقول البشرية في كل مجال تقريبًا.

فروع رئيسية في الذكاء الاصطناعي:
-   تعلم الآلة (Machine Learning): هو مجموعة فرعية من الذكاء الاصطناعي تركز على بناء خوارزميات يمكنها التعلم من البيانات والتنبؤ بها. يشمل التعلم الخاضع للإشراف، والتعلم غير الخاضع للإشراف، والتعلم المعزز.
-   التعلم العميق (Deep Learning): هو فرع من تعلم الآلة يستخدم الشبكات العصبية الاصطناعية متعددة الطبقات (شبكات عصبونية عميقة) لتحليل الأنماط المعقدة في كميات كبيرة من البيانات. لقد أحدث ثورة في مجالات مثل التعرف على الصور والكلام.
-   معالجة اللغة الطبيعية (Natural Language Processing - NLP): تمكن الآلات من فهم وتفسير وتوليد اللغة البشرية. تشمل تطبيقاتها الترجمة الآلية، وتحليل المشاعر، وروبوتات الدردشة.
-   رؤية الكمبيوتر (Computer Vision): تهدف إلى تمكين الآلات من "رؤية" وتفسير المعلومات المرئية من العالم، مثل الصور ومقاطع الفيديو.

تطبيقات معاصرة:
-   الرعاية الصحية: يستخدم الذكاء الاصطناعي لتحليل الصور الطبية، واكتشاف الأدوية، وتخصيص خطط العلاج.
-   التمويل: يُستخدم في كشف الاحتيال، والتداول الخوارزمي، وتقييم مخاطر الائتمان.
-   النقل: السيارات ذاتية القيادة والطائرات بدون طيار هي أمثلة بارزة على تطبيق الذكاء الاصطناعي.
-   الترفيه: أنظمة التوصية على منصات مثل Netflix و Spotify تعتمد بشكل كبير على خوارزميات الذكاء الاصطناعي.

التحديات والأخلاقيات:
يثير تطور الذكاء الاصطناعي أسئلة مهمة حول الخصوصية، والتحيز في الخوارزميات، وتأثيره على سوق العمل، والأمان. يعد تطوير ذكاء اصطناعي مسؤول وأخلاقي أحد أكبر التحديات التي تواجه الباحثين وصانعي السياسات اليوم.`;


const UploadIdleView: React.FC<{ onFileSelect: (file: File) => void; onLinkSubmit: (link: string) => void; onTrySample: () => void; }> = ({ onFileSelect, onLinkSubmit, onTrySample }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };
    
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const link = e.currentTarget.elements.namedItem('youtubeLink') as HTMLInputElement;
        if (link.value) {
            onLinkSubmit(link.value);
            link.value = '';
        }
    };

    return (
        <div className="w-full max-w-3xl text-center animate-fade-in-fast">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3">المساعد الذكي</h1>
            <p className="text-lg text-gray-600 mb-8">ارفع موادك، ودع الذكاء الاصطناعي يطلق العنان لإمكانياتك.</p>
            
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={handleFileChange} />

            <div 
                className={`p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-white hover:border-teal-400 hover:bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={handleDrop}
            >
                <UploadIcon className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">اسحب وأفلت الملفات هنا، أو انقر للاختيار</p>
                <p className="text-sm text-gray-500 mt-1">يدعم ملفات PDF, Word, PowerPoint</p>
            </div>
            
            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 font-semibold">أو</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleLinkSubmit} className="flex items-center space-x-2 space-x-reverse">
                <input
                    name="youtubeLink"
                    type="url"
                    placeholder="...الصق رابط يوتيوب هنا"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
                />
                <button type="submit" className="bg-teal-500 text-white px-6 py-4 rounded-lg hover:bg-teal-600 transition-colors shrink-0 font-semibold">تحليل</button>
            </form>
            
            <div className="mt-8">
                <p className="text-sm text-gray-500">ليس لديك ملف؟</p>
                <button onClick={onTrySample} className="mt-2 font-semibold text-teal-600 hover:text-teal-800 transition-colors">
                    جرّب مثالاً توضيحيًا
                </button>
            </div>
        </div>
    );
};


const ProcessingView: React.FC<{ progress: number }> = ({ progress }) => {
    return (
        <div className="text-center w-full max-w-md">
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
                        style={{ transition: 'stroke-dashoffset 0.15s linear' }}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-teal-600">{Math.round(progress)}%</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-6">جاري التحليل...</h2>
            <p className="text-gray-500 mt-2 mb-8">يقوم مساعدك الذكي باستخلاص النقاط الرئيسية، انتظر لحظات.</p>
        </div>
    );
};

const FlashcardsView: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleNextCard = () => {
        if (currentCardIndex < flashcards.length - 1) {
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

    if (!flashcards.length) {
        return <div className="p-4 text-center">تعذر إنشاء بطاقات المراجعة لهذا المحتوى.</div>;
    }

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
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
        <div className="p-4 pb-16 flex flex-col items-center h-full">
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

const QuizView: React.FC<{ content: string; onQuizComplete: (analysis: QuizAnalysis) => void }> = ({ content, onQuizComplete }) => {
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
        // Reset state
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
        // For short answers, we show the model answer for self-assessment and add it to the review list.
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
            <div className="p-6 flex flex-col items-center justify-center text-center h-full">
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

    if (isLoading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div></div>;
    if (!questions.length && quizState === 'active') return <p className="p-4 text-center">تعذر إنشاء اختبار لهذا المحتوى.</p>;
    
    if (quizState === 'results') {
        const totalScorableQuestions = questions.filter(q => q.type !== 'short-answer').length;
        return (
            <div className="p-6 pb-16 text-center flex flex-col items-center h-full overflow-y-auto">
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
         <div className="p-6 pb-16 flex flex-col">
            <p className="text-sm text-gray-500 mb-2">سؤال {currentQuestionIndex + 1} من {questions.length}</p>
            <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
            
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
                            <p className="text-green-700">{currentQuestion.correctAnswer}</p>
                        </div>
                    )}
                    <p className="text-teal-700 mt-1">{currentQuestion.explanation}</p>
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


const ChatView: React.FC<{ content: string }> = ({ content }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

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

        const geminiHistory = newMessages.filter(m => m.role !== 'user' || m.text.trim() !== "").map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const systemInstruction = `أنت مدرس ذكاء اصطناعي متخصص. وظيفتك هي الإجابة على أسئلة الطالب بناءً على المحتوى الدراسي المقدم فقط. كن ودودًا وواضحًا في إجاباتك. إذا كان السؤال خارج نطاق المحتوى، أجب بلطف أنك لا تملك معلومات حول ذلك. المحتوى هو:\n\n---\n${content}\n---`;
        const modelResponse = await GeminiService.chatWithTutor(geminiHistory.slice(0, -1), userInput, systemInstruction);
        setMessages([...newMessages, { role: 'model', text: modelResponse }]);
        setIsLoading(false);
    }
    
    return (
        <div className="h-full flex flex-col bg-white">
            <div ref={chatContainerRef} className="flex-grow p-4 pb-8 space-y-4 overflow-y-auto">
                {messages.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                        <ChatIcon className="w-16 h-16 mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-800">المساعد الذكي</h3>
                        <p className="mt-2 max-w-sm">أنا هنا لمساعدتك على فهم هذا المحتوى. اطرح أي سؤال يخطر ببالك!</p>
                        <div className="mt-6 text-sm text-left bg-gray-100 p-4 rounded-lg w-full max-w-sm">
                            <p className="font-semibold text-gray-600 mb-2">جرب أن تسأل:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-500">
                                <li>"اشرح لي مفهوم الذكاء الاصطناعي الضيق"</li>
                                <li>"ما هي أهم 3 تطبيقات للذكاء الاصطناعي؟"</li>
                                <li>"لخص لي التحديات الأخلاقية المذكورة"</li>
                            </ul>
                        </div>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0 text-sm font-bold">AI</div>}
                        <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            {msg.role === 'model' ? <ChatMarkdownRenderer text={msg.text} /> : <p className="whitespace-pre-wrap">{msg.text}</p>}
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
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center bg-white">
                <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="اسأل أي شيء عن هذا المحتوى..."
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

const OverviewContent: React.FC<{ data: ProcessedData, onSelectTool: (tool: ActiveTool) => void }> = ({ data, onSelectTool }) => {
    
    type OverviewCard = {
        tool: 'summary' | 'flashcards' | 'quiz' | 'glossary' | 'chat';
        icon: React.ReactNode;
        title: string;
        label: string;
        count?: number;
    };

    const overviewCards: OverviewCard[] = [
        { tool: 'summary', icon: <SummaryIcon className="w-8 h-8"/>, title: "شرح", label: "شرح شامل ومنظم للمحتوى." },
        { tool: 'flashcards', icon: <FlashcardIcon className="w-8 h-8"/>, title: "بطاقات المراجعة", count: data.flashcards?.length, label: "بطاقة للمراجعة" },
        { tool: 'quiz', icon: <QuizIcon className="w-8 h-8"/>, title: "اختبار تفاعلي", label: "اختبر فهمك للمادة." },
        { tool: 'glossary', icon: <GlossaryIcon className="w-8 h-8"/>, title: "قاموس المصطلحات", count: data.glossary?.length, label: "مصطلح هام" },
        { tool: 'chat', icon: <ChatIcon className="w-8 h-8"/>, title: "المساعد الذكي", label: "اطرح أي سؤال حول المحتوى." }
    ];

    return (
        <div className="p-8 pb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">نظرة عامة</h2>
            <p className="text-gray-600 mb-8">لقد قمنا بتحليل مادتك. استكشف الأدوات الذكية المتاحة لك.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overviewCards.map(card => (
                    <button 
                        key={card.tool} 
                        onClick={() => onSelectTool(card.tool)} 
                        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-right transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4 ml-auto">
                                {card.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                        </div>
                        <div className="mt-4">
                            {card.count !== undefined ? (
                                <div className="flex items-baseline justify-end w-full space-x-2 space-x-reverse">
                                    <span className="text-4xl font-extrabold text-teal-600">{card.count}</span>
                                    <span className="text-gray-600 text-sm pb-1">{card.label}</span>
                                </div>
                            ) : (
                                (card.tool === 'summary' && data.summary !== null) || card.tool === 'quiz' || card.tool === 'chat' ? (
                                    <p className="text-gray-600 text-sm leading-relaxed">{card.label}</p>
                                ) : (
                                     <div className="h-12 flex items-center justify-end">
                                         <div className="flex items-center space-x-1 space-x-reverse text-gray-400">
                                             <span className="text-sm mr-2">جاري الإعداد...</span>
                                             <div className="flex space-x-1 space-x-reverse">
                                                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.2s]"></span>
                                                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.1s]"></span>
                                                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse"></span>
                                             </div>
                                         </div>
                                    </div>
                                )
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};


const ProcessedView: React.FC<{ data: ProcessedData; onReset: () => void; onQuizComplete: (analysis: QuizAnalysis, sourceMaterialName: string) => void; }> = ({ data, onReset, onQuizComplete }) => {
    const [activeTool, setActiveTool] = useState<ActiveTool>('overview');

    const ToolButton: React.FC<{ tool: ActiveTool; label: string; icon: React.ReactNode; isLoading: boolean; }> = ({ tool, label, icon, isLoading }) => (
        <button
          onClick={() => setActiveTool(tool)}
          className={`flex items-center justify-between w-full px-4 py-3 text-right text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 rounded-lg ${activeTool === tool ? 'bg-teal-100 text-teal-800 font-bold' : ''}`}
        >
          <div className="flex items-center">
            {icon}
            <span>{label}</span>
          </div>
          {isLoading && (
            <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
      );
    
    const renderContent = () => {
        const ToolLoadingView: React.FC<{ title: string }> = ({ title }) => (
            <div className="flex flex-col justify-center items-center h-full text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                <h2 className="text-xl font-bold text-gray-800">جاري إعداد {title}...</h2>
                <p className="text-gray-500 mt-2">قد يستغرق هذا بضع لحظات.</p>
            </div>
        );

        switch(activeTool) {
            case 'overview': return <OverviewContent data={data} onSelectTool={setActiveTool} />;
            case 'summary': 
                if (data.summary === null) return <ToolLoadingView title="الشرح" />;
                return (
                    <div className="p-8 pb-16">
                        <MarkdownRenderer text={data.summary} />
                        {data.suggestedSources && data.suggestedSources.length > 0 && (
                            <div className="mt-10 pt-8 border-t-2 border-gray-200">
                                <div className="flex items-center mb-6">
                                    <LinkIcon className="w-7 h-7 text-teal-500" />
                                    <h3 className="text-2xl font-bold text-gray-800 mr-3">مصادر مقترحة للاستزادة</h3>
                                </div>
                                <div className="space-y-4">
                                    {data.suggestedSources.map(source => (
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
            case 'flashcards': 
                if(data.flashcards === null) return <ToolLoadingView title="بطاقات المراجعة" />;
                return <FlashcardsView flashcards={data.flashcards} />;
            case 'quiz': return <QuizView content={data.sourceContent} onQuizComplete={(analysis) => onQuizComplete(analysis, data.sourceName)} />;
            case 'glossary': 
                if (data.glossary === null) return <ToolLoadingView title="قاموس المصطلحات" />;
                return (
                 <div className="p-6 pb-16 space-y-4">
                    <h2 className="text-xl font-bold mb-2">قاموس المصطلحات</h2>
                     {data.glossary.map(item => (
                        <div key={item.id} className="p-4 bg-white rounded-lg border border-gray-200">
                            <h3 className="font-bold text-teal-700">{item.term}</h3>
                            <p className="mt-1 text-gray-600">{item.definition}</p>
                        </div>
                    ))}
                </div>
            );
            case 'chat': return <ChatView content={data.sourceContent} />;
            default: return null;
        }
    };
    
    return (
        <div className="w-full h-full flex flex-row-reverse bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="w-1/3 max-w-xs border-l border-gray-200 p-4 flex flex-col bg-white">
                <h2 className="text-xl font-bold mb-4">الأدوات الذكية</h2>
                <nav className="flex flex-col space-y-1 flex-grow">
                    <ToolButton tool="overview" label="نظرة عامة" icon={<DashboardIcon className="w-5 h-5 ml-3" />} isLoading={false}/>
                     <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase">الأدوات</h3>
                    </div>
                    <ToolButton tool="summary" label="شرح" icon={<SummaryIcon className="w-5 h-5 ml-3"/>} isLoading={data.summary === null} />
                    <ToolButton tool="flashcards" label="بطاقات المراجعة" icon={<FlashcardIcon className="w-5 h-5 ml-3"/>} isLoading={data.flashcards === null}/>
                    <ToolButton tool="quiz" label="اختبار" icon={<QuizIcon className="w-5 h-5 ml-3"/>} isLoading={false}/>
                    <ToolButton tool="glossary" label="قاموس المصطلحات" icon={<GlossaryIcon className="w-5 h-5 ml-3"/>} isLoading={data.glossary === null} />
                    <ToolButton tool="chat" label="المساعد الذكي" icon={<ChatIcon className="w-5 h-5 ml-3"/>} isLoading={false} />
                </nav>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-lg truncate text-gray-700">{data.sourceName}</h3>
                    <button onClick={onReset} className="text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">
                        تحليل ملف آخر
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
};


export const Upload: React.FC<UploadProps> = ({ onUpload, onRequestFeedback, onQuizComplete }) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  const startProcessing = (name: string, type: StudyMaterial['type'], content: string) => {
    setUploadState('processing');
    setProgress(0);

    const interval = setInterval(() => {
        setProgress(p => {
            const newProgress = p + 20;
            if (newProgress >= 100) {
                clearInterval(interval);
                
                const initialData: ProcessedData = {
                    sourceName: name,
                    sourceType: type,
                    sourceContent: content,
                    summary: null,
                    flashcards: null,
                    glossary: null,
                    suggestedSources: null,
                    quiz: [],
                };
                setProcessedData(initialData);
                setUploadState('processed');
        
                // Fire off all Gemini API calls in the background.
                GeminiService.generateSummary(content).then(summary => {
                    setProcessedData(prev => prev ? { ...prev, summary } : null);
                });
                GeminiService.generateSuggestedSources(content).then(sources => {
                    setProcessedData(prev => prev ? { ...prev, suggestedSources: sources.map((s, i) => ({...s, id: `source-${i}`})) } : null);
                });
                GeminiService.generateFlashcards(content).then(flashcards => {
                    setProcessedData(prev => prev ? { ...prev, flashcards: flashcards.map((f, i) => ({ ...f, id: `fc-${i}` })) } : null);
                });
                GeminiService.generateGlossary(content).then(glossary => {
                    setProcessedData(prev => prev ? { ...prev, glossary: glossary.map((g, i) => ({ ...g, id: `glossary-${i}` })) } : null);
                });

                return 100;
            }
            return newProgress;
        });
    }, 30);
  };
  
  const handleTrySample = () => {
    startProcessing(`شرح مفاهيم الذكاء الاصطناعي`, 'pdf', DUMMY_CONTENT_FOR_PROCESSING);
  };

  const handleFileSelect = (file: File) => {
    const typeMap = {
        'application/pdf': 'pdf',
        'application/vnd.ms-powerpoint': 'powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'powerpoint',
        'application/msword': 'word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
    };
    const fileType = (typeMap as Record<string, StudyMaterial['type']>)[file.type];
    if(fileType) {
        startProcessing(file.name, fileType, DUMMY_CONTENT_FOR_PROCESSING);
    } else {
        alert('نوع الملف غير مدعوم.');
    }
  };

  const handleLinkSubmit = (link: string) => {
    startProcessing(`شرح مفاهيم الذكاء الاصطناعي من يوتيوب`, 'youtube', DUMMY_CONTENT_FOR_PROCESSING);
  };

  const handleReset = () => {
    const resetLogic = () => {
        setUploadState('idle');
        setProcessedData(null);
        setProgress(0);
    };
    onRequestFeedback(resetLogic);
  };

  return (
    <div className="p-8 h-full flex items-center justify-center bg-gray-50">
      {uploadState === 'idle' && <UploadIdleView onFileSelect={handleFileSelect} onLinkSubmit={handleLinkSubmit} onTrySample={handleTrySample} />}
      {uploadState === 'processing' && <ProcessingView progress={progress} />}
      {uploadState === 'processed' && processedData && <ProcessedView data={processedData} onReset={handleReset} onQuizComplete={onQuizComplete} />}
    </div>
  );
};