
import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, QuizQuestion, GlossaryTerm, QuizAnalysis, ChatMessage, LessonSolution, SuggestedSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// Helper function to handle JSON parsing safely
const parseJson = <T>(jsonString: string, defaultValue: T): T => {
    try {
        // Clean the string from markdown code block syntax
        const cleanedString = jsonString.replace(/^```json\s*|```$/g, '').trim();
        return JSON.parse(cleanedString);
    } catch (error) {
        console.error("Failed to parse JSON:", error, "Raw string:", jsonString);
        return defaultValue;
    }
};

export const generateSummary = async (content: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `اشرح المحتوى التالي بشكل شامل وواضح كنقاط رئيسية. استخدم تنسيق ماركداون مع عناوين ونقاط لتنظيم الشرح:\n\n---\n${content}\n---`,
            config: {
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "عذرًا، حدث خطأ أثناء إنشاء الشرح.";
    }
};

export const generateFlashcards = async (content: string): Promise<Omit<Flashcard, 'id'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `استخرج من المحتوى التالي أسئلة وأجوبة مناسبة لبطاقات المراجعة (flashcards). قدم الإجابات بصيغة JSON على شكل مصفوفة من الكائنات، كل كائن يحتوي على 'question' و 'answer'. قم بتوليد 5 إلى 10 بطاقات.\n\nالمحتوى:\n${content}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING },
                        },
                        required: ['question', 'answer'],
                    },
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return parseJson(response.text, []);
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return [];
    }
};

export const generateQuiz = async (content: string, difficulty: 'متوسط' | 'متقدم' = 'متوسط', numQuestions: number = 5): Promise<Omit<QuizQuestion, 'id'>[]> => {
     try {
        const response = await ai.models.generateContent({
            model,
            contents: `بناءً على المحتوى التالي، قم بإنشاء اختبار من ${numQuestions} أسئلة بمستوى صعوبة '${difficulty}'. يجب أن يتضمن الاختبار مزيجًا متنوعًا من أنواع الأسئلة: 'multiple-choice' (اختيار من متعدد)، 'true-false' (صواب أو خطأ)، و 'short-answer' (إجابة قصيرة). لكل سؤال، قدم الخصائص التالية: 'question' (نص السؤال)، 'type' (نوع السؤال)، 'options' (مصفوفة من 4 خيارات لـ 'multiple-choice'، أو ['صواب', 'خطأ'] لـ 'true-false'، أو مصفوفة فارغة لـ 'short-answer')، 'correctAnswer' (الإجابة الصحيحة)، 'explanation' (شرح للإجابة)، و 'sourceLesson' (اسم الدرس المأخوذ منه السؤال، استخلصه من العناوين المرفقة في المحتوى مثل "عنوان الدرس: ...". إذا لم يكن هناك عنوان درس واضح، استخدم سلسلة نصية فارغة). قدم الإجابات بصيغة JSON على شكل مصفوفة من الكائنات.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['multiple-choice', 'true-false', 'short-answer'] },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                            sourceLesson: { type: Type.STRING },
                        },
                        required: ['question', 'type', 'options', 'correctAnswer', 'explanation', 'sourceLesson'],
                    },
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        const quizData = parseJson<Omit<QuizQuestion, 'id'>[]>(response.text, []);
        // Ensure true-false options are consistent for easier rendering
        return quizData.map(q => {
            if (q.type === 'true-false') {
                return { ...q, options: ['صواب', 'خطأ'] };
            }
            return q;
        });
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};

export const generateGlossary = async (content: string): Promise<Omit<GlossaryTerm, 'id'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `قم بإنشاء قاموس للمصطلحات الهامة من المحتوى التالي. لكل مصطلح، قدم تعريفًا واضحًا. قدم الإجابات بصيغة JSON على شكل مصفوفة من الكائنات، كل كائن يحتوي على 'term' و 'definition'.\n\nالمحتوى:\n${content}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            term: { type: Type.STRING },
                            definition: { type: Type.STRING },
                        },
                        required: ['term', 'definition'],
                    },
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return parseJson(response.text, []);
    } catch (error) {
        console.error("Error generating glossary:", error);
        return [];
    }
};

export const analyzeIncorrectAnswers = async (content: string, incorrectQuestions: QuizQuestion[]): Promise<QuizAnalysis> => {
    try {
        const incorrectQuestionsText = incorrectQuestions
            .map(q => `- السؤال: ${q.question}\n- الإجابة الصحيحة: ${q.correctAnswer}`)
            .join('\n');
        
        const response = await ai.models.generateContent({
            model,
            contents: `بناءً على المحتوى الأصلي والإجابات الخاطئة التالية، حدد أهم 2-3 مواضيع رئيسية يعاني فيها المستخدم من ضعف. قدم الإجابات بصيغة JSON تحتوي على كائن واحد به مفتاح 'main_topics_of_weakness' وقيمته مصفوفة من السلاسل النصية التي تمثل المواضيع.\n\nالمحتوى الأصلي:\n${content}\n\nالأسئلة التي تمت الإجابة عليها بشكل خاطئ:\n${incorrectQuestionsText}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        main_topics_of_weakness: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ['main_topics_of_weakness'],
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return parseJson(response.text, { main_topics_of_weakness: [] });
    } catch (error) {
        console.error("Error analyzing quiz results:", error);
        return { main_topics_of_weakness: [] };
    }
};

export const chatWithTutor = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const contents = [...history, { role: 'user', parts: [{ text: newMessage }] }];
        
        const response = await ai.models.generateContent({
            model,
            // @ts-ignore
            contents,
            config: {
                systemInstruction: systemInstruction,
                thinkingConfig: { thinkingBudget: 0 },
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error with chat tutor:", error);
        return "عذرًا، واجهت صعوبة في معالجة طلبك. يرجى المحاولة مرة أخرى.";
    }
};

export const generateLessonSolutions = async (content: string): Promise<Omit<LessonSolution, 'id'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `بناءً على محتوى الدرس التالي، استخرج الأسئلة أو التمارين الموجودة فيه وقدم حلولاً نموذجية ومفصلة لكل منها. قدم الإجابات بصيغة JSON على شكل مصفوفة من الكائنات، كل كائن يحتوي على 'question' (نص السؤال) و 'solution' (نص الحل المفصل).\n\nالمحتوى:\n${content}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            solution: { type: Type.STRING },
                        },
                        required: ['question', 'solution'],
                    },
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return parseJson(response.text, []);
    } catch (error) {
        console.error("Error generating lesson solutions:", error);
        return [];
    }
};

export const generateSuggestedSources = async (content: string): Promise<Omit<SuggestedSource, 'id'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `بناءً على المحتوى التالي، اقترح 3-5 مصادر خارجية (مقالات، فيديوهات، كتب) تساعد على فهم أعمق للموضوع. قدم النتائج بصيغة JSON على شكل مصفوفة من الكائنات، كل كائن يحتوي على 'title', 'url', و 'type' (يجب أن يكون 'article', 'video', أو 'book').\n\nالمحتوى:\n${content}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['article', 'video', 'book'] },
                        },
                        required: ['title', 'url', 'type'],
                    },
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return parseJson(response.text, []);
    } catch (error) {
        console.error("Error generating suggested sources:", error);
        return [];
    }
};

export const generateStandardizedTestQuestion = async (
    subject: string, 
    skill: string, 
    difficulty: 'متوسط' | 'صعب' | 'متقدم' = 'متوسط'
): Promise<Omit<QuizQuestion, 'id'> | null> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `أنت خبير في إعداد أسئلة الاختبارات المعيارية السعودية. قم بإنشاء سؤال واحد فقط لا غير، بنمط اختيار من متعدد مع 4 خيارات، لاختبار: ${subject}.
            يجب أن يركز السؤال على المهارة المحددة التالية: ${skill}.
            مستوى الصعوبة المطلوب هو: ${difficulty}.

            يجب أن يكون الناتج بصيغة JSON لكائن واحد فقط, وليس مصفوفة. الكائن يجب أن يحتوي على الخصائص التالية:
            - "question": نص السؤال.
            - "type": يجب أن تكون القيمة "multiple-choice".
            - "options": مصفوفة تحتوي على 4 سلاسل نصية تمثل الخيارات.
            - "correctAnswer": سلسلة نصية تحتوي على الإجابة الصحيحة بالضبط كما هي في مصفوفة الخيارات.
            - "explanation": شرح مفصل وواضح للإجابة الصحيحة وسبب خطأ الخيارات الأخرى.
            - "sourceLesson": يجب أن تكون قيمته هي المهارة المحددة (${skill}).
            
            لا تقم بتضمين أي نص إضافي أو علامات markdown حول كائن JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['multiple-choice'] },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        sourceLesson: { type: Type.STRING },
                    },
                    required: ['question', 'type', 'options', 'correctAnswer', 'explanation', 'sourceLesson'],
                },
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        return parseJson(response.text, null);
    } catch (error) {
        console.error("Error generating standardized test question:", error);
        return null;
    }
};