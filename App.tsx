
import React, { useState, useEffect, useRef } from 'react';
import { NAMES, IMAGES, WEDDING_DATE, ITINERARY, PADRINOS, MAP_URL, WHATSAPP_URL, WHATSAPP_NUMBER } from './constants';
import { TimeRemaining } from './types';

// Componente para animaciones de entrada al hacer scroll
const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Componente de Tarjeta de Calendario Flotante (Flip Card)
const FlipUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setNextValue(value);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [value, currentValue]);

  const formattedValue = String(Math.max(0, currentValue)).padStart(2, '0');
  const formattedNext = String(Math.max(0, nextValue)).padStart(2, '0');

  return (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="flip-container mb-3">
        <div className="flip-card">
          {/* Top Half (Static - Next Value) */}
          <div className="flip-card-top">
            <span className="flip-card-number top-num">{formattedNext}</span>
          </div>
          
          {/* Bottom Half (Static - Current Value) */}
          <div className="flip-card-bottom">
            <span className="flip-card-number bot-num">{formattedValue}</span>
          </div>

          {/* Flipping Flap */}
          <div className={`flip-card-flap ${isFlipping ? 'flipping' : ''}`}>
             <span className="flip-card-number top-num">{formattedValue}</span>
          </div>

          {/* New Bottom Half that appears as flap turns */}
          {/* Fix: In React, CSS properties in the style object must be camelCased (e.g., zIndex instead of z-index). */}
          {isFlipping && (
            <div className="flip-card-bottom" style={{ zIndex: 2 }}>
              <span className="flip-card-number bot-num">{formattedNext}</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">{label}</span>
    </div>
  );
};

// Galería Mágica (Slideshow animado)
const MagicGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.gallery.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      {IMAGES.gallery.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={src} alt={`Novios ${idx}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {IMAGES.gallery.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-gold w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const distance = WEDDING_DATE.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-end py-10 scale-90 md:scale-100">
      <FlipUnit value={timeLeft.days} label="Días" />
      <FlipUnit value={timeLeft.hours} label="Horas" />
      <FlipUnit value={timeLeft.minutes} label="Min" />
      <FlipUnit value={timeLeft.seconds} label="Seg" />
    </div>
  );
};

const Calendar: React.FC = () => {
  // Diciembre 2026: 1 de diciembre es Martes
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 2; // Martes

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-xs mx-auto my-8">
      <h3 className="text-center font-serif text-xl mb-4 text-gray-800">Diciembre 2026</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <div key={d} className="font-bold text-gray-400">{d}</div>)}
        {Array(startOffset).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
        {days.map(day => (
          <div 
            key={day} 
            className={`p-2 rounded-full ${day === 14 ? 'bg-gold text-white font-bold ring-4 ring-gold/20' : 'text-gray-600'}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    message: ''
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `¡Hola! Confirmo mi asistencia a la boda.
*Nombre:* ${formData.name}
*Personas:* ${formData.guests}
*Mensaje:* ${formData.message}`;
    
    const encodedText = encodeURIComponent(text);
    // Usamos el número con el código de país de Perú (51) por defecto para el enlace con texto
    const whatsappLink = `https://wa.me/51${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappLink, '_blank');
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Intentar reproducir audio con un pequeño delay para asegurar la interacción del usuario
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.warn("Auto-play bloqueado por el navegador", e));
      }
    }, 100);
  };

  if (!isOpen) {
    return (
      <div className="fixed inset-0 bg-[#f4f1ea] flex flex-col items-center justify-center z-50 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>
        <div className="text-center animate-fade-in relative z-10">
          <div className="w-24 h-24 mx-auto mb-8 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-gold cursor-pointer hover:scale-110 transition-transform duration-500" onClick={handleOpen}>
             <span className="text-gold font-serif text-3xl">A&L</span>
          </div>
          <h1 className="font-cursive text-5xl mb-6 text-gray-800">Nuestra Boda</h1>
          <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] mb-12">Alejandro & Lucía • 14.12.2026</p>
          <button 
            onClick={handleOpen}
            className="group relative overflow-hidden bg-gold text-white px-10 py-4 rounded-full font-serif tracking-widest text-sm shadow-xl transition-all hover:shadow-gold/40 hover:-translate-y-1 active:translate-y-0"
          >
            <span className="relative z-10">ABRIR INVITACIÓN</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative selection:bg-gold/20">
      <audio ref={audioRef} src={IMAGES.music} loop />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={IMAGES.main} 
          alt="Boda" 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[ken-burns_20s_ease-in-out_infinite_alternate]"
        />
        <style>{`
          @keyframes ken-burns {
            from { transform: scale(1); }
            to { transform: scale(1.15); }
          }
        `}</style>
        <div className="relative z-20 animate-fade-in px-4">
          <h2 className="text-white font-cursive text-7xl md:text-9xl mb-6 drop-shadow-2xl">
            {NAMES.bride} <span className="text-gold">&</span> {NAMES.groom}
          </h2>
          <div className="h-[2px] w-32 bg-gold/80 mx-auto my-8"></div>
          <p className="text-white uppercase tracking-[0.5em] text-xs md:text-sm mb-4 drop-shadow-md">
            Save the Date
          </p>
          <p className="text-white font-serif text-2xl md:text-3xl tracking-[0.2em] drop-shadow-md">
            14 . 12 . 2026
          </p>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center overflow-hidden">
        <FadeInSection>
          <h3 className="font-serif text-4xl text-gray-800 mb-10 italic">¡Nos casamos!</h3>
          <p className="text-gray-600 leading-relaxed mb-16 font-light text-lg md:text-xl max-w-2xl mx-auto">
              "En la sencillez de un encuentro comenzó nuestra historia, y hoy queremos sellar nuestro amor con una promesa eterna frente a ustedes."
          </p>
        </FadeInSection>
        
        <div className="grid md:grid-cols-2 gap-16 text-center mb-20">
            <FadeInSection delay={200}>
                <h4 className="font-serif text-gold text-xl mb-4 tracking-widest uppercase text-xs font-bold">Padres de la Novia</h4>
                {PADRINOS.brideParents.map(p => <p key={p} className="text-gray-700 font-serif italic mb-1">{p}</p>)}
            </FadeInSection>
            <FadeInSection delay={400}>
                <h4 className="font-serif text-gold text-xl mb-4 tracking-widest uppercase text-xs font-bold">Padres del Novio</h4>
                {PADRINOS.groomParents.map(p => <p key={p} className="text-gray-700 font-serif italic mb-1">{p}</p>)}
            </FadeInSection>
        </div>

        <FadeInSection delay={300}>
          <div className="mb-20">
              <h4 className="font-serif text-gold text-xl mb-4 tracking-widest uppercase text-xs font-bold">Nuestros Padrinos</h4>
              <div className="flex flex-wrap justify-center gap-8">
                  {PADRINOS.godparents.map(p => <p key={p} className="text-gray-700 font-serif italic">{p}</p>)}
              </div>
          </div>
        </FadeInSection>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-20"></div>

        <FadeInSection>
          <h3 className="font-serif text-2xl text-gray-800 mb-6 uppercase tracking-widest text-xs font-bold">Faltan</h3>
          <Countdown />
          <Calendar />
        </FadeInSection>
      </section>

      {/* Gallery Section */}
      <section className="bg-[#f9f7f2] py-24 px-6 overflow-hidden">
        <FadeInSection>
          <div className="max-w-6xl mx-auto">
            <h3 className="text-center font-cursive text-6xl mb-16 text-gray-800">Momentos Inolvidables</h3>
            <MagicGallery />
          </div>
        </FadeInSection>
      </section>

      {/* Itinerary Section */}
      <section className="py-24 px-6 max-w-3xl mx-auto overflow-hidden">
        <FadeInSection>
          <h3 className="text-center font-serif text-4xl mb-20 text-gray-800 tracking-widest">ITINERARIO</h3>
          <div className="relative border-l-2 border-gold/20 ml-4 md:ml-0">
            {ITINERARY.map((item, idx) => (
              <FadeInSection key={idx} delay={idx * 100}>
                <div className="mb-12 ml-10 relative group">
                  <div className="absolute -left-12 mt-1 w-5 h-5 rounded-full bg-white border-4 border-gold group-hover:scale-125 transition-transform duration-300"></div>
                  <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">{item.time}</p>
                  <h4 className="font-serif text-2xl text-gray-800 group-hover:text-gold transition-colors duration-300">{item.activity}</h4>
                </div>
              </FadeInSection>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Location Section */}
      <section className="bg-gray-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-8 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="font-serif text-4xl mb-8 tracking-widest uppercase text-2xl">UBICACIÓN</h3>
            <p className="text-gray-400 mb-12 max-w-md mx-auto font-serif italic text-lg leading-relaxed">
              Hacienda San José, Valle Dorado.
              <br />
              Carretera Federal Km 45.
            </p>
            <a 
              href={MAP_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center space-x-3 border-2 border-gold text-gold hover:bg-gold hover:text-white px-10 py-4 rounded-full font-serif tracking-widest transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">VER EN GOOGLE MAPS</span>
              <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </FadeInSection>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-6 bg-[#fdfbf7]">
        <FadeInSection>
          <div className="max-w-xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gold"></div>
              <h3 className="font-cursive text-6xl mb-6 text-gray-800">Confirmación</h3>
              <p className="text-gray-500 mb-12 italic font-serif">Agradecemos confirmar su grata presencia antes del 1 de Noviembre de 2026</p>
              
              <form className="space-y-8" onSubmit={handleRSVP}>
                  <div className="group relative">
                    <input 
                        type="text" 
                        placeholder="Nombre Completo" 
                        className="w-full px-4 py-4 rounded-none border-b-2 border-gray-200 focus:border-gold focus:outline-none transition-colors bg-transparent text-gray-800 font-serif"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="group relative">
                    <select 
                        className="w-full px-4 py-4 rounded-none border-b-2 border-gray-200 focus:border-gold focus:outline-none transition-colors bg-transparent text-gray-800 font-serif appearance-none"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    >
                        <option value="1">1 Persona</option>
                        <option value="2">2 Personas</option>
                        <option value="3">3 Personas</option>
                        <option value="4">4 Personas</option>
                        <option value="5">5 Personas</option>
                    </select>
                  </div>
                  <div className="group relative">
                    <textarea 
                        placeholder="Mensaje especial o dieta requerida..." 
                        className="w-full px-4 py-4 rounded-none border-b-2 border-gray-200 focus:border-gold focus:outline-none transition-colors bg-transparent text-gray-800 font-serif h-32 resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                  <button 
                      type="submit"
                      className="w-full bg-gray-900 text-white py-5 rounded-full font-serif tracking-[0.2em] hover:bg-black hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                      CONFIRMAR ASISTENCIA
                  </button>
              </form>
          </div>
        </FadeInSection>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#fdfbf7] text-center">
        <div className="h-[1px] w-24 bg-gold mx-auto mb-10 opacity-50"></div>
        <p className="font-cursive text-5xl text-gray-800 mb-2">Alejandro & Lucía</p>
        <p className="text-[10px] text-gray-400 mt-6 tracking-[0.6em] uppercase">MÉXICO • 2026</p>
      </footer>

      {/* Music Control Fixed */}
      <button 
        onClick={() => {
            if (audioRef.current?.paused) audioRef.current.play();
            else audioRef.current?.pause();
        }}
        className="fixed bottom-8 right-8 z-40 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-gold/30 text-gold hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Control de música"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path>
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-ping opacity-75"></div>
        </div>
      </button>
    </div>
  );
};

export default App;
