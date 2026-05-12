import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Download, 
  Check, 
  ChevronRight, 
  FileText, 
  Type as TypeIcon, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Layout, 
  Settings, 
  Trash2,
  RefreshCw,
  MessageSquare,
  ClipboardList,
  Activity,
  ListTodo,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { UserStory, generateUserStory } from './services/gemini';
import { exportToDocx } from './services/export';

// --- Constants ---

const SECTION_TITLES = {
  en: {
    title: "User Story Title",
    description: "User Story Description",
    flow: "User Story Flow",
    workflow: "WorkFlow",
    acceptance: "Acceptance Criteria",
    business: "Business Rules",
    fields: "Fields",
    system: "System Messages",
    mandatory: "Mandatory Fields",
    optional: "Optional Fields",
    complexity: "Complexity",
    copy: "Copy Section",
    copyImage: "Copy Section",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit"
  },
  ar: {
    title: "عنوان قصة المستخدم",
    description: "وصف قصة المستخدم",
    flow: "تدفق قصة المستخدم",
    workflow: "مسار العمل",
    acceptance: "معايير القبول",
    business: "قواعد العمل",
    fields: "الحقول",
    system: "رسائل النظام",
    mandatory: "الحقول الإلزامية",
    optional: "الحقول الاختيارية",
    complexity: "التعقيد",
    copy: "نسخ القسم",
    copyImage: "نسخ القسم",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل"
  }
};

// --- Components ---

const Card = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <div 
    id={id}
    className={cn(
      "bg-white border-2 border-[#D1D1D1] rounded-[12px] p-10 mb-8",
      className
    )}
  >
    {children}
  </div>
);

const EditableContent = ({ 
  value, 
  onSave, 
  isList = false, 
  dir = "ltr",
  lang = "en"
}: { 
  value: string | string[], 
  onSave: (val: any) => void, 
  isList?: boolean,
  dir?: string,
  lang: 'en' | 'ar'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    setTempValue(isList ? (value as string[]).join('\n') : value as string);
  }, [value, isList, isEditing]);

  const t = SECTION_TITLES[lang];

  if (!isEditing) {
    return (
      <div className="group relative">
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest"
        >
          <Settings size={12} /> {t.edit}
        </button>
        {isList ? (
          <div className="space-y-4">
            {(value as string[]).map((v, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-gray-300 font-mono text-sm pt-1">{String(i+1).padStart(2, '0')}.</span>
                <p className="text-lg text-[#666666] leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl font-light text-[#666666] leading-relaxed whitespace-pre-wrap">{value}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <textarea 
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        className="w-full min-h-[150px] p-6 border-2 border-black rounded-xl font-light text-lg focus:outline-none"
        dir={dir}
      />
      <div className="flex justify-end gap-3" dir="ltr">
        <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.cancel}</button>
        <button 
          onClick={() => {
            onSave(isList ? tempValue.split('\n').filter(l => l.trim()) : tempValue);
            setIsEditing(false);
          }}
          className="px-6 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
};

const EditableSystemMessages = ({ 
  messages, 
  onSave, 
  lang = "en"
}: { 
  messages: { en: string; ar: string }[], 
  onSave: (val: any) => void, 
  lang: 'en' | 'ar'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempMessages, setTempMessages] = useState<typeof messages>([]);
  const t = SECTION_TITLES[lang];

  useEffect(() => {
    setTempMessages(messages);
  }, [messages, isEditing]);

  if (!isEditing) {
    return (
      <div className="group relative">
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest"
        >
          <Settings size={12} /> {t.edit}
        </button>
        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className="border-l-2 border-gray-100 pl-8 py-2 hover:border-black transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">English</span>
                  <p className="text-lg text-[#333333] font-medium">{msg.en}</p>
                </div>
                <div className="flex-1 text-right" dir="rtl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">العربية</span>
                  <p className="text-lg text-[#333333] font-medium">{msg.ar}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tempMessages.map((msg, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-8 border-gray-100 last:border-0">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Message {i + 1} (EN)</label>
            <textarea 
              value={msg.en}
              onChange={(e) => {
                const newMsgs = [...tempMessages];
                newMsgs[i] = { ...newMsgs[i], en: e.target.value };
                setTempMessages(newMsgs);
              }}
              className="w-full min-h-[80px] p-4 border-2 border-black rounded-lg text-sm transition-all focus:outline-none"
            />
          </div>
          <div className="space-y-2" dir="rtl">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">رسالة {i + 1} (AR)</label>
            <textarea 
              value={msg.ar}
              onChange={(e) => {
                const newMsgs = [...tempMessages];
                newMsgs[i] = { ...newMsgs[i], ar: e.target.value };
                setTempMessages(newMsgs);
              }}
              className="w-full min-h-[80px] p-4 border-2 border-black rounded-lg text-sm transition-all focus:outline-none text-right font-sans"
            />
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-3" dir="ltr">
        <button onClick={() => { setIsEditing(false); setTempMessages(messages); }} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.cancel}</button>
        <button 
          onClick={() => {
            onSave(tempMessages);
            setIsEditing(false);
          }}
          className="px-6 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
};

const WireframeHeader = ({ title, icon: Icon, showCopy, contentToCopy, onCopyImage, lang, hideExtra = false }: { title: string, icon: any, showCopy?: boolean, contentToCopy?: string, onCopyImage?: () => void, lang: 'en' | 'ar', hideExtra?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const t = SECTION_TITLES[lang];

  const handleCopy = () => {
    if (contentToCopy) {
      const fullText = `${title.toUpperCase()}\n-------------------\n${contentToCopy}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          <Icon size={32} className="text-[#333333]" strokeWidth={1} />
          <h3 className="text-4xl font-light text-[#333333] tracking-tight">{title}</h3>
        </div>
        {!hideExtra && (
          <div className="flex items-center gap-4" dir="ltr">
            {onCopyImage && (
              <button 
                onClick={onCopyImage}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                <Download size={12} /> {t.copyImage}
              </button>
            )}
            {showCopy && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? "Copied" : t.copy}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="h-[1px] bg-[#D1D1D1] w-full" />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<UserStory | null>(null);
  const [isWireframeMode, setIsWireframeMode] = useState(false); 
  const [isPrototypeMode, setIsPrototypeMode] = useState(false);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [prototypeView, setPrototypeView] = useState<'web' | 'mobile'>('web');
  const [currentStep, setCurrentStep] = useState(0);
  const [summaryLang, setSummaryLang] = useState<'en' | 'ar'>('en');
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setStory(null);
    setWizardStep(0);
    try {
      const generated = await generateUserStory(title);
      setStory(generated);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStory = (key: keyof UserStory | string, value: any, nestedKey?: string) => {
    if (!story) return;
    if (nestedKey) {
      setStory({
        ...story,
        [key]: {
          ...(story[key as keyof UserStory] as any),
          [nestedKey]: value
        }
      });
    } else {
      setStory({ ...story, [key]: value } as UserStory);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    if (!story) return;
    const l = summaryLang;
    const fullText = `
USER STORY: ${story.title[l]}
-------------------

1. Description
${story.description[l]}

2. Main Flow
${story.mainFlow[l].map((s, i) => `${i + 1}. ${s}`).join('\n')}

3. Other Flows
${story.otherFlows[l].map((s, i) => `${i + 1}. ${s}`).join('\n')}

4. Acceptance Criteria
${story.acceptanceCriteria[l].map(ac => `• ${ac}`).join('\n')}

5. Business Rules
${story.businessRules[l].map(br => `• ${br}`).join('\n')}

6. System Messages
${story.systemMessages.map(msg => `• EN: ${msg.en}\n  AR: ${msg.ar}`).join('\n')}

7. Mandatory Fields
${story.mandatoryFields.join(', ')}

8. Optional Fields
${story.optionalFields.join(', ')}
    `.trim();
    copyToClipboard(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const workflowRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const copyWorkflowAsImage = async () => {
    if (workflowRef.current) {
      setIsCapturing(true);
      try {
        const { toBlob } = await import('html-to-image');
        // Wait a bit for the UI to update if needed
        await new Promise(r => setTimeout(r, 100));
        
        const blob = await toBlob(workflowRef.current, { 
          backgroundColor: '#fff',
          style: { padding: '40px' }
        });

        if (blob) {
          try {
            const data = [new ClipboardItem({ [blob.type]: blob })];
            await navigator.clipboard.write(data);
            alert("Image copied to clipboard!");
          } catch (err) {
             // Fallback to download if clipboard fails (common in some restricted environments)
             const dataUrl = URL.createObjectURL(blob);
             const link = document.createElement('a');
             link.download = `workflow-${Date.now()}.png`;
             link.href = dataUrl;
             link.click();
          }
        }
      } catch (err) {
        console.error('Failed to capture image:', err);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const t = SECTION_TITLES[summaryLang];

  const wizardSections = story ? [
    { title: t.description, content: story.description[summaryLang], icon: FileText },
    { title: t.workflow, content: story.mainFlow[summaryLang].join('\n'), icon: Activity },
    { title: t.optional, content: story.otherFlows[summaryLang].join('\n'), icon: Layers },
    { title: t.acceptance, content: story.acceptanceCriteria[summaryLang].join('\n'), icon: ListTodo },
    { title: t.business, content: story.businessRules[summaryLang].join('\n'), icon: ShieldCheck },
    { title: t.fields, content: `Mandatory: ${story.mandatoryFields.join(', ')}\nOptional: ${story.optionalFields.join(', ')}`, icon: TypeIcon },
  ] : [];

  return (
    <div className={cn("min-h-screen bg-white font-sans p-4 md:p-12 lg:p-20", summaryLang === 'ar' && "font-sans")} dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        
        {/* Input & Header Section */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
            <div className="space-y-4">
               <h1 className="text-6xl font-black italic tracking-tighter text-black uppercase">
                Story<span className="font-light">Craft</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">AI User Story Engineering</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <div className="flex bg-gray-100 p-1 rounded-xl mr-4" dir="ltr">
                  <button onClick={() => setSummaryLang('en')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", summaryLang === 'en' ? "bg-white shadow-sm" : "text-gray-400")}>ENGLISH</button>
                  <button onClick={() => setSummaryLang('ar')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", summaryLang === 'ar' ? "bg-white shadow-sm" : "text-gray-400")}>ARABIC</button>
               </div>

               <button 
                onClick={() => {
                  setIsPrototypeMode(!isPrototypeMode);
                  setIsWizardMode(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border-2",
                  isPrototypeMode 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                )}
              >
                <Layout size={14} />
                {isPrototypeMode ? "Exit Prototype" : "Fields Prototype"}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={summaryLang === 'en' ? "USER STORY TITLE..." : "عنوان قصة المستخدم..."}
                className="w-full px-10 py-6 text-2xl font-light rounded-xl border-2 border-[#D1D1D1] focus:border-black focus:outline-none transition-all placeholder:text-gray-200"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center justify-center gap-3 px-12 py-6 bg-black text-white rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={24} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} />
                  {summaryLang === 'en' ? "Draft Story" : "صياغة القصة"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="white">
          {story && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-0"
            >
              {/* Actions & Summary Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 px-2 gap-6">
                <div className="flex items-center gap-8">
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{t.complexity}</span>
                      <div className="flex items-center gap-1.5">
                         {['Low', 'Medium', 'High'].map(l => (
                           <div key={l} className={cn("w-6 h-1 rounded-full", story.complexity === l ? "bg-black" : "bg-gray-100")} />
                         ))}
                         <span className="text-xs font-bold ml-2 uppercase italic">{story.complexity}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <button onClick={copyAll} className="flex items-center gap-2 px-6 py-4 border-2 border-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                      {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                      {copiedAll ? "Copy Full" : "Copy Full"}
                   </button>
                   <button onClick={() => exportToDocx(story, summaryLang)} className="flex items-center gap-2 px-6 py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:invert transition-all">
                      <Download size={14} />
                      Export DOCX
                   </button>
                </div>
              </div>

              {/* 1. Title Summary */}
              <Card>
                <WireframeHeader title={t.title} lang={summaryLang} icon={ClipboardList} showCopy contentToCopy={story.title[summaryLang]} />
                <EditableContent 
                  value={story.title[summaryLang]} 
                  onSave={(val) => updateStory('title', val, summaryLang)} 
                  lang={summaryLang}
                  dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Card>

              {/* 2. Description */}
              <Card>
                <WireframeHeader 
                  title={t.description} 
                  lang={summaryLang}
                  icon={FileText}
                  showCopy 
                  contentToCopy={story.description[summaryLang]}
                />
                <EditableContent 
                  value={story.description[summaryLang]} 
                  onSave={(val) => updateStory('description', val, summaryLang)} 
                  lang={summaryLang}
                  dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Card>

              {/* Workflow Section */}
              <Card>
                <div ref={workflowRef}>
                  <WireframeHeader 
                    title={t.workflow} 
                    lang={summaryLang}
                    icon={Activity} 
                    onCopyImage={copyWorkflowAsImage}
                    hideExtra={isCapturing}
                  />
                  <EditableContent 
                    isList
                    value={story.mainFlow[summaryLang]} 
                    onSave={(val) => updateStory('mainFlow', val, summaryLang)} 
                    lang={summaryLang}
                    dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </Card>

              {/* 3. Flow (Other Flows) */}
              <Card>
                <WireframeHeader 
                  title={t.flow} 
                  lang={summaryLang}
                  icon={Layers} 
                  showCopy 
                  contentToCopy={story.otherFlows[summaryLang].join('\n')} 
                />
                <EditableContent 
                  isList
                  value={story.otherFlows[summaryLang]} 
                  onSave={(val) => updateStory('otherFlows', val, summaryLang)} 
                  lang={summaryLang}
                  dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Card>

              {/* 4. Acceptance Criteria */}
              <Card>
                <WireframeHeader title={t.acceptance} lang={summaryLang} icon={ListTodo} showCopy contentToCopy={story.acceptanceCriteria[summaryLang].join('\n')} />
                <EditableContent 
                  isList
                  value={story.acceptanceCriteria[summaryLang]} 
                  onSave={(val) => updateStory('acceptanceCriteria', val, summaryLang)} 
                  lang={summaryLang}
                  dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Card>

              {/* 5. Business Rules */}
              <Card>
                <WireframeHeader title={t.business} lang={summaryLang} icon={ShieldCheck} showCopy contentToCopy={story.businessRules[summaryLang].join('\n')} />
                <EditableContent 
                  isList
                  value={story.businessRules[summaryLang]} 
                  onSave={(val) => updateStory('businessRules', val, summaryLang)} 
                  lang={summaryLang}
                  dir={summaryLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </Card>

              {/* 6. Fields */}
              <Card>
                <WireframeHeader title={t.fields} lang={summaryLang} icon={TypeIcon} showCopy contentToCopy={`MANDATORY:\n${story.mandatoryFields.join(', ')}\n\nOPTIONAL:\n${story.optionalFields.join(', ')}`} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                   <div>
                      <h5 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-8 pb-2 border-b border-red-100">{t.mandatory}</h5>
                      <EditableContent 
                        isList
                        value={story.mandatoryFields} 
                        onSave={(val) => updateStory('mandatoryFields', val)} 
                        lang={summaryLang}
                        dir="ltr"
                      />
                   </div>
                   <div>
                      <h5 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-8 pb-2 border-b border-blue-100">{t.optional}</h5>
                      <EditableContent 
                        isList
                        value={story.optionalFields} 
                        onSave={(val) => updateStory('optionalFields', val)} 
                        lang={summaryLang}
                        dir="ltr"
                      />
                   </div>
                </div>
              </Card>

              {/* 7. System Messages */}
              <Card>
                <WireframeHeader 
                  title={t.system} 
                  lang={summaryLang} 
                  icon={MessageSquare} 
                  showCopy 
                  contentToCopy={story.systemMessages.map(m => `EN: ${m.en} | AR: ${m.ar}`).join('\n')} 
                />
                <EditableSystemMessages 
                  messages={story.systemMessages}
                  onSave={(val) => updateStory('systemMessages', val)}
                  lang={summaryLang}
                />
              </Card>

              {/* Specialized Modes */}
              
              {isWizardMode && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-[#f9f9f9] border-2 border-black p-12 md:p-20 rounded-[40px] min-h-[600px] flex flex-col"
                 >
                    <div className="flex items-center justify-between mb-16" dir="ltr">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center">
                             {wizardSections[wizardStep] && React.createElement(wizardSections[wizardStep].icon, { size: 32 })}
                          </div>
                          <div>
                             <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Section {wizardStep + 1} of {wizardSections.length}</h4>
                             <h3 className="text-4xl font-light tracking-tight">{wizardSections[wizardStep]?.title}</h3>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          {wizardSections.map((_, i) => (
                             <div key={i} className={cn("w-10 h-1 rounded-full", wizardStep >= i ? "bg-black" : "bg-gray-200")} />
                          ))}
                       </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-4xl px-4">
                       <p className="text-3xl font-light text-[#333333] leading-relaxed whitespace-pre-wrap">
                          {wizardSections[wizardStep]?.content}
                       </p>
                    </div>

                    <div className="mt-20 flex gap-6" dir="ltr">
                       <button 
                         disabled={wizardStep === 0}
                         onClick={() => setWizardStep(prev => prev - 1)}
                         className="px-12 py-6 border-2 border-black font-bold uppercase tracking-widest text-xs disabled:opacity-20 hover:bg-white transition-all"
                       >
                          Back
                       </button>
                       <button 
                         onClick={() => {
                            if (wizardStep < wizardSections.length - 1) {
                               setWizardStep(prev => prev + 1);
                            } else {
                               setIsWizardMode(false);
                            }
                         }}
                         className="flex-1 py-6 bg-black text-white font-bold uppercase tracking-widest text-xs hover:invert transition-all"
                       >
                          {wizardStep === wizardSections.length - 1 ? "Finish Workflow" : "Next Section"}
                       </button>
                    </div>
                 </motion.div>
              )}

              {isPrototypeMode && (
                <div className="fixed inset-0 z-50 bg-white p-6 md:p-20 overflow-auto flex flex-col items-center" dir="ltr">
                   <div className="max-w-7xl w-full flex items-center justify-between mb-20">
                      <h3 className="text-2xl font-black italic uppercase">Fields <span className="font-light">Prototype</span></h3>
                      <div className="flex gap-4 items-center">
                         <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button onClick={() => setPrototypeView('web')} className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", prototypeView === 'web' ? "bg-white shadow-sm" : "text-gray-400")}>WEB</button>
                            <button onClick={() => setPrototypeView('mobile')} className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", prototypeView === 'mobile' ? "bg-white shadow-sm" : "text-gray-400")}>MOBILE</button>
                         </div>
                         <button onClick={() => setIsPrototypeMode(false)} className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"><Plus className="rotate-45" size={20} /></button>
                      </div>
                   </div>

                   <motion.div 
                     layout
                     className={cn(
                       "bg-white border-2 border-black shadow-[20px_20px_0px_#f0f0f0] transition-all duration-500 overflow-hidden flex flex-col",
                       prototypeView === 'mobile' ? "w-[360px] h-[800px] rounded-[40px]" : "w-full max-w-5xl h-[85vh] rounded-2xl"
                     )}
                   >
                      <div className="h-10 border-b-2 border-black flex items-center px-4 gap-2 bg-[#f9f9f5]">
                         <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full border border-black"></div>
                            <div className="w-2.5 h-2.5 rounded-full border border-black"></div>
                            <div className="w-2.5 h-2.5 rounded-full border border-black"></div>
                         </div>
                         <div className="flex-1 text-center font-mono text-[9px] text-gray-400 truncate px-10 lowercase tracking-widest">data_capture_prototype</div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-12 md:p-20 space-y-12 no-scrollbar">
                         <div className="space-y-4">
                            <h4 className="text-4xl font-light tracking-tight">Requirement Data Capture</h4>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Validating fields for {story.title.en}</p>
                         </div>

                         <div className={cn("grid gap-12", prototypeView === 'web' ? "grid-cols-2" : "grid-cols-1")}>
                            <div className="space-y-8">
                               <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Required</h5>
                               <div className="space-y-6">
                                  {story.mandatoryFields.length === 0 || story.mandatoryFields[0].toLowerCase() === 'no fields' ? (
                                    <p className="text-gray-300 italic text-sm">No mandatory fields required.</p>
                                  ) : (
                                    story.mandatoryFields.map((f, i) => (
                                      <div key={i} className="space-y-2">
                                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f} *</label>
                                          <div className="w-full h-14 border-2 border-black px-6 flex items-center text-gray-200">TYPE_{f.toUpperCase()}...</div>
                                      </div>
                                    ))
                                  )}
                               </div>
                            </div>
                            <div className="space-y-8">
                               <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Optional</h5>
                               <div className="space-y-6">
                                  {story.optionalFields.length === 0 || story.optionalFields[0].toLowerCase() === 'no fields' ? (
                                    <p className="text-gray-300 italic text-sm">No optional fields required.</p>
                                  ) : (
                                    story.optionalFields.map((f, i) => (
                                      <div key={i} className="space-y-2">
                                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f}</label>
                                          <div className="w-full h-14 border-2 border-dashed border-gray-200 px-6 flex items-center text-gray-100 italic">Optional field...</div>
                                      </div>
                                    ))
                                  )}
                               </div>
                            </div>
                         </div>

                         <div className="pt-12 border-t-2 border-black flex gap-4">
                            <button className="flex-1 h-16 bg-black text-white font-bold uppercase tracking-widest text-xs hover:invert transition-all">Submit Document</button>
                            <button className="px-10 h-16 border-2 border-black font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Cancel</button>
                         </div>
                      </div>
                   </motion.div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!story && !loading && (
          <div className="py-40 text-center space-y-8">
            <div className="inline-block p-12 border border-dashed border-gray-200 rounded-[48px]">
               <FileText size={64} className="text-gray-100" />
            </div>
            <div className="space-y-2">
               <h2 className="text-3xl font-light tracking-tight text-gray-400 uppercase">{summaryLang === 'en' ? "Your Story Starts Here" : "قصتك تبدأ هنا"}</h2>
               <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.4em]">{summaryLang === 'en' ? "Ready for requirement engineering" : "جاهز لهندسة المتطلبات"}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
