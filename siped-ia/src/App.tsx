import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  BrainCircuit, 
  ShieldCheck, 
  BarChart3, 
  MessageSquarePlus, 
  Sparkles,
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FileSearch
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Inicialización de Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Tipos para nuestro prototipo
interface Student {
  id: string;
  name: string;
  participation: number;
  performance: number;
  lastObservation: string;
  status: 'atenta' | 'estable' | 'destacable';
}

const mockStudents: Student[] = [
  { id: "1", name: "Jaqueline Mollinedo", participation: 85, performance: 92, lastObservation: "Liderazgo positivo en grupos.", status: 'destacable' },
  { id: "2", name: "Mateo Tapia", participation: 45, performance: 68, lastObservation: "Dificultad en comprensión lectora.", status: 'atenta' },
  { id: "3", name: "Miriam Zambrana", participation: 72, performance: 75, lastObservation: "Participación constante en clase.", status: 'estable' },
];

export default function App() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [observation, setObservation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    if (!selectedStudent || !observation) return;
    
    setIsGenerating(true);
    setRecommendation(null);

    try {
      const prompt = `
        ANALIZAR PERFIL ESTUDIANTIL Y GENERAR RECOMENDACIÓN PEDAGÓGICA (SIPED-IA)
        
        Estudiante: ${selectedStudent.name}
        Rendimiento Académico: ${selectedStudent.performance}%
        Frecuencia de Participación: ${selectedStudent.participation}%
        Observación del Docente: "${observation}"
        
        Por favor, genera una recomendación profesional siguiendo esta estructura:
        1. RUTA DE INTERVENCIÓN: Acciones concretas de enseñanza.
        2. APOYO SOCIOEMOCIONAL: Estrategias para el bienestar del niño.
        3. INTEGRACIÓN TPACK: Herramientas tecnológicas sugeridas para este caso.
        
        Usa un tono empático, profesional y alineado con los valores del Colegio La Salle.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "Eres SIPED-IA, un asistente experto en pedagogía para el nivel primario del Colegio La Salle La Paz. Tu objetivo es ayudar a los docentes a tomar decisiones basadas en datos y observaciones cualitativas, alineadas con el marco ético de la UNESCO.",
          temperature: 0.7,
        }
      });

      setRecommendation(response.text || "No se pudo generar la recomendación.");
    } catch (error) {
      console.error("Error al llamar a Gemini:", error);
      setRecommendation("Error de conexión con la IA. Por favor, revisa la configuración del API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Barra de Navegación SIPED-IA */}
      <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#004A99] p-2 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none text-[#004A99]">SIPED-IA</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mt-1">Colegio La Salle La Paz</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full text-xs font-bold text-green-700 border border-green-100">
            <ShieldCheck className="w-4 h-4" />
            Marco Ético UNESCO Activo
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Columna Izquierda: Dashboard de Patrones */}
        <section className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Patrones</h2>
              <p className="text-sm text-neutral-400 font-medium">Nivel Primario</p>
            </div>
            <FileSearch className="w-6 h-6 text-neutral-300" />
          </div>

          <div className="space-y-4">
            {mockStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student);
                  setRecommendation(null);
                  setObservation("");
                }}
                className={`w-full text-left p-5 rounded-[2rem] border transition-all duration-300 group ${
                  selectedStudent?.id === student.id 
                    ? 'bg-white border-[#004A99] shadow-[0_20px_50px_rgba(0,74,153,0.1)] ring-1 ring-[#004A99]/5' 
                    : 'bg-white border-neutral-100 hover:border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-bold text-lg text-neutral-700">{student.name}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    student.status === 'atenta' ? 'bg-red-50 text-red-500' : 
                    student.status === 'destacable' ? 'bg-green-50 text-green-500' : 'bg-yellow-50 text-yellow-500'
                  }`}>
                    {student.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 bg-neutral-50/50 p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] uppercase text-neutral-400 font-bold mb-1 tracking-wider">Rendimiento</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-neutral-700">{student.performance}%</span>
                      {student.performance > 80 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-neutral-400 font-bold mb-1 tracking-wider">Participación</p>
                    <span className="font-mono text-base font-bold text-neutral-700">{student.participation}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Columna Central: Análisis Pedagógico */}
        <section className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                {/* Panel de Datos Docente */}
                <div className="bg-white p-10 rounded-[3rem] border border-neutral-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                      <h2 className="text-4xl font-black text-neutral-800 tracking-tight mb-2">{selectedStudent.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-neutral-400 font-medium font-mono">
                        <span>ID: SIPED-{selectedStudent.id}00</span>
                        <span>•</span>
                        <span>06 MAYO 2026</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 max-w-sm">
                       <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest flex items-center gap-2">
                         <Info className="w-3 h-3" /> Estado Actual
                       </p>
                       <p className="text-sm font-serif italic text-neutral-600">"{selectedStudent.lastObservation}"</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-sm font-bold flex items-center gap-2 text-neutral-600 uppercase tracking-widest">
                      <MessageSquarePlus className="w-5 h-5 text-[#004A99]" />
                      Nueva Observación Cualitativa
                    </label>
                    <textarea 
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      placeholder="Ingrese detalles del desempeño, conducta o hitos de aprendizaje..."
                      className="w-full h-40 p-6 rounded-[2rem] border border-neutral-200 focus:ring-4 focus:ring-[#004A99]/5 focus:border-[#004A99] outline-none transition-all resize-none bg-neutral-50/50 text-lg"
                    />
                    <button 
                      onClick={handleGenerateAI}
                      disabled={isGenerating || !observation}
                      className="w-full bg-[#004A99] text-white font-bold py-5 rounded-[2rem] hover:bg-[#003366] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_30px_rgba(0,74,153,0.2)]"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Procesando Patrones Pedagógicos...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          Generar Recomendación con Arquitectura Transformer
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Resultado de la IA */}
                {recommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-neutral-200 rounded-[3rem] overflow-hidden shadow-2xl relative"
                  >
                    <div className="bg-[#004A99] p-5 flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-[0.2em]">Asistente SIPED-IA</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">
                        Alpha v1.2
                      </div>
                    </div>
                    <div className="p-10 md:p-14">
                      <div className="prose prose-blue max-w-none">
                        <div className="whitespace-pre-line text-neutral-800 text-xl leading-relaxed font-serif">
                          {recommendation}
                        </div>
                      </div>
                      <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest text-center md:text-left">
                          <AlertCircle className="w-5 h-5 text-yellow-500" /> 
                          Supervisión Humana Requerida: El docente valida el resultado
                        </div>
                        <button className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-black transition-colors">
                          Aplicar Plan <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border-2 border-dashed border-neutral-100">
                <div className="bg-blue-50 p-8 rounded-full mb-8">
                  <BarChart3 className="w-16 h-16 text-blue-200" />
                </div>
                <h3 className="text-2xl font-black text-neutral-800 tracking-tight">Seleccione un Perfil Estudiantil</h3>
                <p className="text-neutral-400 text-sm max-w-xs mt-3 leading-relaxed font-medium">
                  Identifique patrones y genere rutas de intervención personalizadas basadas en evidencia y ética IA.
                </p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer SIPED-IA */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-neutral-400">
            <BrainCircuit className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-600">SIPED-IA</span>
              <span className="text-[10px] font-bold">Inteligencia Pedagógica La Salle</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2">Marco Ético</p>
              <p className="text-xs font-bold text-neutral-600">UNESCO (2021)</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2">Arquitectura</p>
              <p className="text-xs font-bold text-neutral-600">Transformer / LLM</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2">Enfoque</p>
              <p className="text-xs font-bold text-neutral-600">Modelo TPACK</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
