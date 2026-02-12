import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function QuestionDisplay({ question, timeLimit, totalQuestions, currentQuestionIndex }) {
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        setTimeLeft(timeLimit);
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [question, timeLimit]);

    const progressPercentage = (timeLeft / timeLimit) * 100;

    const optionsConfig = [
        { color: 'bg-answerA', darkBorder: 'border-b-[#E5443D]', symbol: 'A' },
        { color: 'bg-answerB', darkBorder: 'border-b-[#1899D6]', symbol: 'B' },
        { color: 'bg-answerC', darkBorder: 'border-b-[#E5B800]', symbol: 'C' },
        { color: 'bg-answerD', darkBorder: 'border-b-[#4CAD00]', symbol: 'D' }
    ];

    // Dynamic font size based on question length
    const questionFontSize = question.text.length > 140
        ? 'clamp(0.85rem, 2.5vh, 1.25rem)'
        : question.text.length > 80
            ? 'clamp(1rem, 3vh, 1.5rem)'
            : 'clamp(1.15rem, 3.5vh, 2rem)';

    return (
        <div
            className="w-full max-w-5xl mx-auto flex flex-col"
            style={{ height: '100vh', padding: 'clamp(8px, 1.5vh, 16px) clamp(8px, 1.5vw, 16px)' }}
        >
            {/* Header: Progress & Timer */}
            <div className="flex justify-between items-center shrink-0" style={{ marginBottom: 'clamp(4px, 0.8vh, 12px)' }}>
                <div className="card-duo" style={{ padding: 'clamp(4px, 0.8vh, 10px) clamp(8px, 1.5vw, 20px)' }}>
                    <span
                        className="font-bold text-white tracking-wider font-nunito"
                        style={{ fontSize: 'clamp(0.65rem, 1.5vh, 1rem)' }}
                    >
                        DOMANDA {currentQuestionIndex} / {totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <div
                        className={`font-black font-nunito ${timeLeft <= 5 ? 'text-duo-red animate-pulse' : 'text-white'}`}
                        style={{ fontSize: 'clamp(1.25rem, 4vh, 2.5rem)' }}
                    >
                        {timeLeft}
                    </div>
                </div>
            </div>

            {/* Question Card with Background Image */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-duo relative overflow-hidden flex-grow flex flex-col min-h-0"
                style={{ marginBottom: 'clamp(4px, 0.6vh, 12px)', maxHeight: '38vh' }}
            >
                {/* Background Image Header */}
                {question.categoryImage && (
                    <>
                        <div
                            className="absolute inset-x-0 top-0 bg-cover bg-center opacity-50"
                            style={{ height: 'clamp(60px, 15vh, 160px)', backgroundImage: `url(${question.categoryImage})` }}
                        />
                        <div
                            className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary-card/10 via-primary-card/60 to-primary-card"
                            style={{ height: 'clamp(60px, 15vh, 160px)' }}
                        />
                    </>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-grow text-center overscroll-contain"
                    style={{ padding: 'clamp(8px, 1.5vh, 24px) clamp(12px, 2vw, 32px)' }}
                >
                    {question.category && (
                        <span
                            className="inline-block bg-duo-purple/20 backdrop-blur-md text-duo-purple font-bold rounded-full border border-duo-purple/30 font-nunito uppercase tracking-wider shadow-lg"
                            style={{ fontSize: 'clamp(0.55rem, 1.2vh, 0.75rem)', padding: 'clamp(2px, 0.4vh, 4px) clamp(6px, 1vw, 12px)', marginBottom: 'clamp(4px, 0.8vh, 16px)' }}
                        >
                            {question.category}
                        </span>
                    )}
                    <h2
                        className="font-black text-white leading-tight font-nunito drop-shadow-md"
                        style={{ fontSize: questionFontSize }}
                    >
                        {question.text}
                    </h2>
                </div>
            </motion.div>

            {/* Timer Bar */}
            <div
                className="w-full bg-primary-card rounded-full overflow-hidden border border-white/10 shrink-0"
                style={{ height: 'clamp(6px, 1vh, 20px)', marginBottom: 'clamp(4px, 0.6vh, 12px)' }}
            >
                <motion.div
                    className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-duo-red' : timeLeft <= 10 ? 'bg-duo-orange' : 'bg-duo-green'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 shrink-0" style={{ gap: 'clamp(4px, 0.8vh, 12px)' }}>
                {question.options.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${optionsConfig[index].color} rounded-duo flex items-center shadow-duo border-b-[3px] ${optionsConfig[index].darkBorder}`}
                        style={{ padding: 'clamp(6px, 1.2vh, 16px) clamp(6px, 1vw, 16px)' }}
                    >
                        <div className="flex items-center w-full" style={{ gap: 'clamp(6px, 1vw, 16px)' }}>
                            <div
                                className="bg-black/20 rounded-full flex items-center justify-center text-white font-black font-nunito flex-shrink-0"
                                style={{ width: 'clamp(28px, 5vh, 48px)', height: 'clamp(28px, 5vh, 48px)', fontSize: 'clamp(0.7rem, 2vh, 1.25rem)' }}
                            >
                                {optionsConfig[index].symbol}
                            </div>
                            <span
                                className="font-bold text-white font-nunito leading-tight"
                                style={{ fontSize: option.length > 40 ? 'clamp(0.65rem, 1.5vh, 1rem)' : 'clamp(0.75rem, 2vh, 1.15rem)' }}
                            >
                                {option}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default QuestionDisplay;
