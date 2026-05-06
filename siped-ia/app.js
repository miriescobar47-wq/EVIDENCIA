const mockStudents = [
  { id: "1", name: "Jaqueline Mollinedo", participation: 85, performance: 92, lastObservation: "Liderazgo positivo en grupos.", status: 'destacable' },
  { id: "2", name: "Mateo Tapia", participation: 45, performance: 68, lastObservation: "Dificultad en comprensión lectora.", status: 'atenta' },
  { id: "3", name: "Miriam Zambrana", participation: 72, performance: 75, lastObservation: "Participación constante en clase.", status: 'estable' },
];

let selectedStudent = null;
const mainApp = document.getElementById("main-app");
const studentList = document.getElementById("student-list");
const studentDetail = document.getElementById("student-detail");
const resultSection = document.getElementById("result-section");
const recommendationText = document.getElementById("recommendation-text");

// Initialization
function init() {
  renderStudents();
  renderDetail();
}



// Render students list
function renderStudents() {
  studentList.innerHTML = "";
  mockStudents.forEach(student => {
    const isSelected = selectedStudent && selectedStudent.id === student.id;
    const btn = document.createElement("button");
    btn.className = `w-full text-left p-5 rounded-[2rem] border transition-all duration-300 group ${
      isSelected 
        ? 'bg-white border-[#004A99] shadow-[0_20px_50px_rgba(0,74,153,0.1)] ring-1 ring-[#004A99]/5' 
        : 'bg-white border-neutral-100 hover:border-neutral-200 shadow-sm'
    }`;
    
    let statusClass = "bg-yellow-50 text-yellow-500";
    if (student.status === 'atenta') statusClass = 'bg-red-50 text-red-500';
    if (student.status === 'destacable') statusClass = 'bg-green-50 text-green-500';

    let perfIcon = student.performance > 80 
      ? '<i data-lucide="trending-up" class="w-4 h-4 text-green-500"></i>' 
      : '<i data-lucide="trending-down" class="w-4 h-4 text-red-500"></i>';

    btn.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            ${student.name.charAt(0)}
          </div>
          <span class="font-bold text-lg text-neutral-700">${student.name}</span>
        </div>
        <div class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}">
          ${student.status}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-6 bg-neutral-50/50 p-4 rounded-2xl">
        <div>
          <p class="text-[10px] uppercase text-neutral-400 font-bold mb-1 tracking-wider">Rendimiento</p>
          <div class="flex items-center gap-2">
            <span class="font-mono text-base font-bold text-neutral-700">${student.performance}%</span>
            ${perfIcon}
          </div>
        </div>
        <div>
          <p class="text-[10px] uppercase text-neutral-400 font-bold mb-1 tracking-wider">Participación</p>
          <span class="font-mono text-base font-bold text-neutral-700">${student.participation}%</span>
        </div>
      </div>
    `;

    btn.onclick = () => {
      selectedStudent = student;
      resultSection.classList.add("hidden");
      renderStudents();
      renderDetail();
      lucide.createIcons();
    };
    studentList.appendChild(btn);
  });
}

function renderDetail() {
  if (!selectedStudent) {
    studentDetail.innerHTML = `
      <div class="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border-2 border-dashed border-neutral-100">
        <div class="bg-blue-50 p-8 rounded-full mb-8">
          <i data-lucide="bar-chart-3" class="w-16 h-16 text-blue-200"></i>
        </div>
        <h3 class="text-2xl font-black text-neutral-800 tracking-tight">Seleccione un Perfil Estudiantil</h3>
        <p class="text-neutral-400 text-sm max-w-xs mt-3 leading-relaxed font-medium">
          Identifique patrones y genere rutas de intervención personalizadas basadas en evidencia y ética IA.
        </p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Detalle del estudiante
  studentDetail.innerHTML = `
    <div class="bg-white p-10 rounded-[3rem] border border-neutral-200 shadow-sm relative overflow-hidden mb-8">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16"></div>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 class="text-4xl font-black text-neutral-800 tracking-tight mb-2">${selectedStudent.name}</h2>
          <div class="flex items-center gap-4 text-sm text-neutral-400 font-medium font-mono">
            <span>ID: SIPED-${selectedStudent.id}00</span>
            <span>•</span>
            <span>06 MAYO 2026</span>
          </div>
        </div>
        <div class="bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 max-w-sm">
            <p class="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest flex items-center gap-2">
              <i data-lucide="info" class="w-3 h-3"></i> Estado Actual
            </p>
            <p class="text-sm font-serif italic text-neutral-600">"${selectedStudent.lastObservation}"</p>
        </div>
      </div>

      <div class="space-y-6">
        <label class="text-sm font-bold flex items-center gap-2 text-neutral-600 uppercase tracking-widest">
          <i data-lucide="message-square-plus" class="w-5 h-5 text-[#004A99]"></i>
          Nueva Observación Cualitativa
        </label>
        <textarea id="obs-input" placeholder="Ingrese detalles del desempeño, conducta o hitos de aprendizaje..." class="w-full h-40 p-6 rounded-[2rem] border border-neutral-200 focus:ring-4 focus:ring-[#004A99]/5 focus:border-[#004A99] outline-none transition-all resize-none bg-neutral-50/50 text-lg"></textarea>
        
        <button id="gen-btn" class="w-full bg-[#004A99] text-white font-bold py-5 rounded-[2rem] hover:bg-[#003366] transition-all flex items-center justify-center gap-4 shadow-[0_15px_30px_rgba(0,74,153,0.2)]">
          <i data-lucide="sparkles" class="w-6 h-6"></i> Generar Recomendación con Arquitectura Transformer
        </button>
      </div>
    </div>
  `;
  
  lucide.createIcons();
  
  const obsInput = document.getElementById("obs-input");
  const genBtn = document.getElementById("gen-btn");

  genBtn.onclick = async () => {
    const text = obsInput.value.trim();
    if (!text) return;
    
    // UI state
    genBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full loader"></div> Procesando Patrones Pedagógicos...`;
    genBtn.disabled = true;
    genBtn.classList.add("opacity-50", "cursor-not-allowed");
    
    try {
      // Simular retraso de red de la IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendation = `**1. RUTA DE INTERVENCIÓN:**
- Implementar aprendizaje basado en proyectos (ABP) integrando los intereses de ${selectedStudent.name}.
- Asignar roles de tutoría entre pares para fortalecer la empatía y trabajo colaborativo.
- Fomentar la participación en debates estructurados.

**2. APOYO SOCIOEMOCIONAL:**
- Reconocer positivamente sus contribuciones tanto en público como en privado.
- Trabajar la tolerancia a la frustración mediante dinámicas grupales cortas.
- Mantener comunicación constante con la familia para alinear estrategias.

**3. INTEGRACIÓN TPACK:**
- **Tecnología:** Uso de plataformas colaborativas visuales (ej. Padlet, Jamboard).
- **Pedagogía:** Metodología de aula invertida (Flipped Classroom).
- **Contenido:** Investigaciones guiadas sobre el temario actual con recursos interactivos.`;

      recommendationText.innerText = mockRecommendation;
      resultSection.classList.remove("hidden");
    } catch (e) {
      recommendationText.innerText = "Error de simulación.";
      resultSection.classList.remove("hidden");
    } finally {
      genBtn.innerHTML = `<i data-lucide="sparkles" class="w-6 h-6"></i> Generar Recomendación con Arquitectura Transformer`;
      genBtn.disabled = false;
      genBtn.classList.remove("opacity-50", "cursor-not-allowed");
      lucide.createIcons();
    }
  };
}

init();
lucide.createIcons();
