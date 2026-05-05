import React from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { FileText, Download, CheckCircle2, MessageSquare, Briefcase, HelpCircle, ChevronRight, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const commonQuestions = [
    {
        id: 1,
        question: "Can you tell me a little about yourself?",
        guidance: "Walk them through your background, starting at how you began your career or your current line of work. Take them through key accomplishments, key career moves you’ve made, and end by sharing what you’re looking to do next in your career and why you’re job hunting.",
        sample: "I started my career in Marketing after graduating with a Business degree in 2011. I’ve spent my entire career at Google, receiving 3 promotions and 4 awards for outstanding performance. I’m looking to join a smaller company now, and take on more leadership and project management."
    },
    {
        id: 2,
        question: "How did you hear about the position?",
        guidance: "This is one of the simplest question and answer scenarios in any interview, but that doesn’t mean it can’t ruin your chances at the job if you answer incorrectly.",
        sample: "I saw the job posted on a website, and the position seemed interesting so I wanted to learn more. / Your company was recommended to me by somebody I worked with in a previous job."
    },
    {
        id: 3,
        question: "What do you know about our company?",
        guidance: "Our primary goal is to show we’ve done our research or knew about their company before applying. If you don’t seem like you know anything about them, you’ll come across as desperate.",
        sample: "From what I read, your company is one of the leaders in providing security software to other businesses. I read the list of clients on your website. Do you mostly serve Fortune 500 clients? I saw a couple big Fortune 500 companies mentioned on the list, including ... and ... ."
    },
    {
        id: 4,
        question: "Why did you apply for this position?",
        guidance: "You need to sound like you want the RIGHT job and that you’re being picky. Companies want the best performers, and the best performers are picky. Stay away from negatives and complaints.",
        sample: "I’ve heard great things about the work environment here. When I saw this job posting, it matched my skills very closely. For example, I saw you need somebody who’s an expert in mySQL programming, which was the focus of my previous positions."
    },
    {
        id: 5,
        question: "Why should we hire you?",
        guidance: "Try to talk about them and how you’ll help them. What will be better for them if they hire you? What will you improve for them? Show you've done your research.",
        sample: "I read on the job description that you’re looking for someone with experience in software programming. I’ve done that for 3 years and can immediately help you accomplish software programming."
    },
    {
        id: 6,
        question: "Why are you looking to leave your current company?",
        guidance: "If you chose to leave on your own terms, stay positive and focus on what you wanted to gain from the decision, rather than bad-mouthing.",
        sample: "I was hired for a project management role, but over time that changed. I left to pursue an opportunity that I felt was more aligned with what I’ve chosen to focus on in my career."
    },
    {
        id: 7,
        question: "What are your greatest professional strengths?",
        guidance: "Choose 1 to 3 attributes that position you as qualified for the job and a good fit for the company. Use specific examples from past experiences.",
        sample: "I think some of my greatest strengths are my communication skills and willingness to take initiative. During my last internship, I took the initiative to send out a weekly email to keep the team up to date, which was later incorporated into a full-time responsibility."
    },
    {
        id: 8,
        question: "Tell me about a challenge or conflict you've faced at work, and how you dealt with it.",
        guidance: "Focus on a specific work-related challenge. Talk about how you overcame obstacles, used it as a learning experience, and ended with a positive result.",
        sample: "In my last job, we were facing a tough deadline while my boss was out. I took the lead, delegated tasks to four team members based on their strengths, and re-organized my own tasks. We delivered on time."
    },
    {
        id: 9,
        question: "How much money are you looking to earn?",
        guidance: "Stand your ground and tell them you don’t have a number in mind yet. Focus on finding the right fit first.",
        sample: "Right now I’m focused on finding a job that’s the right fit for my career. Once I’ve done that, I’m willing to consider an offer you feel is fair, but I do not have a specific number in mind yet."
    },
    {
        id: 10,
        question: "Why do you want to work here?",
        guidance: "Show them that you know what their job involves and that you’re excited to be interviewing for this position.",
        sample: "I’m interested in intensive care and I’ve seen your hospital mentioned as having one of the best ER’s in the region. The job description matched well with my background in fast-paced environments."
    },
    {
        id: 11,
        question: "What is your dream job?",
        guidance: "Approach this as the intersection of your skills, interests, and values. Talking about skills sells you, interests show investment, and values illustrate fit.",
        sample: "Based on my skills and interests, in my dream job, I would want to continue honing my skills in software architecture, ideally in a company where I could mentor junior devs and drive innovative projects."
    },
    {
        id: 12,
        question: "Why did you leave your last job?",
        guidance: "Stay positive. Focus on what you wanted to gain (advancement, new environment, alignment with career goals) rather than negatives of the previous role.",
        sample: "I had been with the organization for a number of years and wanted to experience a new environment to continue growing. I left for an opportunity to advance my career."
    },
    {
        id: 13,
        question: "What other companies are you interviewing with?",
        guidance: "They want to gauge competition and your seriousness. Be honest but emphasize why THIS role is your priority.",
        sample: "I’m interviewing with a few companies for a range of positions, but so far it seems that this role will really allow me to focus all of my energy on customer experience, which I find very appealing."
    },
    {
        id: 14,
        question: "What is your greatest weakness?",
        guidance: "Pick a specific skill that won't severely impact your ability to do this job, and show how you're actively working to improve it.",
        sample: "I'm not particularly strong in social media marketing. I focused entirely on email marketing. I've realized it's helpful to understand the principles, so I've started spending a couple hours a week studying this new area."
    },
    {
        id: 15,
        question: "What type of work environment do you prefer?",
        guidance: "Describe an environment similar to the company you're applying to. Be specific about culture and team dynamics.",
        sample: "I thrive in a fast-paced, collaborative environment where open communication is encouraged and there's a strong focus on team goals."
    },
    {
        id: 16,
        question: "What's a time you disagreed with a decision made at work?",
        guidance: "Show that you can handle conflict professionally. Demonstrate that you back up your hesitations with data and remain respectful.",
        sample: "I learned early on that it’s fine to disagree if you can back up your hunches with data. In my last role, I shared hesitations about a campaign, and once numbers came in, we were able to pivot effectively."
    },
    {
        id: 17,
        question: "Where do you see yourself in 5 years?",
        guidance: "Share a goal related to the type of job you're interviewing for. Make it slightly challenging and ambitious.",
        sample: "In five years I see myself taking on more responsibilities, either through management or higher level individual contributions. My goal now is to build a strong foundation here."
    },
    {
        id: 18,
        question: "Can you explain why you changed career paths?",
        guidance: "Manage the message confidently. Speak directly to your target audience and explain the jump in a way that makes your new direction look like a logical progression.",
        sample: "After a significant corporate restructure, I decided to angle my messaging to reflect what I'm trying to achieve. I'm committed to this new role and ready to deliver."
    },
    {
        id: 19,
        question: "Tell Me About a Time You Failed",
        guidance: "Show that you learn from mistakes and bounce back. Turn a past failure into a future success by explaining the lesson learned.",
        sample: "I failed to lead properly when I confronted an employee in public. I learned that such discussions should occur in private. From that point onward, I am always conscious of this, which made me a better leader."
    },
    {
        id: 20,
        question: "How would our boss and co-workers describe you?",
        guidance: "This is your chance to use the positive feedback you've received in the past to talk about your strengths.",
        sample: "My direct supervisor described me as someone who takes initiative and doesn’t shy away from hard problems. My colleagues would describe me as logical, organized, and meticulous."
    },
    {
        id: 21,
        question: "How do you deal with pressure or stressful situations?",
        guidance: "Talk through your go-to stress-reduction tactics and share an example of a stressful situation you navigated effectively.",
        sample: "I use stress-reduction tactics like creating a detailed to-do list. In a past role, I navigated a high-pressure launch by staying focused on priorities and communicating clearly with my team."
    },
    {
        id: 22,
        question: "If you were an animal, which one would you want to be?",
        guidance: "This is a personality test. There's no wrong answer, but use it to show your strengths or personality. Answer enthusiastically.",
        sample: "I think I would have to say a Dolphin, because they are known for their communication skills and collaborative nature, which reflects my work style."
    },
    {
        id: 23,
        question: "What do you think we could do better or differently?",
        guidance: "Show that you've used the product and have ideas for improvement. Convey passion for the company's value creation.",
        sample: "I’ve used your product and I'm excited about the possibility of building new features like ... which I think could help increase conversions and user engagement."
    },
    {
        id: 24,
        question: "Are you planning on having children?",
        guidance: "Family status questions are technically illegal. Gracefully avoid the personal part and turn the conversation back to your job-related strengths.",
        sample: "You know, I’m not quite there yet. But I am very interested in the career paths at your company. Can you tell me more about that?"
    },
    {
        id: 25,
        question: "What do you like to do outside of work?",
        guidance: "Keep it semi-professional. Share what makes you tick and show that you're well-rounded. Research the company culture to align your hobbies.",
        sample: "I enjoy volunteering at local shelters and practicing photography. It helps me stay connected to the community and keep my creative skills sharp."
    },
    {
        id: 26,
        question: "What are your salary requirements?",
        guidance: "Stand your ground. Focus on finding the right fit first. Don't go too low or too high too early.",
        sample: "Right now I’m focused on finding a job that’s the right fit for my career. Once I’ve done that, I’m willing to consider an offer you feel is fair."
    },
    {
        id: 27,
        question: "Do you have any questions for us?",
        guidance: "Ask good questions about the role, the team, or the company. Avoid asking about salary or benefits until an offer is on the table.",
        sample: "Yes, I have a couple of questions. Is this a newly-created position? And what did the previous person in this role go on to do?"
    }
];

const CommonInterviewQuestions = () => {
    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300'>
            <Navbar />
            
            <main className='max-w-5xl mx-auto px-6 py-16'>
                <div className='flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6'>
                    <div className='max-w-2xl'>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6'
                        >
                            <Star size={14} className='text-amber-500' />
                            <span className='text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]'>Essential Guide</span>
                        </motion.div>
                        <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight'>
                            The <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600'>Interview Bible</span>
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 text-lg leading-relaxed'>
                            Master the 27 most critical questions asked in professional interviews. Learn the strategy behind each question and perfect your response.
                        </p>
                    </div>
                    <Button 
                        onClick={handleDownloadPDF}
                        className='bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white rounded-2xl px-8 py-7 flex items-center gap-3 font-bold shadow-xl shadow-zinc-500/10 print:hidden'
                    >
                        <Download size={20} />
                        Save as PDF
                    </Button>
                </div>

                <div className='space-y-12'>
                    {commonQuestions.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className='group bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 relative overflow-hidden'
                        >
                            <div className='absolute top-0 right-0 p-8 text-8xl font-black text-gray-50 dark:text-zinc-800/50 -z-0 pointer-events-none group-hover:text-amber-500/10 transition-colors'>
                                {item.id < 10 ? `0${item.id}` : item.id}
                            </div>

                            <div className='relative z-10'>
                                <div className='flex items-center gap-4 mb-8'>
                                    <div className='w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600'>
                                        <HelpCircle size={24} />
                                    </div>
                                    <h2 className='text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight max-w-xl'>
                                        {item.question}
                                    </h2>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-2 text-amber-600'>
                                            <Briefcase size={16} />
                                            <span className='text-[10px] font-black uppercase tracking-[0.2em]'>The Strategy</span>
                                        </div>
                                        <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm'>
                                            {item.guidance}
                                        </p>
                                    </div>

                                    <div className='bg-gray-50 dark:bg-zinc-800/50 rounded-3xl p-6 md:p-8 space-y-4 border border-gray-100 dark:border-zinc-700/50'>
                                        <div className='flex items-center gap-2 text-emerald-600'>
                                            <CheckCircle2 size={16} />
                                            <span className='text-[10px] font-black uppercase tracking-[0.2em]'>Sample Answer</span>
                                        </div>
                                        <p className='text-gray-900 dark:text-gray-200 leading-relaxed italic text-sm'>
                                            "{item.sample}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className='mt-24 text-center bg-zinc-900 dark:bg-zinc-800 rounded-[48px] p-16 relative overflow-hidden print:hidden'>
                    <div className='absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full'></div>
                    <div className='relative z-10'>
                        <h2 className='text-3xl font-black text-white mb-4'>Ready to Ace Your Interview?</h2>
                        <p className='text-zinc-400 mb-10 max-w-lg mx-auto'>Apply these strategies to real company questions in our interactive practice mode.</p>
                        <Button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className='bg-amber-500 hover:bg-amber-600 text-black px-10 py-7 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105'
                        >
                            Back to Top
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CommonInterviewQuestions;
