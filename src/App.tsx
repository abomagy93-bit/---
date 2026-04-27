import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Facebook, 
  Mail, 
  Play, 
  Pause, 
  ArrowUpRight,
  Radio,
  Book as BookIcon,
  MessageCircle,
  Menu,
  X,
  MapPin,
  Library,
  Twitter,
  Instagram,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';

// --- Constants & Types ---

type Language = 'ar' | 'en';

interface Book {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  image: string;
  year: string;
}

const BOOKS: Book[] = [
  {
    id: 'mathal-1',
    title: { ar: 'مثل نوره ١', en: "Parable of God's light 1" },
    description: { 
      ar: 'يستكشف أسرار النور الإلهي في التوراة والإنجيل، والطب النبوي، وقضايا الربا في منظور العلم الحديث.',
      en: 'Explores the secrets of Divine Light in the Torah and Gospel, Prophetic medicine, and modern finance.'
    },
    image: 'https://i.ibb.co/cSrXvp6d/20250126-071709.jpg',
    year: '2022'
  },
  {
    id: 'mathal-2',
    title: { ar: 'مثل نوره ٢', en: "Parable of God's light 2" },
    description: { 
      ar: 'يتعمق في خلق المسيح، النسبة الذهبية، أسرار غزة، ومواجهة الشيطان في عصر الذكاء الاصطناعي.',
      en: 'Delves into the creation of Christ, the Golden Ratio, Gaza secrets, and AI-era challenges.'
    },
    image: 'https://i.ibb.co/Y4pXxvqm/20260118-084925.png', // Swapped image
    year: '2023'
  },
  {
    id: 'mohammadim',
    title: { ar: 'محمديم', en: 'Mohammadim' },
    description: { 
      ar: 'تحليل للنبي محمد في الكتب السابقة، ومعجزات القرآن والسنة، وأساسيات التجويد بأسلوب عصري.',
      en: 'Analysis of Prophet Muhammad in ancient scriptures and modern Tajweed basics.'
    },
    image: 'https://i.ibb.co/pjSTZdWX/20260206-112809.jpg', // Swapped image
    year: '2024'
  }
];

const TRANSLATIONS = {
  ar: {
    name: 'كريم عشماوي',
    role: 'باحث ومفكر مصري • من نسل الإمام علي بن أبى طالب • مدير مالي بالمدينة المنورة',
    summary: 'باحث ومفكر مصري يمتد نسبه الشريف إلى مقام الإمام علي بن أبي طالب، يستلهم من جوار الحبيب المصطفى بالمدينة المنورة أنوار المعرفة وبصائر اليقين، باحثاً في ملكوت النص القرآني عن تجليات الهدى وكوامن الحق.',
    books: 'المكتبة',
    blog: 'المدونة',
    radio: 'إذاعة القرآن',
    radioLive: 'بث مباشر من القاهرة',
    platforms: 'المنصات الرقمية',
    contact: 'تواصل',
    scribd: 'سكريبد',
    noorBook: 'نور بوك',
    foulabook: 'فولة بوك',
    footer: 'جميع الحقوق محفوظة © ٢٠٢٤ كريم عشماوي',
    langToggle: 'English',
    visitBlog: 'تصفح المدونة',
    quranFm: 'إذاعة أهل القرآن',
    quranKareem: 'منصة القرآن الكريم',
    explore: 'استكشف المزيد',
    scrollDown: 'مرر للأسفل'
  },
  en: {
    name: 'Karim Ashmawy',
    role: 'RESEARCHER • THINKER • DESCENDANT OF IMAM ALI',
    summary: 'An Egyptian researcher and thinker, a descendant of Imam Ali bin Abi Talib, carrying the mandate of knowledge from the holy neighborhood of Medina. His work explores the divine radiance of the Quran and its cognitive paths.',
    books: 'Library',
    blog: 'The Blog',
    radio: 'Quran Radio',
    radioLive: 'Live from Cairo',
    platforms: 'Digital Platforms',
    contact: 'Contact',
    scribd: 'Scribd',
    noorBook: 'Noor Book',
    foulabook: 'Foulabook',
    footer: 'All Rights Reserved © 2024 Karim Ashmawy',
    langToggle: 'العربية',
    visitBlog: 'Explore Blog',
    quranFm: 'Ahl Al-Quran FM',
    quranKareem: 'Al-Quran Platform',
    explore: 'Explore More',
    scrollDown: 'Scroll Down'
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { scrollY } = useScroll();
  const scaleX = useSpring(useTransform(scrollY, [0, 5000], [0, 1]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const heroTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], ['-2%', '2%']);
  const heroTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], ['-2%', '2%']);
  const glowTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], ['-10%', '10%']);
  const glowTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], ['-10%', '10%']);

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    if ('mediaSession' in navigator && isPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.radio,
        artist: t.name,
        album: t.radioLive,
        artwork: [
          { src: 'https://i.ibb.co/cSrXvp6d/20250126-071709.jpg', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
    }
  }, [isPlaying, t]);

  const toggleRadio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Radio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navItems = [
    { label: t.radio, onClick: toggleRadio, icon: <Radio size={12} className={isPlaying ? "text-gold animate-pulse" : "text-gold"} /> },
    { label: t.books, href: '#library' },
    { label: t.platforms, href: '#platforms' },
    { label: t.contact, href: '#footer' }
  ];

  return (
    <div className="min-h-screen bg-matte-black text-white font-sans selection:bg-gold/40">
      
      {/* --- DIVINE GLOW BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/[0.02] blur-[200px] rounded-full" />
      </div>

      {/* --- PROGRESS BAR --- */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 px-6 lg:px-16 py-5 flex justify-between items-center mix-blend-difference">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] lg:text-xs font-black italic tracking-tighter cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[6px] group-hover:bg-white group-hover:text-black transition-all">KA</div>
          <span className="hidden sm:block uppercase tracking-[0.2em] text-[9px] font-black opacity-40 group-hover:opacity-100 transition-all">{t.name}</span>
        </motion.div>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex gap-12 items-center">
            {navItems.map((item) => (
              item.onClick ? (
                <button 
                  key={item.label}
                  onClick={item.onClick}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 cursor-pointer"
                >
                  {item.icon}
                  {item.label}
                </button>
              ) : (
                <a 
                  key={item.label}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </a>
              )
            ))}
          </div>
          
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="nav-pill"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          
          {/* Top Separated Radio Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleRadio}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isPlaying ? 'bg-gold border-gold text-black shadow-glow' : 'border-white/20 text-white/50 hover:border-gold hover:text-gold'}`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          </motion.button>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-matte-black flex flex-col items-center justify-center gap-10 text-center"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 p-4 rounded-full glass"
            >
              <X size={32} />
            </button>
            {navItems.map((item) => (
              item.onClick ? (
                <button 
                  key={item.label}
                  onClick={() => { item.onClick!(); setIsMenuOpen(false); }}
                  className="text-5xl font-black italic tracking-tighter uppercase flex items-center gap-4"
                >
                  {item.icon && React.cloneElement(item.icon as React.ReactElement, { size: 40 })}
                  {item.label}
                </button>
              ) : (
                <a 
                  key={item.label}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-black italic tracking-tighter uppercase flex items-center gap-4"
                >
                  {item.icon && React.cloneElement(item.icon as React.ReactElement, { size: 40 })}
                  {item.label}
                </a>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main onMouseMove={handleMouseMove}>
        {/* --- HERO SECTION --- */}
        <section id="home" className="relative h-[90vh] lg:h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
          {/* Background Image with Parallax & Overlay */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              style={{ 
                scale,
                x: heroTranslateX,
                y: heroTranslateY,
              }}
              className="w-full h-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop" 
                alt="Atmospheric Background" 
                className="w-full h-full object-cover lg:object-top opacity-30 grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              style={{
                x: glowTranslateX,
                y: glowTranslateY
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-gold/10 blur-[150px] rounded-full" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matte-black/60 to-matte-black" />
          </div>

          <div className="relative z-10 max-w-6xl w-full">
            <motion.div
              style={{
                x: useTransform(smoothMouseX, [-0.5, 0.5], ['-20px', '20px']),
                y: useTransform(smoothMouseY, [-0.5, 0.5], ['-20px', '20px']),
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="text-gold text-[10px] lg:text-xs font-black tracking-[0.5em] mb-4 uppercase drop-shadow-glow">
                {t.role}
              </div>
              <h1 className="hero-title mb-8 relative mt-16 lg:mt-24">
                <span className="relative z-10">{t.name}</span>
                <span className="absolute inset-0 text-white/5 blur-sm -translate-y-2 select-none pointer-events-none">{t.name}</span>
              </h1>
              <div className="w-24 h-[1px] bg-gold/30 mx-auto mb-8" />
              <p className="max-w-4xl mx-auto text-xl md:text-2xl lg:text-3xl text-white/80 font-medium leading-relaxed italic no-uppercase mb-10 drop-shadow-xl">
                {t.summary}
              </p>
              
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                <motion.a
                  href="https://Karimashmawy.blogspot.com"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(197, 160, 89, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="luxury-button relative overflow-hidden group min-w-[220px]"
                >
                  <span className="relative z-10">{t.visitBlog}</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.a>

                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(197, 160, 89, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRadio}
                  className={`relative flex items-center justify-center gap-4 px-10 py-5 rounded-full border transition-all duration-500 overflow-hidden min-w-[220px] ${isPlaying ? 'bg-gold text-black border-gold' : 'bg-transparent text-gold border-gold/30 hover:border-gold'}`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                    <span className="font-black tracking-widest text-xs uppercase">{t.radio}</span>
                  </div>
                  {isPlaying && (
                    <motion.div 
                      layoutId="radio-glow"
                      className="absolute inset-0 bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                  <audio ref={audioRef} src="https://stream.radiojar.com/8s5u5tpdtwzuv" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{t.scrollDown}</span>
            <ChevronDown size={16} className="animate-bounce" />
          </motion.div>
        </section>

        {/* --- LIBRARY SECTION --- */}
        <section id="library" className="py-32 lg:py-48 bg-zinc-950/50 backdrop-blur-sm px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-24 gap-8">
              <div className="max-w-xl flex flex-col items-center">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-[0.85]">
                  {t.books}
                </h2>
                <div className="w-16 h-1 bg-gold glow-gold mx-auto" />
              </div>
              <div className="text-white/40 text-sm md:text-base font-medium leading-relaxed max-w-sm no-uppercase italic">
                {lang === 'ar' 
                  ? 'رؤية عميقة في ماهية الوجود الإنساني والعلاقة بالخالق عبر النص القرآني.' 
                  : 'Deep exploration into human existence and the divine relationship through the Quranic text.'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
              {BOOKS.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] mb-10 overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl rounded-sm group-hover:border-gold/20 transition-colors">
                    <img 
                      src={book.image} 
                      alt={book.title[lang]} 
                      className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-matte-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-12 text-center pointer-events-none">
                      <p className="text-[10px] md:text-xs uppercase font-bold tracking-[0.2em] leading-loose text-white/90">{book.description[lang]}</p>
                    </div>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-gold shadow-glow">
                        <ArrowUpRight size={20} />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-gold tracking-[0.4em] uppercase">{book.year}</span>
                    <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase group-hover:text-gold transition-colors">{book.title[lang]}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PLATFORMS BENTO --- */}
        <section id="platforms" className="py-32 lg:py-48 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-24 text-center">
              <span className="text-gold text-[10px] lg:text-xs font-black tracking-[0.5em] uppercase mb-4 block">{t.platforms}</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase">Digital Hub</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
              {/* Main Blog Entry */}
              <motion.a 
                href="https://Karimashmawy.blogspot.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5 }}
                className="md:col-span-8 p-12 lg:p-16 rounded-[3rem] bg-stone-900 border border-white/5 flex flex-col justify-between group overflow-hidden relative shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] rounded-full animate-pulse" />
                <div className="flex justify-between items-start relative z-10 mb-20">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <BookOpen size={36} className="text-gold" />
                  </div>
                  <div className="p-4 rounded-full border border-white/10 group-hover:bg-gold group-hover:text-black transition-all">
                    <ArrowUpRight size={28} />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">{t.blog}</h3>
                  <div className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Mathal-Nuruh / Digital Research Archive</div>
                </div>
              </motion.a>

              {/* Scribd */}
              <motion.a 
                href="https://www.scribd.com/user/902001852/Karim-Ashmawy"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="md:col-span-4 p-10 rounded-[3rem] glass-dark border border-white/5 flex flex-col justify-between group"
              >
                <Library size={32} className="text-gold" />
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2 group-hover:text-gold transition-colors">{t.scribd}</h4>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Research Archive</div>
                </div>
              </motion.a>

              {/* Noor Book */}
              <motion.a 
                href="https://www.noor-book.com/%D9%83%D8%AA%D8%A8-%D9%83%D8%B1%D9%8A%D9%85-%D8%B9%D8%B4%D9%85%D8%A7%D9%88%D9%89-pdf"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="md:col-span-4 p-10 rounded-[3rem] glass-dark border border-white/5 flex flex-col justify-between group"
              >
                <BookIcon size={32} className="text-white/40 group-hover:text-gold transition-colors" />
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{t.noorBook}</h4>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Regional Library</div>
                </div>
              </motion.a>

              {/* Foulabook */}
              <motion.a 
                href="https://foulabook.com/ar/author/%D9%83%D8%AA%D8%A8-%D9%83%D8%B1%D9%8A%D9%85-%D8%B9%D8%B4%D9%85%D8%A7%D9%88%D9%8A-pdf"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="md:col-span-4 p-12 rounded-[3rem] glass-dark border border-white/5 flex flex-col justify-between group"
              >
                <BookIcon size={32} className="text-white/40 group-hover:text-gold transition-colors" />
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{t.foulabook}</h4>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Community Library</div>
                </div>
              </motion.a>

              {/* Quran Platform Integration */}
              <motion.a 
                href="https://Quran-elkareem.netlify.app"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="md:col-span-4 p-12 rounded-[3.5rem] bg-black border border-gold/30 flex flex-col justify-between group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookOpen size={40} className="text-gold" />
                <div>
                  <h4 className="text-3xl font-black italic tracking-tighter uppercase mb-3 text-white leading-tight">{t.quranKareem}</h4>
                  <div className="flex items-center gap-3 text-gold text-[10px] font-black tracking-widest uppercase">
                    Launch <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.a>

              {/* Ahl Al-Quran FM */}
              <motion.a 
                href="https://Quran-fm.netlify.app"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="md:col-span-4 p-10 rounded-[3rem] border border-gold/10 flex flex-col justify-between group bg-zinc-950/50"
              >
                <Radio size={32} className="text-gold" />
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{t.quranFm}</h4>
                  <div className="text-[10px] font-bold text-gold/40 uppercase tracking-widest">Audio Resource</div>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* --- COLLABORATION --- */}
        <section className="py-40 bg-[#060606] px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-10">
                <h3 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">{t.contact}</h3>
                <p className="text-white/40 italic leading-loose max-w-md no-uppercase text-lg">For collaboration, lectures, or intellectual inquiries, please reach out directly through official channels.</p>
                
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/profile.php?id=61584022049474" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                    <Facebook size={20} />
                  </a>
                  <a href="mailto:Karim_ashmawy@hotmail.com" className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                    <Mail size={20} />
                  </a>
                </div>
              </div>

              <div className="p-12 lg:p-16 rounded-[4rem] bg-matte-black border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full" />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 block">Official Inquiry</span>
                <span className="text-xl md:text-2xl font-bold select-all no-uppercase text-gold block mb-8">Karim_ashmawy@hotmail.com</span>
                <div className="h-[1px] w-full bg-white/5 mb-8" />
                <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={12} />
                  Cairo, Egypt
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer id="footer" className="bg-matte-black pt-40 pb-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gold/5 blur-[200px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16 mb-40">
            <div className="text-center lg:text-left rtl:lg:text-right">
              <div className="text-5xl lg:text-6xl font-black italic tracking-tighter uppercase mb-4 tracking-[-0.05em]">{t.name}</div>
              <div className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase">{t.role}</div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="hover:text-white transition-colors">{item.label}</a>
              ))}
            </div>

            <div className="flex items-center gap-3 text-white/20 text-[10px] font-bold uppercase tracking-widest italic no-uppercase">
              <MapPin size={12} />
              Cairo, Egypt
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
             <div className="text-[150px] lg:text-[25vw] font-black italic tracking-tighter opacity-[0.03] leading-[0.7] select-none text-center mix-blend-overlay">
                MATHAL <br /> NURUH
             </div>
             
             {/* VISITOR COUNTER */}
             <div className="flex flex-col items-center gap-6 py-10 px-16 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-black tracking-[0.5em] text-gold uppercase relative z-10">Live Statistics / إحصائيات مباشرة</span>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <img 
                    src="https://count.getloli.com/get/@karimashmawy_mathal?theme=asoul" 
                    alt="Visitor Counter"
                    className="h-12 opacity-90 hover:opacity-100 transition-all filter drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2">Unique Visitors Count</div>
                </div>
             </div>

             <p className="text-[9px] font-bold tracking-[0.5em] text-white/20 uppercase mt-20">{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
