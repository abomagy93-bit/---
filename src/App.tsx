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
  Menu,
  X,
  MapPin,
  Library,
  ChevronLeft,
  ChevronRight,
  Youtube,
  ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';

// --- Constants & Types ---

type Language = 'ar' | 'en';

interface Book {
  id: string;
  title: Record<Language, string>;
  image: string;
  year: string;
}

interface ImagePreview {
  url: string;
  title: string;
  year?: string;
  alt: string;
}

const BOOKS: Book[] = [
  {
    id: 'mathal-1',
    title: { ar: 'مثل نوره ١', en: "Parable of God's Light 1" },
    image: 'https://i.ibb.co/cSrXvp6d/20250126-071709.jpg',
    year: '2022'
  },
  {
    id: 'mathal-2',
    title: { ar: 'مثل نوره ٢', en: "Parable of God's Light 2" },
    image: 'https://i.ibb.co/Y4pXxvqm/20260118-084925.png',
    year: '2023'
  },
  {
    id: 'mohammadim',
    title: { ar: 'محمديم', en: 'Mohammadim' },
    image: 'https://i.ibb.co/pjSTZdWX/20260206-112809.jpg',
    year: '2024'
  },
  {
    id: 'asrar-almihrab',
    title: { ar: 'أسرار المحراب', en: 'Secrets of Al-Mihrab' },
    image: 'https://i.ibb.co/bjM3gzHk/1787404945252.jpg',
    year: '2025'
  },
  {
    id: 'qissat-tarawm-almasihiyya',
    title: { ar: 'قصة تروم المسيحية', en: 'The Christianization of Rome' },
    image: 'https://i.postimg.cc/Jn9XzndW/file-0000000068e081f48540c5d6af7cc991.png',
    year: '2025'
  }
];

const TRANSLATIONS = {
  ar: {
    name: 'كريم عشماوي',
    role: 'مفكر وباحث حر • العلم والإيمان • المدينة المنورة',
    summary: 'مفكر وباحث حر ، خواطر وتأملات عصرية للقرآن والسنة النبوية، العلم والإيمان. يستلهم أبحاثه من جوار الحبيب المصطفى بالمدينة المنورة، رابطاً بين بصائر اليقين ومعطيات العصر.',
    books: 'المكتبة',
    blog: 'المدونة',
    radio: 'إذاعة القرآن',
    radioLive: 'بث مباشر من القاهرة',
    platforms: 'المنصات الرقمية',
    contact: 'تواصل',
    scribd: 'سكريبد',
    ktobati: 'كتوباتي',
    noorBook: 'نور بوك',
    foulabook: 'فولة بوك',
    footer: 'جميع الحقوق محفوظة © ٢٠٢٤ كريم عشماوي',
    langToggle: 'English',
    visitBlog: 'تصفح المدونة',
    quranFm: 'إذاعة أهل القرآن',
    quranKareem: 'منصة القرآن الكريم',
    explore: 'استكشف المزيد',
    scrollDown: 'مرر للأسفل',
    playlist: 'محاضرات مرئية',
    close: 'إغلاق',
    enlargeHint: 'انقر لتكبير الصورة'
  },
  en: {
    name: 'Karim Ashmawy',
    role: 'INDEPENDENT THINKER • RESEARCHER • SCIENCE & FAITH',
    summary: 'Independent thinker and researcher. Modern reflections on the Quran, Sunnah, science, and faith. Inspired by the holy neighborhood of Medina, bridging spiritual insights with contemporary knowledge.',
    books: 'Library',
    blog: 'The Blog',
    radio: 'Quran Radio',
    radioLive: 'Live from Cairo',
    platforms: 'Digital Platforms',
    contact: 'Contact',
    scribd: 'Scribd',
    ktobati: 'Ktobati',
    noorBook: 'Noor Book',
    foulabook: 'Foulabook',
    footer: 'All Rights Reserved © 2024 Karim Ashmawy',
    langToggle: 'العربية',
    visitBlog: 'Explore Blog',
    quranFm: 'Ahl Al-Quran FM',
    quranKareem: 'Al-Quran Platform',
    explore: 'Explore More',
    scrollDown: 'Scroll Down',
    playlist: 'Video Lectures',
    close: 'Close',
    enlargeHint: 'Click to enlarge image'
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<ImagePreview | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const libraryScrollRef = useRef<HTMLDivElement | null>(null);
  
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

  // Handle ESC key for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePreview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const scrollLibrary = (direction: 'left' | 'right') => {
    if (libraryScrollRef.current) {
      const scrollAmount = isRtl ? (direction === 'left' ? 280 : -280) : (direction === 'left' ? -280 : 280);
      libraryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: t.radio, onClick: toggleRadio, icon: <Radio size={12} className={isPlaying ? "text-gold animate-pulse" : "text-gold"} /> },
    { label: t.books, href: '#library' },
    { label: t.playlist, href: '#lectures' },
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
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 lg:px-16 py-3 lg:py-4 flex justify-between items-center bg-black/75 backdrop-blur-md border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] lg:text-xs font-black italic tracking-tighter cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center text-[7px] group-hover:bg-gold group-hover:text-black transition-all font-bold text-gold">KA</div>
          <span className="hidden sm:block uppercase tracking-[0.2em] text-[9px] font-black opacity-80 group-hover:opacity-100 transition-all">{t.name}</span>
        </motion.div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden lg:flex gap-10 items-center">
            {navItems.map((item) => (
              item.onClick ? (
                <button 
                  key={item.label}
                  onClick={item.onClick}
                  className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60 hover:opacity-100 hover:text-gold transition-all flex items-center gap-2 cursor-pointer"
                >
                  {item.icon}
                  {item.label}
                </button>
              ) : (
                <a 
                  key={item.label}
                  href={item.href}
                  className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60 hover:opacity-100 hover:text-gold transition-all flex items-center gap-2"
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRadio}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${isPlaying ? 'bg-gold border-gold text-black shadow-glow' : 'border-white/20 text-white/70 hover:border-gold hover:text-gold'}`}
            title={t.radio}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
          </motion.button>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
          >
            <Menu size={22} />
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
            className="fixed inset-0 z-[60] bg-matte-black flex flex-col items-center justify-center gap-8 text-center p-6"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-white/10 text-white"
            >
              <X size={26} />
            </button>
            {navItems.map((item) => (
              item.onClick ? (
                <button 
                  key={item.label}
                  onClick={() => { item.onClick!(); setIsMenuOpen(false); }}
                  className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-white/90 hover:text-gold transition-colors"
                >
                  {item.icon && React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                  {item.label}
                </button>
              ) : (
                <a 
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-white/90 hover:text-gold transition-colors"
                >
                  {item.icon && React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                  {item.label}
                </a>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CLEAN IMAGE LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePreview(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setActivePreview(null); }}
              className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-gold/40 hover:bg-gold hover:text-black transition-all text-white shadow-2xl z-20 cursor-pointer"
              title={t.close}
            >
              <X size={22} />
            </button>

            {/* Modal Natural Size Image Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center max-w-lg w-full max-h-[85vh] bg-zinc-950/95 border border-gold/30 rounded-2xl p-5 shadow-2xl overflow-hidden"
            >
              <div className="relative max-h-[65vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2">
                <img 
                  src={activePreview.url} 
                  alt={activePreview.alt} 
                  title={activePreview.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg filter drop-shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 text-center">
                {activePreview.year && (
                  <span className="text-gold text-[10px] font-black tracking-[0.3em] uppercase block mb-1">
                    {activePreview.year}
                  </span>
                )}
                <h3 className="text-lg md:text-xl font-black italic tracking-tighter text-white">
                  {activePreview.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main onMouseMove={handleMouseMove}>
        {/* --- HERO SECTION (COMPACT SLEEK HERO BANNER) --- */}
        <section id="home" className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-14 flex flex-col justify-center items-center text-center px-4 sm:px-6 overflow-hidden border-b border-white/10">
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
                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1400&auto=format&fit=crop" 
                alt="خلفية ضوئية - كريم عشماوي" 
                title="كريم عشماوي - مفكر وباحث حر"
                className="w-full h-full object-cover lg:object-top opacity-20 grayscale contrast-125"
                loading="eager"
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

          <div className="relative z-10 max-w-4xl w-full my-auto">
            <motion.div
              style={{
                x: useTransform(smoothMouseX, [-0.5, 0.5], ['-10px', '10px']),
                y: useTransform(smoothMouseY, [-0.5, 0.5], ['-10px', '10px']),
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-gold text-[10px] sm:text-xs font-black tracking-[0.35em] mb-2 uppercase drop-shadow-glow">
                {t.role}
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter uppercase mb-3 relative">
                <span className="relative z-10">{t.name}</span>
                <span className="absolute inset-0 text-white/5 blur-sm -translate-y-1 select-none pointer-events-none">{t.name}</span>
              </h1>
              <div className="w-16 h-[1px] bg-gold/40 mx-auto mb-4" />
              <p className="max-w-2xl mx-auto text-xs sm:text-base lg:text-lg text-white/85 font-medium leading-relaxed italic no-uppercase mb-6 drop-shadow-xl px-2">
                {t.summary}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center">
                <motion.a
                  href="https://kareemashmawy.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(197, 160, 89, 0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="luxury-button relative overflow-hidden group min-w-[180px] text-xs py-3 px-6"
                >
                  <span className="relative z-10">{t.visitBlog}</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.a>

                <motion.button 
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(197, 160, 89, 0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={toggleRadio}
                  className={`relative flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border transition-all duration-300 overflow-hidden min-w-[180px] ${isPlaying ? 'bg-gold text-black border-gold' : 'bg-transparent text-gold border-gold/30 hover:border-gold'}`}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
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
        </section>

        {/* --- LIBRARY SECTION (NATURAL HORIZONTAL SHOWCASE) --- */}
        <section id="library" className="py-16 lg:py-24 bg-zinc-950/60 backdrop-blur-sm px-4 lg:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                  {t.books}
                </h2>
                <div className="w-14 h-1 bg-gold glow-gold mt-2" />
              </div>

              {/* Horizontal Scroll Arrows Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLibrary('right')}
                  className="w-10 h-10 rounded-full border border-gold/30 bg-black/60 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-all shadow-glow cursor-pointer active:scale-95"
                  title="السابق"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => scrollLibrary('left')}
                  className="w-10 h-10 rounded-full border border-gold/30 bg-black/60 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-all shadow-glow cursor-pointer active:scale-95"
                  title="التالي"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>

            {/* Horizontal Books Scroll Container with Natural Compact Cover Sizes */}
            <div className="relative">
              <div 
                ref={libraryScrollRef}
                className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-1 px-1 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {BOOKS.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="snap-center w-44 sm:w-52 flex-shrink-0 bg-stone-900/80 border border-white/10 hover:border-gold/50 rounded-2xl p-3.5 transition-all duration-300 shadow-xl flex flex-col justify-between group cursor-pointer"
                    onClick={() => setActivePreview({
                      url: book.image,
                      title: book.title[lang],
                      year: book.year,
                      alt: `غلاف كتاب ${book.title.ar} - كريم عشماوي`
                    })}
                  >
                    {/* Compact Natural Book Cover Image */}
                    <div className="relative w-full h-56 sm:h-64 bg-black/90 rounded-xl overflow-hidden border border-white/10 group-hover:border-gold/40 transition-colors p-2 flex items-center justify-center mb-2.5">
                      <img 
                        src={book.image} 
                        alt={`غلاف كتاب ${book.title[lang]} - كريم عشماوي`} 
                        title={`${book.title[lang]} - كريم عشماوي`}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-gold border border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={12} />
                      </div>
                    </div>

                    {/* Book Title & Year */}
                    <div className="flex flex-col gap-0.5 text-center">
                      <span className="text-[10px] font-black text-gold tracking-widest uppercase">{book.year}</span>
                      <h3 className="text-base sm:text-lg font-black italic tracking-tighter uppercase text-white group-hover:text-gold transition-colors leading-tight">
                        {book.title[lang]}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- YOUTUBE PLAYLIST SECTION --- */}
        <section id="lectures" className="py-20 lg:py-32 bg-black px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-gold text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase mb-3 block">YouTube Channel / سلسلة المحاضرات</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                {t.playlist}
              </h2>
              <div className="w-16 h-1 bg-gold glow-gold mx-auto mb-6" />
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/50 max-w-lg mx-auto">
                {lang === 'ar' ? 'انقر على أيقونة القائمة في الزاوية العلوية من الفيديو لمشاهدة قائمة المحاضرات بالكامل' : 'Click the playlist icon in the top right corner of the video to view the full lecture list'}
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group bg-matte-black"
            >
              <iframe 
                src="https://www.youtube.com/embed/videoseries?list=PLGUU_GZ29r2y0lhz9ZXxSUhl8DmCc6YL5&rel=0&modestbranding=1" 
                title="سلسلة محاضرات كريم عشماوي - يوتيوب" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute inset-0 w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 pointer-events-none border border-gold/10 rounded-2xl sm:rounded-[2.5rem] z-10" />
            </motion.div>

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="https://youtube.com/playlist?list=PLGUU_GZ29r2y0lhz9ZXxSUhl8DmCc6YL5"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(220, 38, 38, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-full border border-red-600/30 bg-red-600/5 transition-all text-red-500 font-black tracking-[0.2em] uppercase text-xs"
                >
                  <Youtube size={18} />
                  <span>{lang === 'ar' ? 'فتح السلسلة في يوتيوب' : 'Open Full Playlist'}</span>
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        {/* --- PLATFORMS BENTO --- */}
        <section id="platforms" className="py-20 lg:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <span className="text-gold text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase mb-3 block">{t.platforms}</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase">Digital Hub</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
              {/* Main Blog Entry */}
              <motion.a 
                href="https://kareemashmawy.netlify.app"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-12 lg:col-span-8 p-8 sm:p-12 rounded-3xl sm:rounded-[2.5rem] bg-stone-900/90 border border-white/10 flex flex-col justify-between group overflow-hidden relative shadow-2xl min-h-[220px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full animate-pulse" />
                <div className="flex justify-between items-start relative z-10 mb-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <BookOpen size={28} className="text-gold" />
                  </div>
                  <div className="p-3 rounded-full border border-white/10 group-hover:bg-gold group-hover:text-black transition-all">
                    <ArrowUpRight size={22} />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">{t.blog}</h3>
                  <div className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">kareemashmawy.netlify.app</div>
                </div>
              </motion.a>

              {/* Scribd */}
              <motion.a 
                href="https://www.scribd.com/user/902001852/Karim-Ashmawy"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl glass-dark border border-white/5 flex flex-col justify-between group min-h-[180px]"
              >
                <Library size={28} className="text-gold" />
                <div>
                  <h4 className="text-xl font-black italic tracking-tighter uppercase mb-1 group-hover:text-gold transition-colors">{t.scribd}</h4>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Research Archive</div>
                </div>
              </motion.a>

              {/* Ktobati / كتوباتي - Added right after Scribd */}
              <motion.a 
                href="https://www.ktobati.com/author/%D9%83%D8%B1%D9%8A%D9%85-%D8%B9%D8%B4%D9%85%D8%A7%D9%88%D9%8A"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl glass-dark border border-gold/20 flex flex-col justify-between group relative overflow-hidden bg-stone-950/80 min-h-[180px]"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-gold/5 blur-[40px] rounded-full" />
                <BookIcon size={28} className="text-gold group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-xl font-black italic tracking-tighter uppercase mb-1 group-hover:text-gold transition-colors">{t.ktobati}</h4>
                  <div className="text-[10px] font-bold text-gold/50 uppercase tracking-widest">المكتبة الرقمية • Digital Library</div>
                </div>
              </motion.a>

              {/* Noor Book */}
              <motion.a 
                href="https://www.noor-book.com/%D9%83%D8%AA%D8%A8-%D9%83%D8%B1%D9%8A%D9%85-%D8%B9%D8%B4%D9%85%D8%A7%D9%88%D9%89-pdf"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl glass-dark border border-white/5 flex flex-col justify-between group min-h-[180px]"
              >
                <BookIcon size={28} className="text-white/40 group-hover:text-gold transition-colors" />
                <div>
                  <h4 className="text-xl font-black italic tracking-tighter uppercase mb-1">{t.noorBook}</h4>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Regional Library</div>
                </div>
              </motion.a>

              {/* Foulabook */}
              <motion.a 
                href="https://foulabook.com/ar/author/%D9%83%D8%AA%D8%A8-%D9%83%D8%B1%D9%8A%D9%85-%D8%B9%D8%B4%D9%85%D8%A7%D9%88%D9%8A-pdf"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl glass-dark border border-white/5 flex flex-col justify-between group min-h-[180px]"
              >
                <BookIcon size={28} className="text-white/40 group-hover:text-gold transition-colors" />
                <div>
                  <h4 className="text-xl font-black italic tracking-tighter uppercase mb-1">{t.foulabook}</h4>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Community Library</div>
                </div>
              </motion.a>

              {/* Quran Platform Integration */}
              <motion.a 
                href="https://Quran-elkareem.netlify.app"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl bg-black border border-gold/30 flex flex-col justify-between group overflow-hidden relative min-h-[180px]"
              >
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookOpen size={32} className="text-gold" />
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2 text-white leading-tight">{t.quranKareem}</h4>
                  <div className="flex items-center gap-2 text-gold text-[10px] font-black tracking-widest uppercase">
                    Launch <ArrowUpRight size={12} />
                  </div>
                </div>
              </motion.a>

              {/* Ahl Al-Quran FM */}
              <motion.a 
                href="https://Quran-fm.netlify.app"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl border border-gold/10 flex flex-col justify-between group bg-zinc-950/50 min-h-[180px]"
              >
                <Radio size={28} className="text-gold" />
                <div>
                  <h4 className="text-xl font-black italic tracking-tighter uppercase mb-1">{t.quranFm}</h4>
                  <div className="text-[10px] font-bold text-gold/50 uppercase tracking-widest">Audio Resource</div>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* --- COLLABORATION --- */}
        <section className="py-24 lg:py-36 bg-[#060606] px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              <div className="flex flex-col gap-8">
                <h3 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-none">{t.contact}</h3>
                <p className="text-white/50 italic leading-relaxed max-w-md no-uppercase text-base sm:text-lg">For collaboration, lectures, or intellectual inquiries, please reach out directly through official channels.</p>
                
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/profile.php?id=61584022049474" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                    <Facebook size={18} />
                  </a>
                  <a href="mailto:Karim_ashmawy@hotmail.com" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                    <Mail size={18} />
                  </a>
                </div>
              </div>

              <div className="p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] bg-matte-black border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] rounded-full" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">Official Inquiry</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold select-all no-uppercase text-gold block mb-6 break-all">Karim_ashmawy@hotmail.com</span>
                <div className="h-[1px] w-full bg-white/10 mb-6" />
                <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={12} />
                  Cairo, Egypt
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer id="footer" className="bg-matte-black pt-24 pb-16 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gold/5 blur-[180px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10 mb-24">
            <div className="text-center lg:text-left rtl:lg:text-right">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase mb-2">{t.name}</div>
              <div className="text-gold text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">{t.role}</div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black tracking-[0.25em] uppercase text-white/50">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="hover:text-gold transition-colors">{item.label}</a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest italic no-uppercase">
              <MapPin size={12} />
              Cairo, Egypt
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
             <div className="text-[80px] sm:text-[140px] lg:text-[20vw] font-black italic tracking-tighter opacity-[0.03] leading-[0.7] select-none text-center mix-blend-overlay">
                MATHAL <br /> NURUH
             </div>
             
             {/* VISITOR COUNTER */}
             <div className="flex flex-col items-center gap-4 py-8 px-10 sm:px-14 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-black tracking-[0.4em] text-gold uppercase relative z-10">Live Statistics / إحصائيات مباشرة</span>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <img 
                    src="https://count.getloli.com/get/@karimashmawy_mathal?theme=asoul" 
                    alt="عداد الزوار المباشر لموقع كريم عشماوي"
                    title="إحصائيات الزوار المباشرة"
                    className="h-10 opacity-90 hover:opacity-100 transition-all filter drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Unique Visitors Count</div>
                </div>
             </div>

             <p className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase mt-12">{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
