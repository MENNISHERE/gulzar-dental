import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import Lenis from 'lenis';
import { 
  Plus, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronLeft,
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Stethoscope, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Menu, 
  X, 
  MessageSquare,
  AlertCircle,
  Activity,
  Award,
  Zap,
  Moon,
  Sun,
  Layout,
  Music,
  Video,
  HandHeart,
  Trash2,
  Smile
} from 'lucide-react';
import { cn } from './lib/utils';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap 
} from '@vis.gl/react-google-maps';

// --- Constants ---

const WHATSAPP_URL = "https://wa.me/923006038297";
const TIKTOK_URL = "https://www.tiktok.com/@gulzardentalclinic"; // Please update this with your actual link
const OLADOC_URL = "https://oladoc.com/pakistan/sargodha/h/gulzar-dental-clinic/15501";
const LOGO_URL = "https://i.postimg.cc/W1s8JwB1/file-00000000e988722f8a542eda2234d7c0.png";

const SERVICES_DATA: Service[] = [
  {
    title: "Surgical Treatment",
    description: "Advanced oral surgical procedures performed with precision and care.",
    details: ["Wisdom Tooth Surgery", "Gum Grafting", "Oral Biopsy", "Bone Augmentation", "Jaw Surgery"],
    icon: <Activity className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Tooth Extraction",
    description: "Gentle and pain-free removal of damaged or problematic teeth.",
    details: ["Simple Extraction", "Surgical Extraction", "Local Anesthesia", "Post-Op Care", "Quick Recovery"],
    icon: <Trash2 className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=2000"
  },
  {
    title: "Scaling & Polishing",
    description: "Advanced plaque removal using ultrasonic technology for healthy gums.",
    details: ["Deep Cleaning", "Stain Removal", "Gum Health", "Breath Freshening", "Plaque Control"],
    icon: <Sparkles className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Dental Filling",
    description: "High-quality, tooth-colored restorations for decayed or damaged teeth.",
    details: ["Composite Filling", "Aesthetic Bonding", "Decay Removal", "Natural Finish", "Durable Materials"],
    icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
    image: "https://i.postimg.cc/YC2KRg58/Screenshot-20260515-203314.jpg"
  },
  {
    title: "Braces & Orthodontics",
    description: "Comprehensive solutions for perfectly aligned teeth and a balanced smile.",
    details: ["Metal Braces", "Ceramic Braces", "Clear Aligners", "Retainers", "Bite Correction"],
    icon: <Layout className="w-6 h-6 text-teal-400" />,
    image: "https://i.postimg.cc/RFXDpbKp/smiling-young-woman-with-braces-teeth.jpg"
  },
  {
    title: "Custom Dentures",
    description: "Comfortable and natural-looking removable dentures for missing teeth.",
    details: ["Full Dentures", "Partial Dentures", "Flexible Base", "Repair Service", "Refitting"],
    icon: <Smile className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?q=80&w=2080&auto=format&fit=crop"
  },
  {
    title: "Dental Crown",
    description: "Durable protective caps to restore strength and appearance to damaged teeth.",
    details: ["Full Coverage", "Tooth Protection", "Restoration", "Custom Shading", "Long-lasting"],
    icon: <Award className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Fixed Bridge",
    description: "Permanent dental bridges to fill gaps and restore chewing function.",
    details: ["Gap Closure", "Fixed Prosthetic", "Support Teeth", "Natural Look", "Stability"],
    icon: <Zap className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Removable Teeth",
    description: "Flexible and cost-effective prosthetic options for missing teeth.",
    details: ["Easy Cleaning", "Comfortable Fit", "Quick Process", "Replaceable", "Aesthetic"],
    icon: <HandHeart className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Fixed Teeth Solutions",
    description: "Permanent replacement options including implants and fixed restorations.",
    details: ["Dental Implants", "Fixed Crowns", "Stability", "Total Comfort", "Lifelong Solution"],
    icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=2000"
  },
  {
    title: "Porcelain Restorations",
    description: "Premium aesthetic porcelain work for a flawless, natural-looking smile.",
    details: ["Porcelain Veneers", "Porcelain Crowns", "Stain Resistant", "High Aesthetics", "Bio-compatible"],
    icon: <Sparkles className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2080&auto=format&fit=crop"
  },
  {
    title: "Zirconia Crowns",
    description: "Ultra-strong and highly translucent premium zirconia for superior durability.",
    details: ["High Strength", "Fracture Resistant", "No Metal", "Precision Milled", "Extreme Durability"],
    icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
  }
];

// --- Types ---

interface Service {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  image: string;
}

interface Testimonial {
  name: string;
  text: string;
  date: string;
  rating: number;
}

const WhatsAppButton = () => (
  <motion.a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-2xl z-40 glow-teal group"
  >
    <MessageSquare className="w-8 h-8 fill-current" />
    <span className="absolute right-full mr-4 px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/5">
      WhatsApp Us
    </span>
    <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-20" />
  </motion.a>
);

const SectionReveal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, scale: 0.98, filter: 'blur(20px)' }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 1.5, 
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 2 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    mouseX.set(x * 0.4);
    mouseY.set(y * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={cn("relative transition-all active:scale-95", className)}
    >
      {children}
    </motion.button>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, .group')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-teal-500/50 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(50, 140, 193, 0.15)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
    >
      <div className="w-1 h-1 bg-teal-500 rounded-full" />
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "pt-2 md:pt-4" : "pt-4 md:pt-6"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between rounded-[2rem] transition-all duration-700 ease-[0.22,1,0.36,1] px-6 md:px-10 border border-white/5",
        isScrolled 
          ? "bg-slate-950/90 backdrop-blur-2xl py-3 md:py-4 mx-4 md:mx-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border-white/10" 
          : "bg-slate-950/40 backdrop-blur-md py-4 md:py-6 mx-4 md:mx-auto border-white/5"
      )}>
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-none shrink-0">
            <img src={LOGO_URL} alt="Gulzar Dental Clinic Logo - Best Dental Care in Sargodha" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="font-display font-black text-base md:text-xl tracking-tighter text-white whitespace-nowrap">
            GULZAR DENTAL <span className="text-teal-500">CLINIC</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-10">
            <Link to="/services" className="relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors group">
              Our Dental Services
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-500 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/location" className="relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors group">
              Location in Sargodha
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-500 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/about" className="relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors group">
              About Our Team
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
          
          <div className="h-4 w-px bg-white/5" />

          <MagneticButton 
            onClick={() => {
              if (isHome) {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/booking');
              }
            }}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(50,140,193,0.3)] transition-all transform active:scale-95"
          >
            Book Appointment
          </MagneticButton>
        </div>

        <button className="md:hidden w-10 h-10 flex items-center justify-center text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-6 right-6 mt-4 glass-dark rounded-3xl p-8 md:hidden overflow-hidden shadow-3xl"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold text-white">All Services</Link>
                <Link to="/location" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold text-white">Location</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-display font-bold text-white">About</Link>
              </div>
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-teal-500 text-slate-950 p-5 rounded-2xl text-center font-bold text-lg shadow-xl"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-3 h-3" />
            Family Dental Care
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold leading-[1.1] mb-6">
            Best Dental <br /> 
            <span className="text-gradient font-black">Clinic in Sargodha</span>
          </h1>
          <p className="text-slate-400 text-base md:text-xl max-w-xl leading-relaxed mb-8">
            Experience premium oral healthcare at Gulzar Dental Clinic. We specialize in expert root canal treatment, tooth extraction, and professional cleaning in Sargodha. Our team provides gentle and affordable care for patients of all ages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 glow-teal transition-all active:scale-95 text-sm md:text-base"
            >
              Book via WhatsApp
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="tel:+923006038297"
              className="px-8 py-4 rounded-xl font-bold border border-white/10 glass hover:bg-white/5 transition-all text-sm md:text-base text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Clinic
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAHrtc6TE59JQv3_YfFdopXUzGx3TmFZ0UwigHW0B2xXF38-O2oIjtn-ltZd6-Z4ZQ8flfYQmehCNeCGkHjsmXPCKjq6MzfNW5ZqpjLOcOnOCdIneaj1A2EIKVnxRiCMQhMuS73J2XmAtdE=s4000" 
              alt="Gulzar Dental Clinic - Best Dentist in Sargodha providing expert tooth extraction and dental fillings" 
              className="w-full aspect-[4/5] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Floating Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -bottom-8 -left-8 glass p-6 rounded-2xl shadow-2xl max-w-xs z-20"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-teal-500 w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold">Trusted Clinic</div>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-teal-500 text-teal-500" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Gentle, professional, and affordable oral care for families at Gulzar Dental.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const BusinessInfo = () => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-8 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold mb-2">Sargodha Clinic Address</h3>
            <p className="text-sm text-slate-400">Gulzar Dental Clinic, Block No 5, Asla Wali Gali, Sargodha, Punjab, Pakistan</p>
            <div className="mt-4 text-xs font-bold text-teal-500 uppercase tracking-wider">Asla Wali Gali, block 5 Sargodha</div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-8 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold mb-2">Direct Contact</h3>
            <p className="text-sm text-slate-400">+92 300 6038297</p>
            <div className="mt-4 text-xs font-bold text-teal-500">24/7 Phone Support</div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-8 flex flex-col items-center text-center group transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold mb-2">Working Hours</h3>
            <p className="text-sm text-slate-400">Mon - Sat: 11AM-2PM & 5PM-9PM</p>
            <div className="mt-4 text-xs font-bold text-red-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              Sunday Closed
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ServicesGrid = ({ limit }: { limit?: number }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const displayServices = limit ? SERVICES_DATA.slice(0, limit) : SERVICES_DATA;

  return (
    <section id="services" className={cn("py-24 px-6 bg-slate-950/50 relative scroll-mt-20", !isHome && "pt-32")}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-teal-500 font-bold tracking-widest text-[10px] uppercase mb-4">
            <Sparkles className="w-3 h-3" />
            Gulzar Clinical Excellence
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {isHome ? "Our Dental Services in Sargodha" : "All Dental Treatments & Services"}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Professional oral healthcare in Sargodha. From root canals to braces, our personalized treatment plans ensure your family receives the best dental care possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-[450px] md:h-[500px] rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className="absolute inset-0">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>
              
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-6 text-teal-500 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-500 shadow-xl">
                  {service.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">{service.title} in Sargodha</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 transform opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 line-clamp-2">
                  {service.description} Expert {service.title.toLowerCase()} services at affordable rates in Sargodha.
                </p>
                <button 
                  onClick={() => setSelectedService(service)}
                  className="group/btn inline-flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {isHome && limit && SERVICES_DATA.length > limit && (
          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/services')}
              className="px-10 py-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-teal-500 hover:text-slate-950 transition-all shadow-xl active:scale-95"
            >
              View All Services
            </button>
          </div>
        )}
      </div>

      {/* Learn More Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              layoutId={`service-${selectedService.title}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-dark rounded-[30px] md:rounded-[40px] border-white/10 overflow-y-auto max-h-[90vh] shadow-3xl"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 glass rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-20"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="h-48 md:h-64 relative shrink-0">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10">
                   <h3 className="text-2xl md:text-4xl font-display font-bold">{selectedService.title}</h3>
                </div>
              </div>

              <div className="p-6 md:p-10">
                <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                   Our {selectedService.title.toLowerCase()} service is tailored to deliver maximum precision and aesthetic perfection.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {selectedService.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-3 glass p-4 rounded-xl md:rounded-2xl border-white/5">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs md:text-sm font-bold text-slate-200">{detail}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 md:mt-10 md:pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?u=${selectedService.title}${i}`} alt="user" />
                        </div>
                      ))}
                      <div className="pl-6 text-[10px] md:text-xs text-slate-500 font-bold self-center">
                        Joined by 500+ patients
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                      setSelectedService(null);
                      if (isHome) {
                        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/booking');
                      }
                    }}
                    className="w-full sm:w-auto bg-teal-500 text-slate-950 px-8 py-4 rounded-xl md:rounded-2xl font-bold glow-teal transition-all text-sm md:text-base text-center"
                   >
                     Book Treatment
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const BookingSection = () => {
  return (
    <section id="booking" className="py-24 px-6 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="glass-dark rounded-[40px] overflow-hidden shadow-2xl relative z-10 border border-white/5">
          <div className="grid md:grid-cols-2">
            {/* Branding/Visual Side */}
            <div className="bg-teal-600 p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calendar className="w-64 h-64 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/10 text-slate-900 text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Zap className="w-3 h-3" />
                  Fast Track Booking
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                  Book Your Appointment <br /> 
                  at Best Clinic in Sargodha.
                </h2>
                <p className="text-slate-900/70 font-medium text-lg leading-relaxed max-w-sm">
                  Professional dental services in Sargodha. Skip the paperwork and connect directly with our expert dental team via WhatsApp for priority scheduling.
                </p>
              </div>
              
              <div className="relative z-10 mt-12 space-y-4">
                 <div className="flex items-center gap-3 text-slate-900">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">Response under 15 minutes</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-900">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">Direct Surgeon Consultation</span>
                 </div>
              </div>
            </div>

            {/* Action Side */}
            <div className="p-8 md:p-12 bg-slate-950 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 border border-emerald-500/20">
                  <MessageSquare className="text-emerald-500 w-8 h-8 md:w-10 md:h-10 fill-current" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Confirm on WhatsApp</h3>
                <p className="text-slate-400 mb-8 md:mb-10 max-w-xs text-sm leading-relaxed">
                  Click below to open a private secure chat. Your metadata will be used to prioritize your medical inquiry.
                </p>
                
                <MagneticButton 
                  onClick={() => window.open(WHATSAPP_URL, '_blank')}
                  className="w-full"
                >
                  <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] transition-all">
                    Book via WhatsApp
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </MagneticButton>
              
              <p className="mt-8 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                Located in: Block No 5, Asla Wali Gali, Sargodha
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  return (
    <section id="location" className="py-24 px-6 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-display font-bold mb-6">Expert Dental Care in Sargodha</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We are conveniently located in the heartbeat of Sargodha. Visit Gulzar Dental Clinic at <strong>Block No 5, Asla Wali Gali</strong> for expert root canal treatment, professional tooth extraction, and affordable family dental services.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 glass rounded-2xl border-teal-500/10">
                <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Asla Wali Gali, Sargodha</div>
                  <div className="text-sm text-slate-400">Block No 5, Sargodha, Punjab</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 glass rounded-2xl border-teal-500/10">
                <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Operating Hours</div>
                  <div className="text-sm text-slate-400 font-medium">11:00 AM – 02:00 PM & 05:00 PM – 09:00 PM</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
               <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAFbx01MRacDnVsQROMMk9SrCzF4COyI4qFFXHayD7ogFteyeJkq_jqHRXnASbboDKDmWoTaMVQTy7zWWNdVE3axQmpZCNT86AWVkyXrf9SKtfMbHjRk00UfcQDmaomnbcsAiWq0MCUrfFfq=w744-h1611-p-k-no" 
                alt="Gulzar Dental Clinic Interior Sargodha - Modern Equipment" 
                className="w-full aspect-[3/4] object-cover rounded-xl border border-white/5"
              />
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGaEw3J1GAHQs-l15FJUQs6S45JFra5bR1skGjQkVMz8TBZN1Kc-G9wJDlHD5ANT09fdHCPLNcVD3Wr6ig641lLNRVqbtzPKeOjpqhmtiWVEfJ0abz33Sxx0VM6z1rcOactrTBE_N8fig0s=w744-h993-p-k-no" 
                alt="Expert Dentistry Tools in Sargodha Dental Clinic" 
                className="w-full aspect-[3/4] object-cover rounded-xl border border-white/5"
              />
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAHrtc6TE59JQv3_YfFdopXUzGx3TmFZ0UwigHW0B2xXF38-O2oIjtn-ltZd6-Z4ZQ8flfYQmehCNeCGkHjsmXPCKjq6MzfNW5ZqpjLOcOnOCdIneaj1A2EIKVnxRiCMQhMuS73J2XmAtdE=s4000" 
                alt="Gulzar Dental Clinic Reception Sargodha" 
                className="w-full aspect-[3/4] object-cover rounded-xl border border-white/5"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 h-[500px] w-full rounded-3xl overflow-hidden glass p-2 border-white/5 shadow-2xl relative group">
            <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
              <title>Gulzar Dental Clinic Location</title>
              <iframe
                title="Gulzar Dental Clinic Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.32!2d72.67!3d32.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392176840742ed41%3A0xc3f8e6c78a05c312!2sSargodha%2C%20Punjab!5e0!3m2!1sen!2s!4v1715710000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
              <a 
                href="https://maps.app.goo.gl/Li7Sx728rJXfjyVP9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 bg-teal-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs shadow-xl flex items-center gap-2 hover:bg-teal-400 transition-all z-20"
              >
                <MapPin className="w-3 h-3" />
                Open In Maps
              </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Farooq Ahmed",
      text: "I have very great experience at Gulzar dental clinic. He is very cooperative and well experienced.",
      date: "1 month ago",
      rating: 5
    },
    {
      name: "Sajid Khan",
      text: "Gulzar Dental Clinic is truly the best in Sargodha. The ultrasonic scaling was painless and my teeth have never looked better. Highly recommended for family care!",
      date: "2 months ago",
      rating: 5
    },
    {
      name: "Khadija Ahmed",
      text: "Very professional and clean environment. The root canal treatment was expert and I felt no pain at all. This is now our permanent family dental clinic.",
      date: "4 months ago",
      rating: 5
    },
    {
      name: "Usman Malik",
      text: "Friendly staff and very affordable prices for such high-quality care. The location in Block 5 is very easy to find. Five stars from me!",
      date: "1 month ago",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-slate-950">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.05),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-teal-500 font-bold tracking-widest text-[10px] uppercase mb-4">
              <Star className="w-3 h-3 fill-current" />
              Verified Patient Reviews
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">Trusted by the <span className="text-teal-500 underline decoration-teal-500/20 underline-offset-8">City.</span></h2>
          </motion.div>
          
          <div className="flex gap-4">
            <button 
              onClick={prev}
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-teal-500 hover:border-teal-500/50 transition-all border border-white/5 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next}
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-teal-500 hover:border-teal-500/50 transition-all border border-white/5 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative h-auto min-h-[500px] md:min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.05, x: -50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative md:absolute md:inset-0 flex items-center justify-center py-10 md:py-0"
            >
              <div className="w-full max-w-4xl glass-dark p-8 md:p-20 rounded-[30px] md:rounded-[50px] border-white/5 relative group shadow-3xl">
                <div className="absolute -top-6 left-8 md:-top-8 md:left-16 w-12 h-12 md:w-16 md:h-16 bg-teal-500 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(50,140,193,0.4)]">
                  <MessageSquare className="text-slate-950 w-6 h-6 md:w-8 md:h-8 fill-current" />
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex gap-1 mb-6 md:mb-8">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-6 md:h-6 fill-teal-500 text-teal-500" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-4xl font-display font-medium text-white leading-[1.3] mb-8 md:mb-12 italic">
                    "{testimonials[currentIndex].text}"
                  </blockquote>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-1 bg-teal-500/20 rounded-full mb-4 md:mb-6" />
                    <div className="font-display font-bold text-lg md:text-xl text-teal-400 tracking-tight">{testimonials[currentIndex].name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">{testimonials[currentIndex].date}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-1.5 transition-all duration-700 rounded-full",
                currentIndex === i ? "w-12 bg-teal-500 shadow-[0_0_10px_rgba(50,140,193,0.5)]" : "w-3 bg-slate-800"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const EliteProcess = () => {
  const steps = [
    {
      title: "Sterilized Environment",
      text: "We maintain 100% sterile clinical conditions for your safety and peace of mind.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Pain-Free Care",
      text: "Our gentle approach and modern techniques ensure a comfortable, anxiety-free experience.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Expert Practitioners",
      text: "Highly experienced team dedicated to providing ethical and modern oral healthcare.",
      icon: <Award className="w-6 h-6" />
    }
  ];

  return (
    <section id="about" className="py-32 px-6 bg-slate-900 overflow-hidden relative scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(50,140,193,0.05),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-500 font-bold tracking-widest text-[10px] uppercase mb-4">
              <Plus className="w-3 h-3" />
              About Gulzar Dental
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
              Why Choose Best Dental <br/> Clinic in <span className="text-gradient">Sargodha?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              Gulzar Dental Clinic is recognized as a leader in oral healthcare in Sargodha. We provide a welcoming environment combined with experienced practitioners dedicated to modern, painless dental treatments including root canals, orthodontic braces, and surgical extractions.
            </p>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-teal-500 shrink-0 shadow-lg">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div 
              style={{ y: useTransform(useScroll().scrollYProgress, [0, 1], [0, -100]) }}
              className="relative z-10 rounded-[40px] overflow-hidden border border-white/10 shadow-3xl"
            >
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGaEw3J1GAHQs-l15FJUQs6S45JFra5bR1skGjQkVMz8TBZN1Kc-G9wJDlHD5ANT09fdHCPLNcVD3Wr6ig641lLNRVqbtzPKeOjpqhmtiWVEfJ0abz33Sxx0VM6z1rcOactrTBE_N8fig0s=w744-h993-p-k-no" 
                alt="Expert Dental Care" 
                className="w-full aspect-[4/5] object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
               <img src={LOGO_URL} alt="Gulzar Dental Clinic Footer Logo - Best Choice in Sargodha" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              GULZAR <span className="text-teal-500">CLINIC</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            Committed to providing premium, affordable dental care for families in Sargodha. Experience clinical excellence in a welcoming environment.
          </p>
          <div className="flex gap-4">
             <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-teal-500 transition-all">
                <Music className="w-5 h-5" />
             </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-6 font-display">Contact</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <a href="tel:+923006038297" className="block hover:text-white transition-colors">+92 300 6038297</a>
              <p>Block 5, Sargodha</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-6 font-display">Presence</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <a href={OLADOC_URL} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors underline decoration-teal-500/20 underline-offset-4">oladoc Profile</a>
            </div>
          </div>
          <div className="hidden md:block">
            <h4 className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-6 font-display">Location</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <p>Asla Wali Gali</p>
              <p>Block No 5</p>
              <p>Sargodha, Punjab</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-600">
        <div>&copy; 2026 GULZAR DENTAL CLINIC. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-teal-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-teal-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-500 transition-colors">Safety</a>
        </div>
      </div>
    </footer>
  );
};

// --- Helpers ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Pages ---

const HomePage = () => (
  <main>
    <Hero />
    <SectionReveal>
      <BusinessInfo />
    </SectionReveal>
    <SectionReveal>
      <ServicesGrid limit={3} />
    </SectionReveal>
    <SectionReveal>
      <EliteProcess />
    </SectionReveal>
    <Testimonials />
    
    {/* Trust Banner */}
    <SectionReveal className="py-24 px-6 overflow-hidden bg-teal-600 relative">
      <div className="absolute inset-0 opacity-10">
        <Plus className="absolute top-10 left-1/4 w-32 h-32 rotate-12" />
        <Plus className="absolute bottom-10 right-1/4 w-40 h-40 -rotate-12" />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="text-slate-900 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-900 rounded-3xl text-teal-500 shadow-2xl">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <div className="text-4xl md:text-5xl font-display font-black tracking-tighter">TRUSTED CLINIC</div>
          </div>
          <p className="text-slate-900/80 font-bold max-w-md leading-relaxed ml-1">
            Proven clinical excellence and high patient satisfaction for over a decade in Sargodha.
          </p>
        </div>
        
        <div className="h-px w-full lg:h-24 lg:w-px bg-slate-900/20" />
        
        <div className="text-slate-900">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-900 rounded-3xl text-teal-500 shadow-2xl">
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">WALK-IN READY</div>
          </div>
          <p className="text-slate-900/80 font-bold max-w-md leading-relaxed ml-1">
            Our clinical doors are open for routine check-ups and urgent dental care. Walk in today for a healthier smile.
          </p>
        </div>
      </div>
    </SectionReveal>

    <BookingSection />
    <MapSection />
  </main>
);

const ServicesPage = () => (
  <main>
    <div className="pt-32 pb-12 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Professional Dental Services in Sargodha</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Providing expert root canal, extraction, and braces with modern technology.</p>
    </div>
    <SectionReveal>
      <ServicesGrid />
    </SectionReveal>
    <SectionReveal>
      <BusinessInfo />
    </SectionReveal>
  </main>
);

const AboutPage = () => (
  <main>
    <div className="pt-32 pb-12 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">About the Best Dental Clinic in Sargodha</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Learn about Gulzar Dental Clinic's legacy of excellence and expert care.</p>
    </div>
    <SectionReveal>
      <EliteProcess />
    </SectionReveal>
    <SectionReveal>
      <BusinessInfo />
    </SectionReveal>
    <Testimonials />
  </main>
);

const LocationPage = () => (
  <main>
    <div className="pt-32 pb-12 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Contact Gulzar Dental Clinic in Sargodha</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Find us in Block 5, Asla Wali Gali for professional dental care.</p>
    </div>
    <SectionReveal>
      <MapSection />
    </SectionReveal>
    <SectionReveal>
      <BusinessInfo />
    </SectionReveal>
  </main>
);

const BookingPage = () => (
  <main>
    <div className="pt-32 pb-12 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Book Dental Appointment in Sargodha</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Schedule your visit for expert root canal or extraction today.</p>
    </div>
    <SectionReveal>
      <BookingSection />
    </SectionReveal>
    <SectionReveal>
      <BusinessInfo />
    </SectionReveal>
  </main>
);

// --- Main App ---

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="theme-dark relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="noise-overlay" />
          <CustomCursor />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
        </motion.div>
      </div>
    </BrowserRouter>
  );
}

