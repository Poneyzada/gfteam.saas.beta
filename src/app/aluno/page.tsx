'use client'

import { useApp } from '@/contexts/AppContext'
import { 
  QrCode, User, BookOpen, Award, CheckCircle2, 
  ChevronRight, Calendar, Clock, Trophy, Bell, Settings, Zap, Shield,
  TrendingUp, Star, CreditCard, Camera, MapPin, Share2, Download, LogOut, Play,
  ChevronLeft, Check, CameraIcon, UserIcon, Info, X, AlertCircle
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

const resizeImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
  });
};

export default function AlunoApp() {
  const { lang } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [showID, setShowID] = useState(false)
  const [userName, setUserName] = useState('Atleta')
  const [userRole, setUserRole] = useState('student')
  const [studentBelt, setStudentBelt] = useState('branca')
  const [totalClasses, setTotalClasses] = useState(0)
  const [trainingHours, setTrainingHours] = useState(0)
  const [medals, setMedals] = useState(0)
  
  // Onboarding & ID Card States
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [identityType, setIdentityType] = useState<'avatar' | 'photo' | null>(null)
  const [stripes, setStripes] = useState(0)
  const [trainingTime, setTrainingTime] = useState('Recém-chegado')
  const [avatarSpecs, setAvatarSpecs] = useState({
    hair: 'Curto',
    facialHair: 'Nenhum',
    giColor: 'Branco',
    isKids: false
  })

  // State variables for face verification
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null)
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [faceapi, setFaceapi] = useState<any>(null)
  const [faceapiLoaded, setFaceapiLoaded] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Only import face-api on client side
    import('@vladmandic/face-api').then((mod) => {
      setFaceapi(mod);
    });
  }, []);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return; }
      
      setUserId(user.id)
      
      const { data } = await supabase
        .from('profiles')
        .select('full_name, role, belt, total_classes, training_hours, medals, stripes, training_time, avatar_specs, avatar_url, tenant_id')
        .eq('id', user.id)
        .single()
      
      if (data?.full_name) setUserName(data.full_name)
      if (data?.role) setUserRole(data.role)
      if (data?.tenant_id) setTenantId(data.tenant_id)
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url)
        setReferencePhoto(data.avatar_url)
      }
      
      if (data?.belt) {
        setStudentBelt((data.belt as string).toLowerCase())
      } else if (data?.role === 'student') {
        setShowOnboarding(true)
      }

      if (data?.stripes !== undefined) setStripes(data.stripes)
      if (data?.training_time) setTrainingTime(data.training_time)
      if (data?.avatar_specs) setAvatarSpecs(data.avatar_specs)
      if (data?.total_classes) setTotalClasses(data.total_classes)
      if (data?.training_hours) setTrainingHours(data.training_hours)
      if (data?.medals) setMedals(data.medals)
    }
    getProfile()
  }, [])

  const saveIDCard = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase.from('profiles').update({ 
      belt: studentBelt,
      stripes: stripes,
      training_time: trainingTime,
      avatar_specs: avatarSpecs,
      avatar_url: referencePhoto
    }).eq('id', user.id)

    if (!error) {
      if (referencePhoto) setAvatarUrl(referencePhoto)
      setShowOnboarding(false)
      alert('Sua Carteirinha Elite foi gerada com sucesso!')
    }
  }


  const beltColors: Record<string, { bg: string, text: string, accent: string, rgb: string }> = {
    branca: { bg: 'bg-white', text: 'text-surface-900', accent: '#fff', rgb: '255, 255, 255' },
    azul: { bg: 'bg-blue-600', text: 'text-white', accent: '#2563eb', rgb: '37, 99, 235' },
    roxa: { bg: 'bg-purple-700', text: 'text-white', accent: '#7e22ce', rgb: '126, 34, 206' },
    marrom: { bg: 'bg-[#5D4037]', text: 'text-white', accent: '#5D4037', rgb: '93, 64, 55' },
    preta: { bg: 'bg-surface-950', text: 'text-accent-primary', accent: '#ccff00', rgb: '0, 0, 0' },
  }
  const currentTheme = beltColors[studentBelt as keyof typeof beltColors] || beltColors.branca

  // --- CARTEIRINHA WIZARD COMPONENTS ---

  const OnboardingWizard = () => (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-surface-800 border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-surface-900">
           <motion.div 
             className="h-full bg-accent-primary" 
             initial={{ width: 0 }} 
             animate={{ width: `${(onboardingStep / 5) * 100}%` }} 
           />
        </div>

        {onboardingStep === 1 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-left">
            <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-4 leading-none">CRIE SUA <br /><span className="text-accent-primary italic tracking-tight">CARTEIRINHA ELITE</span></h2>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-10 opacity-60">Escolha como quer ser representado no tatame digital.</p>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setIdentityType('avatar'); setOnboardingStep(2); }}
                className="group flex items-center gap-6 p-8 rounded-[2.5rem] bg-surface-900 border border-white/5 hover:border-accent-primary transition-all shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center group-hover:bg-accent-primary transition-all">
                  <UserIcon className="w-8 h-8 text-accent-primary group-hover:text-black" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-text-primary uppercase tracking-widest leading-none mb-1">LEGO AVATAR</p>
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-40 italic">Crie seu personagem estilo Lego BJJ</p>
                </div>
              </button>

              <button 
                onClick={() => { setIdentityType('photo'); setOnboardingStep(6); }}
                className="group flex items-center gap-6 p-8 rounded-[2.5rem] bg-surface-900 border border-white/5 hover:border-accent-primary transition-all shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center group-hover:bg-accent-primary transition-all">
                  <CameraIcon className="w-8 h-8 text-accent-primary group-hover:text-black" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-text-primary uppercase tracking-widest leading-none mb-1">FOTO REAL</p>
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-40 italic">Suba uma foto sua de Kimono</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {onboardingStep === 2 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-left">
            <button onClick={() => setOnboardingStep(1)} className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase mb-8 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-8 leading-none">CUSTOMIZAR <br /><span className="text-accent-primary italic tracking-tight">LEGO-LUTADOR</span></h2>
            
            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Estilo Geral</label>
                  <div className="flex gap-3">
                     <button onClick={() => setAvatarSpecs({...avatarSpecs, isKids: false})} className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!avatarSpecs.isKids ? 'bg-accent-primary text-black border-accent-primary' : 'bg-surface-900 border-white/5 text-text-muted'}`}>Adulto</button>
                     <button onClick={() => setAvatarSpecs({...avatarSpecs, isKids: true})} className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${avatarSpecs.isKids ? 'bg-accent-primary text-black border-accent-primary' : 'bg-surface-900 border-white/5 text-text-muted'}`}>Kids</button>
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Cor do Kimono</label>
                  <div className="flex gap-3">
                     {['Branco', 'Azul', 'Preto'].map(color => (
                       <button key={color} onClick={() => setAvatarSpecs({...avatarSpecs, giColor: color})} className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${avatarSpecs.giColor === color ? 'bg-accent-primary text-black border-accent-primary' : 'bg-surface-900 border-white/5 text-text-muted'}`}>{color}</button>
                     ))}
                  </div>
               </div>
               {!avatarSpecs.isKids && (
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Barba</label>
                    <div className="flex gap-3">
                       {['Nenhuma', 'Curta', 'Mestre'].map(b => (
                         <button key={b} onClick={() => setAvatarSpecs({...avatarSpecs, facialHair: b})} className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${avatarSpecs.facialHair === b ? 'bg-accent-primary text-black border-accent-primary' : 'bg-surface-900 border-white/5 text-text-muted'}`}>{b}</button>
                       ))}
                    </div>
                 </div>
               )}
            </div>
            
            <button onClick={() => setOnboardingStep(3)} className="w-full mt-12 py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">DEFINIR GRADUAÇÃO →</button>
          </motion.div>
        )}

        {onboardingStep === 3 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-left">
            <button onClick={() => setOnboardingStep(identityType === 'avatar' ? 2 : 1)} className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase mb-8 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-4 leading-none">NÍVEL TÉCNICO <br /><span className="text-accent-primary italic tracking-tight">E GRADUAÇÃO</span></h2>
            
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Sua Faixa Atual</label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.keys(beltColors).map((belt) => (
                      <button key={belt} onClick={() => setStudentBelt(belt)} className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${studentBelt === belt ? 'bg-accent-primary border-accent-primary text-black shadow-lg' : 'bg-surface-900 border-white/5 text-text-muted hover:border-white/20'}`}>
                         <div className={`w-3 h-3 rounded-full ${beltColors[belt].bg} border border-white/10`} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{belt}</span>
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Graus (Stripes)</label>
                  <div className="flex gap-3">
                    {[0, 1, 2, 3, 4].map((g) => (
                      <button key={g} onClick={() => setStripes(g)} className={`flex-1 py-4 rounded-xl border text-xs font-black transition-all ${stripes === g ? 'bg-accent-primary text-black border-accent-primary shadow-lg' : 'bg-surface-900 border-white/5 text-text-muted'}`}>{g}</button>
                    ))}
                  </div>
                  <p className="text-[9px] text-text-muted mt-2 font-bold uppercase tracking-widest opacity-40 italic">O Mestre validará seu rank no tatame.</p>
               </div>
            </div>
            
            <button onClick={() => setOnboardingStep(4)} className="w-full mt-12 py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">QUASE LÁ →</button>
          </motion.div>
        )}

        {onboardingStep === 4 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-left">
            <button onClick={() => setOnboardingStep(3)} className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase mb-8 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-8 leading-none">SEU LEGADO <br /><span className="text-accent-primary italic tracking-tight">DE GUERREIRO</span></h2>
            
            <div className="space-y-6">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Quanto tempo você treina?</label>
               <div className="grid grid-cols-1 gap-3">
                  {['Recém-chegado', 'Menos de 6 meses', 'Entre 6 meses e 1 ano', 'Mais de 1 ano', 'Vários anos (Mestre)'].map(time => (
                    <button key={time} onClick={() => setTrainingTime(time)} className={`text-left p-6 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${trainingTime === time ? 'bg-accent-primary border-accent-primary text-black' : 'bg-surface-900 border-white/5 text-text-muted hover:border-white/20'}`}>
                       {time}
                    </button>
                  ))}
               </div>
               <div className="p-5 rounded-2xl bg-accent-primary/5 border border-accent-primary/20 flex gap-4">
                  <Info className="w-5 h-5 text-accent-primary shrink-0" />
                  <p className="text-[9px] font-bold text-accent-primary uppercase tracking-widest leading-relaxed">Não se preocupe com a contagem de aulas. O Mestre irá atualizar conforme sua presença no QG.</p>
               </div>
            </div>
            
            <button onClick={() => setOnboardingStep(5)} className="w-full mt-12 py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">VER MINHA CARTEIRINHA →</button>
          </motion.div>
        )}

        {onboardingStep === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
             <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-4 leading-none">TUDO PRONTO, <br /><span className="text-accent-primary italic tracking-tight">COMBATENTE!</span></h2>
             
             {/* Preview of the Card */}
             <div className="py-8">
                <div className={`w-full aspect-[1/1.5] max-h-[300px] rounded-[3rem] ${currentTheme.bg} p-8 relative overflow-hidden shadow-2xl mx-auto border border-white/10 group`}>
                   <div className="absolute inset-0 hatched opacity-20" />
                   <div className="relative z-10 flex flex-col h-full items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-surface-900/20 p-1 flex items-center justify-center mb-4">
                        <div className="w-full h-full rounded-full bg-surface-800 flex items-center justify-center relative overflow-hidden">
                           {identityType === 'photo' && referencePhoto ? (
                             <img src={referencePhoto} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             <>
                               <UserIcon className={`w-12 h-12 ${currentTheme.text} opacity-20`} />
                               <div className="absolute inset-x-0 bottom-0 bg-accent-primary/40 h-1/3 flex items-center justify-center">
                                  <span className="text-[8px] font-black text-black">LEGO-BJJ</span>
                               </div>
                             </>
                           )}
                        </div>
                      </div>
                      <h3 className={`text-xl font-display font-black uppercase italic tracking-tighter leading-none ${currentTheme.text}`}>{userName.split(' ')[0]}</h3>
                      <p className={`text-[8px] font-black uppercase tracking-widest mt-2 opacity-60 ${currentTheme.text}`}>FAIXA {studentBelt.toUpperCase()} • {stripes} GRAUS</p>
                      <div className="mt-6 p-3 bg-white rounded-2xl shadow-xl">
                         <QrCode className="w-12 h-12 text-black" strokeWidth={1.5} />
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setOnboardingStep(4)} className="flex-1 py-5 bg-surface-700 text-text-primary rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl">AJUSTAR</button>
                <button onClick={saveIDCard} className="flex-1 py-5 bg-accent-primary text-black rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3">CONFIRMAR <Check className="w-4 h-4 stroke-[3]" /></button>
             </div>
          </motion.div>
        )}

        {onboardingStep === 6 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-left">
            <button onClick={() => setOnboardingStep(1)} className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase mb-8 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-4 leading-none">SUA FOTO <br /><span className="text-accent-primary italic tracking-tight">DE CADASTRO</span></h2>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-8 opacity-60">Esta foto será usada pela IA para validar seu rosto no check-in.</p>
            
            <div className="flex flex-col items-center gap-6 p-8 rounded-[2.5rem] bg-surface-900 border border-white/5 shadow-xl relative overflow-hidden">
               {referencePhoto ? (
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-accent-primary shadow-lg">
                     <img src={referencePhoto} alt="Foto Preview" className="w-full h-full object-cover" />
                  </div>
               ) : (
                  <div className="w-40 h-40 rounded-full bg-surface-800 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-text-muted">
                     <CameraIcon className="w-12 h-12 opacity-40 mb-2" />
                     <span className="text-[8px] font-black uppercase">Tire uma Selfie</span>
                  </div>
               )}

               <label className="cursor-pointer py-4 px-8 bg-accent-primary text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all text-center">
                  {referencePhoto ? 'TIRAR OUTRA FOTO' : 'TIRAR FOTO / ENVIAR'}
                  <input 
                     type="file" 
                     accept="image/*" 
                     capture="user" 
                     className="hidden" 
                     onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                           const reader = new FileReader();
                           reader.onload = async (event) => {
                              const base64 = event.target?.result as string;
                              const resized = await resizeImage(base64);
                              setReferencePhoto(resized);
                           };
                           reader.readAsDataURL(file);
                        }
                     }}
                  />
               </label>
            </div>
            
            {referencePhoto && (
               <button 
                  onClick={() => setOnboardingStep(3)} 
                  className="w-full mt-10 py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all"
               >
                  PROSSEGUIR →
               </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )


  // Experimental Mode UI
  if (userRole === 'experimental') {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden stippled">
         <div className="absolute top-0 w-full h-full bg-gradient-to-b from-accent-primary/20 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-[3.5rem] bg-accent-primary flex items-center justify-center mb-10 shadow-[0_30px_60px_rgba(204,255,0,0.4)] hatched relative z-10"
        >
            <Zap className="w-16 h-16 text-surface-900" />
        </motion.div>
        
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="relative z-10"
        >
          <h1 className="text-4xl font-display font-black text-text-primary mb-4 tracking-tighter italic uppercase">Bem-vindo, <br/><span className="text-accent-primary italic">{userName.split(' ')[0]}!</span></h1>
          <p className="text-text-muted text-sm font-medium mb-12 max-w-xs mx-auto leading-relaxed">
            Seu **Portal Elite** está pronto. Você tem <span className="text-text-primary">3 dias</span> de acesso total para treinar e sentir o DNA GFTeam.
          </p>
        </motion.div>

        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="w-full max-w-sm space-y-6 relative z-10"
        >
           <div className="kpi-card !p-10 !rounded-[3rem] border-accent-primary/30 bg-surface-800/60 backdrop-blur-xl">
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-8">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mb-2">Primeiro Treino</p>
                    <p className="text-2xl font-black text-text-primary italic tracking-tight uppercase leading-none">HOJE, 19:00</p>
                    <p className="text-xs text-text-muted font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> Unidade Matriz
                    </p>
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/5 shadow-inner">
                    <Clock className="w-6 h-6 text-accent-primary" />
                 </div>
              </div>
              <div className="flex -space-x-3 mb-6">
                 {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=tm${i}`} className="w-8 h-8 rounded-full border-2 border-surface-800" />)}
                 <div className="h-8 px-3 rounded-full bg-surface-900 border-2 border-surface-800 flex items-center text-[8px] font-black text-text-muted uppercase">E mais 42 no tatame</div>
              </div>
           </div>

           <button onClick={() => window.location.reload()} className="w-full py-6 rounded-[2.5rem] bg-accent-primary text-black font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all">
              Acessar meu QG
           </button>
        </motion.div>

        <p className="mt-12 text-[10px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 relative z-10">GFTeam International • Elite Only</p>
      </div>
    )
  }

  const CheckinModal = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [step, setStep] = useState<'loading' | 'camera' | 'matching' | 'success' | 'error'>('loading')
    const [statusMsg, setStatusMsg] = useState('Carregando modelos de IA...')
    const [errorMsg, setErrorMsg] = useState('')
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)

    useEffect(() => {
      let activeStream: MediaStream | null = null;
      async function startCheckin() {
        if (!faceapi) {
          setErrorMsg('Biblioteca de IA não carregada.');
          setStep('error');
          return;
        }
        try {
          if (!faceapiLoaded) {
            setStatusMsg('Carregando modelos de IA...');
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            setFaceapiLoaded(true);
          }
          
          setStatusMsg('Iniciando câmera...');
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          activeStream = stream;
          setLocalStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStep('camera');
        } catch (err: any) {
          setErrorMsg('Câmera bloqueada ou não encontrada. Verifique as permissões!');
          setStep('error');
        }
      }
      startCheckin();

      return () => {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
      };
    }, [faceapi]);

    const captureAndVerify = async () => {
      if (!videoRef.current || !canvasRef.current || !faceapi) return;
      setStep('matching');
      setStatusMsg('Detectando rosto e comparando...');

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const selfieBase64 = canvas.toDataURL('image/jpeg', 0.7);

      // Stop camera immediately
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      try {
        // 1. Load selfie image to memory
        const selfieImg = new Image();
        selfieImg.src = selfieBase64;
        await new Promise((resolve, reject) => {
          selfieImg.onload = resolve;
          selfieImg.onerror = reject;
        });

        // 2. Load reference image to memory
        const refImg = new Image();
        refImg.src = avatarUrl || '';
        await new Promise((resolve, reject) => {
          refImg.onload = resolve;
          refImg.onerror = reject;
        });

        // 3. Detect and extract landmarks/descriptors
        const selfieDetection = await faceapi.detectSingleFace(selfieImg).withFaceLandmarks().withFaceDescriptor();
        if (!selfieDetection) {
          setErrorMsg('Rosto não detectado na selfie. Tente enquadrar melhor o seu rosto!');
          setStep('error');
          return;
        }

        const refDetection = await faceapi.detectSingleFace(refImg).withFaceLandmarks().withFaceDescriptor();
        if (!refDetection) {
          setErrorMsg('Sua foto de perfil está inválida para reconhecimento. Refaça a foto na carteirinha.');
          setStep('error');
          return;
        }

        // 4. Compare facial descriptors using Euclidean Distance
        const distance = faceapi.euclideanDistance(selfieDetection.descriptor, refDetection.descriptor);
        console.log('Distância facial:', distance);

        if (distance < 0.6) {
          // MATCH! Insert Check-in
          setStatusMsg('Registrando check-in...');
          const { error: checkinErr } = await supabase.from('checkins').insert({
            tenant_id: tenantId,
            student_id: userId,
            status: 'confirmed',
            photo_url: selfieBase64
          });

          if (checkinErr) {
            setErrorMsg('Erro ao salvar check-in: ' + checkinErr.message);
            setStep('error');
          } else {
            setTotalClasses(prev => prev + 1);
            setStep('success');
          }
        } else {
          setErrorMsg('Reconhecimento negado: Rosto não corresponde ao cadastro!');
          setStep('error');
        }
      } catch (err: any) {
        setErrorMsg('Erro no processamento da IA: ' + err.message);
        setStep('error');
      }
    };

    const handleClose = () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      setShowCheckinModal(false);
    };

    return (
      <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <div className="bg-surface-800 w-full max-w-md rounded-[3rem] p-10 border border-white/10 shadow-2xl text-center relative">
          <button onClick={handleClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-white hover:bg-red-600 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-6">Validação de Face</h3>

          <div className="w-full aspect-square bg-surface-900 rounded-[2rem] border-2 border-white/5 overflow-hidden relative mb-8 flex items-center justify-center">
            {step === 'loading' && (
              <div className="space-y-4">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-black text-text-muted uppercase tracking-widest animate-pulse">{statusMsg}</p>
              </div>
            )}

            {step === 'camera' && (
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute inset-0 border-[6px] border-accent-primary/20 rounded-[2rem] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-accent-primary/40 rounded-full pointer-events-none animate-pulse" />
              </div>
            )}

            {step === 'matching' && (
              <div className="space-y-4">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-black text-accent-primary uppercase tracking-widest animate-pulse">{statusMsg}</p>
              </div>
            )}

            {step === 'success' && (
              <div className="p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <p className="text-xl font-display font-black text-emerald-400 uppercase italic tracking-tight">Presença Confirmada!</p>
                <p className="text-xs text-text-muted">Seu check-in facial foi registrado e validado com sucesso. Bom treino! OSS!</p>
              </div>
            )}

            {step === 'error' && (
              <div className="p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <p className="text-xl font-display font-black text-red-400 uppercase italic tracking-tight">Falha na Validação</p>
                <p className="text-xs text-text-muted leading-relaxed">{errorMsg}</p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {step === 'camera' && (
            <button onClick={captureAndVerify} className="w-full py-5 bg-accent-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer">
              CAPTURAR E VALIDAR
            </button>
          )}

          {(step === 'error' || step === 'success') && (
            <button onClick={step === 'success' ? handleClose : () => setStep('camera')} className="w-full py-5 bg-surface-900 border border-white/10 text-text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-surface-700 active:scale-95 transition-all cursor-pointer">
              {step === 'success' ? 'FECHAR' : 'TENTAR NOVAMENTE'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-surface-900 text-left relative overflow-hidden transition-all duration-500 pb-32 selection:bg-accent-primary selection:text-black`}>
      <AnimatePresence>
        {showOnboarding && <OnboardingWizard />}
        {showCheckinModal && <CheckinModal />}
      </AnimatePresence>
      
      {/* Dynamic Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 pt-14 pb-10 relative z-20"
      >
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="relative group">
                 <div className={`w-14 h-14 rounded-3xl ${currentTheme.bg} flex items-center justify-center p-1 shadow-2xl`}>
                    <div className="w-full h-full bg-surface-800 rounded-[1.2rem] flex items-center justify-center overflow-hidden">
                       {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                          <UserIcon className={`w-8 h-8 ${currentTheme.text} opacity-20`} />
                       )}
                    </div>
                 </div>
                 <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-xl ${currentTheme.bg} border-4 border-surface-900 flex items-center justify-center shadow-md`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                 </div>
              </div>
              <div>
                 <h1 className="text-xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none">{userName.split(' ')[0]}</h1>
                 <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mt-1.5 opacity-80">Faixa {studentBelt} • {stripes} G</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = '/login'
                }}
                className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative hover:bg-red-500/20 active:scale-95 transition-all text-red-500 shadow-xl"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowID(!showID)}
                className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-xl group active:scale-95 transition-all border border-white/10"
              >
                <QrCode className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              </button>
           </div>
        </div>
      </motion.header>

      {/* Main Container */}
      <main className="flex-1 px-6 relative z-10">
        
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
               {/* Next Class Hero - Integrated */}
               <div className="kpi-card !p-10 !rounded-[3rem] border-accent-primary/20 bg-accent-primary/5 overflow-visible shadow-2xl">
                  <div className="card-accent" />
                  <div className="flex items-center justify-between mb-8">
                     <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em]">Próximo Treino</span>
                     <div className="h-6 px-3 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center gap-2 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                        <span className="text-[8px] font-black text-accent-primary uppercase tracking-widest">Em 45 min</span>
                     </div>
                  </div>
                  <h2 className="text-3xl font-display font-black text-text-primary mb-2 leading-tight italic tracking-tighter uppercase text-left">Raspagem <br/><span className="text-accent-primary italic">de Gancho</span></h2>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-8 opacity-40 text-left">DNA GFTeam • Foco Técnico do Dia</p>
                  
                  <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/10 flex items-center justify-center font-black text-sm text-accent-primary uppercase shadow-inner italic">GF</div>
                           <div className="text-left">
                               <p className="text-[10px] font-black text-text-primary uppercase tracking-widest leading-none">Seu Professor</p>
                               <p className="text-[9px] text-text-muted font-medium mt-1.5 uppercase tracking-widest italic opacity-40">Unidade Matriz • 19:00</p>
                           </div>
                        </div>
                        <button className="w-14 h-14 rounded-2xl bg-accent-primary text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                           <Play className="w-7 h-7 fill-current ml-1" />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Selfie Check-in Card */}
               <div className="kpi-card !p-10 !rounded-[3rem] border border-black/10 dark:border-white/10 bg-surface-800 shadow-2xl relative overflow-hidden text-left">
                  <div className="flex items-center justify-between mb-6">
                     <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em]">Validação de Presença</span>
                     <Camera className="w-5 h-5 text-accent-primary" />
                  </div>
                  
                  {avatarUrl ? (
                     <>
                        <h3 className="text-2xl font-display font-black text-text-primary mb-3 uppercase italic tracking-tighter leading-none">CHECK-IN FACIAL</h3>
                        <p className="text-xs text-text-muted mb-8 leading-relaxed">
                           Tire uma selfie rápida para validar seu rosto e registrar sua presença na aula de hoje automaticamente.
                        </p>
                        <button 
                           onClick={() => setShowCheckinModal(true)} 
                           className="w-full py-5 rounded-[1.5rem] bg-accent-primary text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-primary/20 border-none cursor-pointer"
                        >
                           INICIAR CHECK-IN FACIAL
                        </button>
                     </>
                  ) : (
                     <>
                        <h3 className="text-2xl font-display font-black text-text-primary mb-3 uppercase italic tracking-tighter leading-none">FOTO REQUERIDA</h3>
                        <p className="text-xs text-text-muted mb-8 leading-relaxed">
                           Você precisa cadastrar uma foto real de rosto na sua carteirinha para habilitar o Check-in Facial.
                        </p>
                        <button 
                           onClick={() => { setShowOnboarding(true); setOnboardingStep(1); }} 
                           className="w-full py-5 rounded-[1.5rem] bg-surface-900 border border-white/10 text-text-primary font-black uppercase text-xs tracking-widest hover:bg-surface-700 transition-all cursor-pointer"
                        >
                           CADASTRAR FOTO
                        </button>
                     </>
                  )}
               </div>

               {/* Quick Stats Grid */}
               <div className="grid grid-cols-2 gap-6">
                  <div className="kpi-card !p-8 !rounded-[2.5rem] bg-surface-800/60 shadow-xl text-left border-white/5">
                     <div className="flex items-center gap-3 mb-6">
                        <Trophy className="w-5 h-5 text-accent-primary saturate-[2]" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Rank</span>
                     </div>
                     <p className="text-4xl font-display font-black text-text-primary tracking-tighter italic leading-none">#12 <span className="text-[10px] text-emerald-400 opacity-60">+2</span></p>
                  </div>
                  <div className="kpi-card !p-8 !rounded-[2.5rem] bg-surface-800/60 shadow-xl text-left border-white/5">
                     <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-5 h-5 text-accent-primary" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Frequência</span>
                     </div>
                     <p className="text-4xl font-display font-black text-text-primary tracking-tighter italic leading-none">92%</p>
                  </div>
               </div>

               {/* Academy Feed */}
               <div className="space-y-4 pb-10">
                  <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2 text-left opacity-60">Timeline do Quartel General</h3>
                  {[
                    { title: 'Exame de Faixa', desc: '12 de Abril • 09:00', icon: Award, color: 'text-accent-primary' },
                    { title: 'Conteúdo Tático', desc: 'Assistir vídeo da Raspagem', icon: Play, color: 'text-accent-primary' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-surface-800/50 border border-white/5 hover:border-accent-primary/20 transition-all group cursor-pointer text-left shadow-lg">
                       <div className="w-12 h-12 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-accent-primary/10 transition-all">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-black text-text-primary uppercase tracking-widest italic">{item.title}</p>
                          <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-widest opacity-40 italic">{item.desc}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-text-muted opacity-30 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div 
               key="performance"
               initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
               className="space-y-8"
            >
               <div className="kpi-card !p-10 !rounded-[3rem] bg-surface-800 border-none relative overflow-hidden text-left shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-full hatched opacity-10" />
                  <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mb-4">Sua Trajetória</p>
                  <h2 className="text-3xl font-display font-black text-text-primary italic tracking-tighter uppercase leading-none mb-10">CAMINHO DO <br/>GUERREIRO</h2>
                  
                  <div className="space-y-12">
                     <div className="flex gap-6 relative">
                        <div className="absolute left-6 top-10 w-[1px] h-12 bg-white/10" />
                        <div className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-xl hatched z-10 text-black bg-accent-primary">
                           <Star className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                           <p className="text-xs font-black text-text-primary uppercase tracking-widest italic">Graduação {studentBelt} {stripes} G</p>
                           <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-widest opacity-40 italic">Ciclo Vigente • GFTeam</p>
                        </div>
                     </div>
                     <div className="flex gap-6 relative">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-surface-700 flex items-center justify-center border border-white/10 z-10">
                           <Trophy className="w-6 h-6 text-text-muted opacity-40" />
                        </div>
                        <div className="text-left">
                           <p className="text-xs font-black text-text-primary uppercase tracking-widest italic">Tempo de Tatame</p>
                           <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-widest opacity-40 italic">{trainingTime}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 pb-10">
                  <div className="kpi-card !p-8 !rounded-[2.5rem] border-none shadow-2xl text-left bg-accent-primary transition-transform hover:scale-105">
                     <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-2 leading-none">Medalhas</p>
                     <p className="text-5xl font-display font-black text-black italic tracking-tighter leading-none">{String(medals).padStart(2,'0')}</p>
                  </div>
                  <div className="kpi-card !p-8 !rounded-[2.5rem] border-white/10 bg-surface-800 shadow-2xl text-left hover:scale-105 transition-transform">
                     <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest mb-2 leading-none">Aulas Total</p>
                     <p className="text-5xl font-display font-black text-text-primary italic tracking-tighter leading-none">{totalClasses}</p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'finances' && (
             <motion.div 
               key="finances"
               initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
               className="space-y-8"
             >
                <div className="kpi-card !p-10 !rounded-[4rem] bg-gradient-to-br from-emerald-500 to-emerald-700 border-none shadow-[0_40px_80px_rgba(16,185,129,0.3)] relative overflow-hidden text-left">
                   <div className="card-accent" />
                   <div className="flex justify-between items-start mb-16 relative z-10">
                      <div className="text-left">
                         <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Plano Operacional</p>
                         <h2 className="text-2xl font-display font-black text-white tracking-tighter uppercase italic">GFTEAM ELITE • FULL</h2>
                      </div>
                      <CreditCard className="w-8 h-8 text-white/20" />
                   </div>
                   <div className="flex items-end justify-between relative z-10">
                      <div className="text-left">
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status de Acesso</p>
                         <p className="text-xl font-bold text-white tracking-widest animate-pulse">REGULAR • 100%</p>
                      </div>
                      <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest italic shadow-xl">ATIVO</div>
                   </div>
                </div>

                <div className="space-y-4 pb-10 text-left">
                   <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2 opacity-50">Histórico Financeiro</h3>
                   {[1,2].map(i => (
                     <div key={i} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-surface-800/60 border border-white/5 shadow-xl hover:border-emerald-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                           </div>
                           <div className="text-left">
                              <p className="text-xs font-black text-text-primary uppercase tracking-widest italic">Mensalidade Ativa</p>
                              <p className="text-[10px] text-text-muted font-medium mt-1.5 uppercase tracking-widest opacity-40 italic">Processado via Gateway GF</p>
                           </div>
                        </div>
                        <p className="text-sm font-black text-text-primary italic tracking-tight">R$ 180,00</p>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'id' && (
             <motion.div 
               key="id"
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="flex flex-col items-center py-4 text-left pointer-events-auto"
             >
                {/* --- ATHLETE CARTEIRINHA ELITE --- */}
                <div className={`w-full aspect-[1/1.6] rounded-[4.5rem] ${currentTheme.bg} p-12 relative overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.6)] border border-white/10 group`}>
                   <div className="absolute inset-0 hatched opacity-25 pointer-events-none" />
                   <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-black/80 to-transparent opacity-90" />
                   
                   <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-20">
                         <div className="flex items-center gap-3">
                            <Shield className={`w-7 h-7 ${currentTheme.text} drop-shadow-xl`} />
                            <span className={`text-xl font-display font-black tracking-tighter italic uppercase ${currentTheme.text}`}>GFTEAM <span className="opacity-40 italic">QG</span></span>
                         </div>
                         <div className={`px-4 py-2 rounded-xl border border-current opacity-40 text-[9px] font-black uppercase tracking-widest ${currentTheme.text}`}>GFTEAM QG</div>
                      </div>

                      <div className="flex flex-col items-center mb-14">
                         <div className="relative group/avatar">
                           <div className="w-48 h-48 rounded-[4.5rem] p-2 bg-gradient-to-b from-white/30 to-transparent shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10 transition-transform group-hover/avatar:scale-105 duration-500">
                              <div className="w-full h-full bg-surface-900 rounded-[3.8rem] flex items-center justify-center overflow-hidden border-4 border-surface-800 shadow-inner">
                                 {/* Dynamic Lego Preview */}
                                 <div className="relative w-full h-full flex flex-col items-center justify-center">
                                    {avatarUrl ? (
                                       <img src={avatarUrl} alt="Foto Aluno" className="w-full h-full object-cover" />
                                    ) : (
                                       <div className="w-20 h-28 bg-accent-primary/20 rounded-[2rem] flex items-center justify-center border-2 border-accent-primary/10 overflow-hidden">
                                          <UserIcon className={`w-14 h-14 ${currentTheme.text} opacity-30`} />
                                          <div className="absolute bottom-4 text-[10px] font-black text-accent-primary tracking-tighter uppercase bg-black/80 px-4 py-1.5 rounded-full shadow-lg">LEGO-BJJ</div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-[2.2rem] ${currentTheme.bg} border-4 border-current flex items-center justify-center shadow-2xl z-20`}>
                              <div className="w-3 h-3 rounded-full bg-accent-primary animate-pulse shadow-[0_0_15px_rgba(204,255,0,0.8)]" />
                           </div>
                         </div>
                      </div>

                      <div className="text-center mb-16">
                         <h2 className={`text-4xl md:text-5xl font-display font-black tracking-tighter italic uppercase leading-none ${currentTheme.text} drop-shadow-2xl`}>{userName.split(' ')[0]} <br/>{userName.split(' ')[1] || 'ATLETA'}</h2>
                         <div className={`flex items-center justify-center gap-3 mt-6 opacity-60 ${currentTheme.text}`}>
                            <div className="w-2 h-2 rounded-full bg-current" />
                            <p className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-none">{studentBelt.toUpperCase()} • {stripes} GRAUS</p>
                            <div className="w-2 h-2 rounded-full bg-current" />
                         </div>
                      </div>

                      <div className="mt-auto flex flex-col items-center gap-10">
                         <div className="p-8 bg-white rounded-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] active:scale-95 transition-all max-w-[200px] aspect-square flex items-center justify-center border-4 border-black/5 hover:rotate-2">
                            <QrCode className="w-full h-full text-surface-900" strokeWidth={1} />
                         </div>
                         <div className={`text-center space-y-3 ${currentTheme.text}`}>
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-30 tracking-tighter leading-none italic">#GF-{userName.slice(0,3).toUpperCase()}-2026</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-20">DNA • LEALDADE • EFICIÊNCIA</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Interaction Row (Bug Fix: z-index / pointer-events) */}
                <div className="grid grid-cols-4 gap-4 mt-12 w-full pb-10 relative z-50 pointer-events-auto">
                   <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-3 group active:scale-95 transition-all">
                      <div className="w-16 h-16 rounded-[2rem] bg-surface-800 border border-white/5 flex items-center justify-center group-hover:bg-accent-primary/10 transition-all shadow-xl group-hover:border-accent-primary/30">
                         <Download className="w-7 h-7 text-accent-primary" />
                      </div>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none opacity-40 group-hover:opacity-100 transition-opacity">PDF</span>
                   </button>
                   
                   {/* STORIES GENERATOR BUTTON (LEGENDARY STATUS) */}
                   <button 
                     onClick={() => {
                        alert('Gerando Story Elite com QR Code para lead...\nPronto para compartilhar!');
                        window.open('https://instagram.com', '_blank');
                     }} 
                     className="col-span-2 flex flex-col items-center gap-3 group active:scale-[0.98] transition-all"
                   >
                      <div className="w-full h-16 rounded-[2.2rem] bg-gradient-to-r from-accent-primary to-emerald-400 flex items-center justify-center gap-4 shadow-2xl shadow-accent-primary/20 hover:saturate-150 transition-all">
                         <Share2 className="w-6 h-6 text-black stroke-[3]" />
                         <span className="text-[11px] font-black text-black uppercase tracking-[0.2em] italic">POSTAR STORIES</span>
                      </div>
                      <span className="text-[8px] font-black text-accent-primary uppercase tracking-[0.3em] leading-none animate-pulse">GERAR LEAD + QR CODE</span>
                   </button>

                   <button onClick={() => setShowOnboarding(true)} className="flex flex-col items-center gap-3 group active:scale-95 transition-all">
                      <div className="w-16 h-16 rounded-[2rem] bg-surface-800 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all shadow-xl">
                         <Settings className="w-7 h-7 text-text-muted group-hover:text-white" />
                      </div>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none opacity-40 group-hover:opacity-100 transition-opacity">EDIT</span>
                   </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-8 left-6 right-6 max-w-sm mx-auto z-[100] px-4">
         <div className="glass !rounded-[3rem] !bg-surface-800/90 backdrop-blur-3xl border border-white/10 px-8 h-22 flex justify-around items-center shadow-[0_40px_80px_rgba(0,0,0,0.9)]">
            {[
              { id: 'home', icon: Shield, label: 'QG' },
              { id: 'performance', icon: Star, label: 'Rank' },
              { id: 'id', icon: User, label: 'ID' },
              { id: 'finances', icon: CreditCard, label: 'Pay' },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-2 transition-all group relative py-3 rounded-2xl min-w-[60px] cursor-pointer ${activeTab === item.id ? 'text-surface-900 scale-110' : 'text-text-muted opacity-40 hover:opacity-100'}`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="nav_glow_student" 
                    className="absolute inset-x-0 inset-y-0 bg-accent-primary rounded-3xl -z-10 shadow-[0_15px_40px_rgba(204,255,0,0.5)]"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
                <item.icon className={`w-7 h-7 z-10 transition-colors ${activeTab === item.id ? '!text-surface-900' : ''}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest z-10 leading-none ${activeTab === item.id ? '!text-surface-900' : ''}`}>{item.label}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  )
}
