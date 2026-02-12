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

    return (
        <div className="w-full max-w-6xl mx-auto p-4 flex flex-col h-screen max-h-[90vh]">
            {/* Header: Progress & Timer */}
            <div className="flex justify-between items-center mb-6">
                <div className="card-duo px-6 py-3">
                    <span className="text-lg font-bold text-white tracking-wider font-nunito">
                        DOMANDA {currentQuestionIndex} / {totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`text-5xl font-black font-nunito ${timeLeft <= 5 ? 'text-duo-red animate-pulse' : 'text-white'}`}>
                        {timeLeft}
                    </div>
                    <span className="text-lg text-white/50 font-bold uppercase font-nunito">sec</span>
                </div>
            </div>

            {/* Question Card with Background Image */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-duo relative overflow-hidden mb-6 flex-grow flex flex-col min-h-[250px]"
            >
                {/* Background Image Header */}
                {question.categoryImage && (
                    <>
                        <div
                            className="absolute inset-x-0 top-0 h-48 bg-cover bg-center opacity-50"
                            style={{ backgroundImage: `url(${question.categoryImage})` }}
                        />
                        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-card/10 via-primary-card/60 to-primary-card" />
                    </>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-8 text-center overscroll-contain">
                    {question.category && (
                        <span className="inline-block px-4 py-1 bg-duo-purple/20 backdrop-blur-md text-duo-purple text-sm font-bold rounded-full border border-duo-purple/30 font-nunito uppercase tracking-wider mb-6 shadow-lg">
                            {question.category}
                        </span>
                    )}
                    <h2 className={`
                        font-black text-white leading-tight font-nunito drop-shadow-md
                        ${question.text.length > 140 ? 'text-xl md:text-3xl' :
                            question.text.length > 80 ? 'text-2xl md:text-4xl' :
                                'text-3xl md:text-5xl'}
                    `}>
                        {question.text}
                    </h2>
                </div>
            </motion.div>

            {/* Timer Bar */}
            <div className="w-full h-6 bg-primary-card rounded-full mb-6 overflow-hidden border border-white/10">
                <motion.div
                    className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-duo-red' : timeLeft <= 10 ? 'bg-duo-orange' : 'bg-duo-green'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64 md:h-72">
                {question.options.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${optionsConfig[index].color} rounded-duo p-5 flex items-center shadow-duo border-b-4 ${optionsConfig[index].darkBorder}`}
                    >
                        <div className="flex items-center gap-5 w-full">
                            <div className="w-14 h-14 bg-black/20 rounded-full flex items-center justify-center text-2xl text-white font-black font-nunito flex-shrink-0">
                                {optionsConfig[index].symbol}
                            </div>
                            <span className={`font-bold text-white font-nunito ${option.length > 40 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
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
