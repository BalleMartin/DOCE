/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DOCE - Portal de Tutorías y Panel Docente IFTS N.º 12
 * Catálogo Oficial de Mockups Definitivos:
 * - Pantalla 5: Dashboard de Tutorías (Vista Institucional)
 * - Pantalla 6: Panel Docente por Materia (Inteligencia Artificial)
 * "Una identidad cercana y adulta · Tu acompañamiento a medida"
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Calendar,
  FileCheck,
  Filter,
  Send,
  MessageCircle,
  Eye,
  X,
  Sliders,
  Users,
  Settings,
  HelpCircle,
  Compass,
  BookOpen,
  AlertTriangle,
  FileText,
  Sparkles,
  Copy,
  Check,
  BarChart2,
  Layers,
  ChevronRight,
  CalendarPlus,
} from 'lucide-react';
import {
  Tutor,
  Alerta,
  IntervencionPedagogica,
  Estudiante,
  PrediccionRiesgo,
} from '../domain/models.js';

interface TutorViewProps {
  tutor: Tutor;
  alertas: Alerta[];
  estudiantes: Estudiante[];
  predicciones: PrediccionRiesgo[];
  intervenciones: IntervencionPedagogica[];
  onRegistrarIntervencion: (
    alerta: Alerta,
    tipo: string,
    acuerdos: string,
    observaciones: string,
    fechaSeguimiento: string
  ) => void;
  onNotificarTutoria: (alerta: Alerta) => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  tutor,
  alertas,
  estudiantes,
  predicciones,
  intervenciones,
  onRegistrarIntervencion,
  onNotificarTutoria,
}) => {
  // Navegación entre Pantalla 5 (Dashboard Institucional) y Pantalla 6 (Panel Docente por Materia)
  const [subPantalla, setSubPantalla] = useState<'pantalla5' | 'pantalla6'>('pantalla5');

  // Filtros y estados de Pantalla 5
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'pendientes' | 'atendidas'>('todas');
  const [alertaSeleccionadaParaIntervencion, setAlertaSeleccionadaParaIntervencion] = useState<Alerta | null>(null);
  const [modalAjusteIA, setModalAjusteIA] = useState(false);
  const [umbralAlerta, setUmbralAlerta] = useState(65);
  const [modalTaller, setModalTaller] = useState(false);
  const [temaTaller, setTemaTaller] = useState('Redes Neuronales & Backpropagation');
  const [tallerConfirmado, setTallerConfirmado] = useState(false);

  // Formulario modal de intervención (Pantalla 5)
  const [tipoIntervencion, setTipoIntervencion] = useState('Plan de contingencia laboral');
  const [acuerdos, setAcuerdos] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaSeguimiento, setFechaSeguimiento] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );

  // Estados de Pantalla 6 (Panel Docente por Materia)
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('Inteligencia Artificial');
  const [temaDificultadActivo, setTemaDificultadActivo] = useState<string>('Redes Neuronales');
  const [modalGenerarMaterial, setModalGenerarMaterial] = useState(false);
  const [modalAjustarFecha, setModalAjustarFecha] = useState(false);
  const [materialGeneradoTexto, setMaterialGeneradoTexto] = useState<string | null>(null);
  const [copiadoMaterial, setCopiadoMaterial] = useState(false);
  const [nuevaFechaParcial, setNuevaFechaParcial] = useState('2026-11-28');
  const [motivoProrroga, setMotivoProrroga] = useState(
    'Extensión preventiva de 7 días por sobrecarga laboral de fin de cuatrimestre detectada en cohorte.'
  );
  const [prorrogaConfirmada, setProrrogaConfirmada] = useState(false);

  const alertasFiltradas = alertas.filter((a) => {
    if (filtroEstado === 'pendientes') return a.estado === 'Pendiente';
    if (filtroEstado === 'atendidas') return a.estado === 'Atendida';
    return true;
  });

  const totalPendientes = alertas.filter((a) => a.estado === 'Pendiente').length;
  const totalAtendidas = alertas.filter((a) => a.estado === 'Atendida').length;

  const handleAbrirModal = (alerta: Alerta) => {
    setAlertaSeleccionadaParaIntervencion(alerta);
    const estudianteRel = estudiantes.find((e) => e.id_usuario === alerta.estudiante_id);
    setAcuerdos(
      `Se acordó flexibilización de entrega de TP de Inteligencia Artificial y participación en taller de apoyo asincrónico.`
    );
    setObservaciones(
      `Estudiante ${estudianteRel?.nombre || alerta.estudiante_codigo_anonimizado} manifiesta alta motivación técnica pero sobrecarga por jornada de trabajo extensa y viaje diario.`
    );
  };

  const handleConfirmarIntervencion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertaSeleccionadaParaIntervencion) return;

    onRegistrarIntervencion(
      alertaSeleccionadaParaIntervencion,
      tipoIntervencion,
      acuerdos,
      observaciones,
      fechaSeguimiento
    );

    setAlertaSeleccionadaParaIntervencion(null);
  };

  const handleGenerarGuiaDoc = () => {
    const guia = `# DOCE · Guía de Refuerzo Asincrónico: Redes Neuronales & Backpropagation
**Materia:** Inteligencia Artificial · IFTS N.º 12  
**Autor:** Cátedra con Asistencia Pedagógica DOCE  
**Duración estimada:** 45 minutos (Formato micro-aprendizaje)

---

## 1. Núcleo Conceptual en 3 Minutos
Una red neuronal artificial no "aprende magia", sino que ajusta pesos sinápticos $(W)$ para minimizar el error entre la predicción y el valor real mediante derivadas parciales.

* **Forward Pass:** La entrada $X$ viaja por las capas: $Z = W \\cdot X + b$, luego se aplica activación $\\sigma(Z)$ (ReLU, Sigmoide).
* **Función de Pérdida ($L$):** Cuantifica qué tan lejos estuvo la salida (p. ej., MSE o Binary Cross-Entropy).
* **Backpropagation:** Aplica la **Regla de la Cadena** desde la salida hacia atrás para calcular $\\frac{\\partial L}{\\partial W}$, permitiendo actualizar: $W \\leftarrow W - \\alpha \\frac{\\partial L}{\\partial W}$.

---

## 2. Ejercicio Práctico Guiado (Python & NumPy)
\`\`\`python
import numpy as np

# 1. Función de activación Sigmoide y su derivada
def sigmoide(x):
    return 1 / (1 + np.exp(-x))

def sigmoide_derivada(x):
    s = sigmoide(x)
    return s * (1 - s)

# 2. Paso hacia adelante y gradiente básico
X = np.array([[0.5, 0.8]])
y_real = np.array([[1.0]])
W = np.random.randn(2, 1)

# Forward
y_pred = sigmoide(np.dot(X, W))
error = y_pred - y_real

# Backward simple (Gradiente)
grad = np.dot(X.T, error * sigmoide_derivada(y_pred))
tasa_aprendizaje = 0.1
W -= tasa_aprendizaje * grad

print("Pesos actualizados:", W)
\`\`\`

---

## 3. Rúbrica de Autoevaluación
- [ ] ¿Entendés por qué ReLU evita el desvanecimiento de gradiente frente a Sigmoide?
- [ ] ¿Podés explicar en tus palabras la regla de la cadena para 2 capas ocultas?
- [ ] Envía tus dudas al Asistente DOC con la etiqueta \`#DudaRedes\` en el campus.`;

    setMaterialGeneradoTexto(guia);
    setModalGenerarMaterial(true);
  };

  const copiarAlPortapapeles = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoMaterial(true);
    setTimeout(() => setCopiadoMaterial(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Selector de Pantallas del Rol Docente/Tutor (Pantalla 5 vs Pantalla 6) */}
      <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-[#586879] uppercase tracking-wider">Vistas de Acompañamiento:</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSubPantalla('pantalla5')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shadow-xs cursor-pointer ${
                subPantalla === 'pantalla5'
                  ? 'bg-[#263A50] text-[#FAF8F1]'
                  : 'bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#263A50]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#819783]" />
              <span>Pantalla 5: Dashboard de Tutorías (Cohorte)</span>
            </button>

            <button
              onClick={() => setSubPantalla('pantalla6')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shadow-xs cursor-pointer ${
                subPantalla === 'pantalla6'
                  ? 'bg-[#263A50] text-[#FAF8F1]'
                  : 'bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#263A50]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#819783]" />
              <span>Pantalla 6: Panel Docente por Materia</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PANTALLA 5: DASHBOARD DE TUTORÍAS (VISTA INSTITUCIONAL IFTS 12) */}
      {/* ============================================================== */}
      {subPantalla === 'pantalla5' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Editorial con Tipografía Domine */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1.5 rounded-lg bg-[#EBF1EC] text-[#819783]">
                    <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#263A50] tracking-tight">
                    DOCE · Dashboard de Tutorías IFTS N.º 12
                  </h1>
                  <span className="w-2 h-2 rounded-full bg-[#819783]" />
                </div>
                <p className="text-xs sm:text-sm text-[#586879]">
                  Pantalla 5 · Seguimiento Institucional de Cohorte y Factores Socio-Laborales · {tutor.nombre} ({tutor.especialidad})
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] text-[#263A50] font-medium shadow-xs">
                  Ciclo Lectivo 2026 / 2027 · Cohorte Protegida
                </span>
              </div>
            </div>
          </div>

          {/* DASHBOARD DE ESTADÍSTICAS DE COHORTE */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5DFD3]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#263A50] flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                  <span>Seguimiento de Permanencia y Factores de Carga</span>
                </h2>
                <p className="text-xs text-[#586879] mt-0.5">
                  Indicadores agrupados para orientar intervenciones pedagógicas tempranas sin etiquetar estudiantes.
                </p>
              </div>

              <span className="text-[11px] font-mono text-[#263A50] bg-[#EEE7D7] px-3 py-1 rounded-full border border-[#DDD4C0]">
                Fuente: SIU Guaraní & Red Neuronal DOCE
              </span>
            </div>

            {/* Dos Paneles Principales: Factores de Retención + Resumen Red Neural */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Indicadores de Retención (col-7) */}
              <div className="lg:col-span-7 bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#263A50] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#819783]" />
                    <span>Factores de Carga en la Cohorte</span>
                  </span>
                  <span className="text-[#586879] text-[11px]">Porcentaje sobre casos con seguimiento sugerido</span>
                </div>

                {/* Barras con colores de la paleta adulta */}
                <div className="space-y-3.5 pt-2">
                  {/* Demoras académicas: 82.3% */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#263A50] font-medium">Demoras académicas en entregas (carga laboral)</span>
                      <span className="font-mono font-bold text-[#B85D43]">82.3%</span>
                    </div>
                    <div className="w-full bg-[#E5DFD3] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#B85D43] h-full rounded-full transition-all duration-1000" style={{ width: '82.3%' }} />
                    </div>
                  </div>

                  {/* Inasistencias frecuentes: 53.8% */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#263A50] font-medium">Inasistencias justificadas por turnos rotativos (&gt;25%)</span>
                      <span className="font-mono font-bold text-[#B8863A]">53.8%</span>
                    </div>
                    <div className="w-full bg-[#E5DFD3] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#B8863A] h-full rounded-full transition-all duration-1000" style={{ width: '53.8%' }} />
                    </div>
                  </div>

                  {/* Baja actividad en campus virtual: 38.3% */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#263A50] font-medium">Baja actividad en campus virtual</span>
                      <span className="font-mono font-bold text-[#819783]">38.3%</span>
                    </div>
                    <div className="w-full bg-[#E5DFD3] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#819783] h-full rounded-full transition-all duration-1000" style={{ width: '38.3%' }} />
                    </div>
                  </div>

                  {/* Otros factores: 28.9% */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#263A50] font-medium">Traslado excesivo en transporte CABA/AMBA</span>
                      <span className="font-mono font-bold text-[#263A50]">28.9%</span>
                    </div>
                    <div className="w-full bg-[#E5DFD3] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#263A50] h-full rounded-full transition-all duration-1000" style={{ width: '28.9%' }} />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#586879] pt-2 border-t border-[#E5DFD3]">
                  💡 La correlación entre demoras de entrega y sobrecarga de viaje AMBA es de <strong>r = 0.74</strong>.
                </div>
              </div>

              {/* Gráfico de Red Neural: Resumen de Clasificación (col-5) */}
              <div className="lg:col-span-5 bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#263A50] uppercase tracking-wider">
                    Inferencia de Red Neuronal Predictiva
                  </span>
                  <span className="text-[#819783] font-mono text-[11px] font-semibold">v2.4-ANN</span>
                </div>

                {/* Neural Topology Visualization */}
                <div className="bg-[#FFFFFF] rounded-xl p-3 border border-[#E5DFD3] flex items-center justify-center">
                  <svg viewBox="0 0 240 120" className="w-full h-28">
                    <line x1="40" y1="30" x2="120" y2="40" stroke="#E5DFD3" strokeWidth="1.5" />
                    <line x1="40" y1="30" x2="120" y2="80" stroke="#E5DFD3" strokeWidth="1.5" />
                    <line x1="40" y1="60" x2="120" y2="40" stroke="#819783" strokeWidth="2" />
                    <line x1="40" y1="60" x2="120" y2="80" stroke="#E5DFD3" strokeWidth="1.5" />
                    <line x1="40" y1="90" x2="120" y2="40" stroke="#E5DFD3" strokeWidth="1.5" />
                    <line x1="40" y1="90" x2="120" y2="80" stroke="#263A50" strokeWidth="2" />

                    <line x1="120" y1="40" x2="200" y2="60" stroke="#819783" strokeWidth="2.5" />
                    <line x1="120" y1="80" x2="200" y2="60" stroke="#263A50" strokeWidth="2.5" />

                    <circle cx="40" cy="30" r="7" fill="#263A50" />
                    <circle cx="40" cy="60" r="7" fill="#263A50" />
                    <circle cx="40" cy="90" r="7" fill="#263A50" />

                    <circle cx="120" cy="40" r="8" fill="#819783" />
                    <circle cx="120" cy="80" r="8" fill="#819783" />

                    <circle cx="200" cy="60" r="9" fill="#B85D43" />
                  </svg>
                </div>

                {/* Caja de Cohorte */}
                <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl p-3 text-center space-y-1">
                  <div className="text-xs font-bold text-[#263A50]">
                    Estudiantes en Seguimiento Preventivo: ~25% de la cohorte
                  </div>
                  <p className="text-[10px] text-[#586879]">
                    Identificados para acompañamiento temprano sin impacto sancionatorio en su legajo oficial.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel de Intervención Activa */}
            <div className="pt-4 border-t border-[#E5DFD3] bg-[#FAF8F1] p-4 rounded-xl border border-[#E5DFD3]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#263A50] uppercase tracking-wider">
                    Panel de Intervención Activa (Tutoría Institucional)
                  </div>
                  <div className="text-[11px] text-[#586879]">
                    Acciones de mediación pedagógica directa para la cohorte activa.
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setModalAjusteIA(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-xs font-semibold text-[#263A50] transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#819783]" />
                    <span>Ajustar Recomendaciones de IA</span>
                  </button>

                  <button
                    onClick={() => setModalTaller(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-xs font-semibold text-white transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Programar Taller de Apoyo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Banner DOC Asistente Docente */}
            <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-4 flex items-start space-x-3 text-xs">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#E5DFD3] bg-white">
                <img
                  src="/assets/aistudio/f32080f4-f26f-4530-9c76-16413cf9c53e_3d3d1ea7.png"
                  alt="DOC"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-bold text-[#263A50] flex items-center space-x-2">
                  <span>DOC Asistente Pedagógico para Docentes:</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EBF1EC] text-[#819783] font-mono">
                    IA Supervisada
                  </span>
                </div>
                <p className="text-[#586879] leading-relaxed">
                  “Detecté demoras en el tema <strong>Redes Neuronales</strong> en el 35% de la cursada. ¿Querés que genere una guía de ejercicios adicionales de refuerzo o un micro-desglose conceptual para el campus?”
                </p>
              </div>
              <button
                onClick={handleGenerarGuiaDoc}
                className="px-3.5 py-2 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white font-semibold text-xs shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                Generar Guía de Refuerzo
              </button>
            </div>
          </div>

          {/* BANDEJA DE ALERTAS TEMPRANAS */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DFD3]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#263A50] flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                  <span>Bandeja de Acompañamiento Pedagógico Prioritario</span>
                </h2>
                <p className="text-xs text-[#586879] mt-0.5">
                  Generadas de forma automática cuando el índice de riesgo predictivo supera el {umbralAlerta}%.
                </p>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#EEE7D7]/70 p-1 rounded-xl border border-[#E2DBCF] text-xs">
                <button
                  onClick={() => setFiltroEstado('todas')}
                  className={`px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    filtroEstado === 'todas'
                      ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                      : 'text-[#586879] hover:text-[#263A50]'
                  }`}
                >
                  Todas ({alertas.length})
                </button>
                <button
                  onClick={() => setFiltroEstado('pendientes')}
                  className={`px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    filtroEstado === 'pendientes'
                      ? 'bg-[#B85D43] text-white shadow-xs'
                      : 'text-[#586879] hover:text-[#263A50]'
                  }`}
                >
                  Pendientes ({totalPendientes})
                </button>
                <button
                  onClick={() => setFiltroEstado('atendidas')}
                  className={`px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    filtroEstado === 'atendidas'
                      ? 'bg-[#819783] text-white shadow-xs'
                      : 'text-[#586879] hover:text-[#263A50]'
                  }`}
                >
                  Atendidas ({totalAtendidas})
                </button>
              </div>
            </div>

            {/* List of Alerts */}
            <div className="space-y-4">
              {alertasFiltradas.length === 0 ? (
                <div className="text-center py-12 text-[#586879] text-xs">
                  No hay alertas con el filtro seleccionado.
                </div>
              ) : (
                alertasFiltradas.map((alerta) => {
                  const estudianteRel = estudiantes.find((e) => e.id_usuario === alerta.estudiante_id);
                  const intervencionRel = intervenciones.find(
                    (i) => i.id_intervencion === alerta.intervencion_asociada_id
                  );
                  const esPendiente = alerta.estado === 'Pendiente';

                  return (
                    <div
                      key={alerta.id_alerta}
                      className={`bg-[#FAF8F1] border rounded-xl p-4.5 transition-all space-y-4 ${
                        esPendiente ? 'border-[#B85D43]/40 shadow-xs' : 'border-[#E5DFD3]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              esPendiente ? 'bg-[#F9EFEB] text-[#B85D43]' : 'bg-[#EBF1EC] text-[#819783]'
                            }`}
                          >
                            {esPendiente ? (
                              <Clock className="w-5 h-5 stroke-[1.75]" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 stroke-[1.75]" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-[#263A50]">
                                {alerta.estudiante_codigo_anonimizado}
                              </span>
                              {estudianteRel && (
                                <span className="text-xs text-[#586879] font-medium">
                                  ({estudianteRel.nombre})
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  esPendiente
                                    ? 'bg-[#F9EFEB] text-[#B85D43] border-[#B85D43]/30'
                                    : 'bg-[#EBF1EC] text-[#819783] border-[#819783]/30'
                                }`}
                              >
                                {esPendiente ? 'Coordinación pendiente' : 'Acuerdo registrado'}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#586879] mt-0.5">
                              Generada: {new Date(alerta.fecha_generacion).toLocaleString()} · Tecnicatura en Ciencia de Datos e IA
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onNotificarTutoria(alerta)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#263A50] text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-[#819783]" />
                            <span>Notificar</span>
                          </button>

                          {esPendiente ? (
                            <button
                              onClick={() => handleAbrirModal(alerta)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#263A50] hover:bg-[#1A2837] text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Registrar Intervención</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#819783] flex items-center space-x-1 px-2.5 py-1 rounded bg-[#EBF1EC] border border-[#819783]/30">
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                              <span>Intervención Completada</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FFFFFF] rounded-xl p-3 border border-[#E5DFD3] space-y-2">
                        <div className="text-xs font-medium text-[#263A50]">
                          <strong>Motivo de Acompañamiento:</strong> {alerta.motivo_principal}
                        </div>

                        {alerta.factores_resumen.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {alerta.factores_resumen.map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF8F1] text-[#263A50] border border-[#E5DFD3]"
                              >
                                · {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {intervencionRel && (
                        <div className="bg-[#EBF1EC]/60 border border-[#819783]/30 rounded-xl p-3 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[#819783] font-semibold text-[11px]">
                            <span>📋 Acuerdo Registrado: {intervencionRel.tipo_intervencion}</span>
                            <span>Seguimiento: {intervencionRel.fecha_seguimiento}</span>
                          </div>
                          <div className="text-[#263A50] text-[11px]">
                            <strong>Acuerdos alcanzados:</strong> {intervencionRel.acuerdos_alcanzados}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* PANTALLA 6: PANEL DOCENTE POR MATERIA (CATÁLOGO OFICIAL DE MOCKUPS)     */}
      {/* ====================================================================== */}
      {subPantalla === 'pantalla6' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Mockup 6: DOCE - IFTS Nº 12 | Vista Docente - Materia: Inteligencia Artificial */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1.5 rounded-lg bg-[#EBF1EC] text-[#819783]">
                    <BookOpen className="w-5 h-5 stroke-[1.75]" />
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#263A50] tracking-tight">
                    DOCE - IFTS Nº 12 | Vista Docente
                  </h1>
                  <span className="w-2 h-2 rounded-full bg-[#819783]" />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#586879]">
                  <span className="font-semibold text-[#263A50]">Materia: {materiaSeleccionada}</span>
                  <span>·</span>
                  <span>Cátedra: Prof. Lic. Valeria Morales</span>
                  <span>·</span>
                  <span className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#E5DFD3]">
                    Comisión A · 42 Estudiantes Activos
                  </span>
                </div>
              </div>

              {/* Selector de Materias del Docente */}
              <div className="flex items-center space-x-2 text-xs">
                <select
                  value={materiaSeleccionada}
                  onChange={(e) => setMateriaSeleccionada(e.target.value)}
                  className="bg-[#FAF8F1] border border-[#E5DFD3] text-[#263A50] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="Inteligencia Artificial">Inteligencia Artificial (Semestre 2)</option>
                  <option value="Modelado de Datos">Modelado de Datos (Semestre 2)</option>
                  <option value="Algoritmos y Estructuras">Algoritmos y Estructuras (Semestre 1)</option>
                </select>
              </div>
            </div>
          </div>

          {/* TARJETA 1: AVANCE DEL CURSO (35% completado vs 50% según cronograma) */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5DFD3]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#263A50] flex items-center space-x-2">
                  <BarChart2 className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                  <span>Avance del Curso · Cronograma vs. Real</span>
                </h2>
                <p className="text-xs text-[#586879] mt-0.5">
                  Comparativa de progreso curricular de la cursada en relación al calendario del semestre.
                </p>
              </div>

              <span className="text-[11px] font-mono font-bold text-[#B85D43] bg-[#F9EFEB] px-3 py-1 rounded-full border border-[#B85D43]/30">
                Retraso detectado: 2 semanas
              </span>
            </div>

            {/* Barra Comparativa Visual */}
            <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-[#263A50] text-sm">
                    35% completado <span className="font-normal text-[#586879]">vs</span> 50% según cronograma
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#819783]" />
                    <span className="text-[#586879]">Avance Real de Alumnos (35%)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#DDD4C0]" />
                    <span className="text-[#586879]">Cronograma Oficial (50%)</span>
                  </div>
                </div>
              </div>

              {/* Contenedor de barras */}
              <div className="relative pt-2 pb-6">
                {/* Barra base cronograma esperado (50%) */}
                <div className="w-full bg-[#E5DFD3] rounded-full h-4 overflow-hidden relative">
                  <div
                    className="bg-[#DDD4C0] h-full rounded-full transition-all duration-700"
                    style={{ width: '50%' }}
                  />
                  {/* Barra progreso real (35%) */}
                  <div
                    className="bg-[#819783] h-full rounded-full absolute top-0 left-0 transition-all duration-1000 shadow-xs"
                    style={{ width: '35%' }}
                  />
                </div>

                {/* Marcadores de Semanas */}
                <div className="absolute w-full flex justify-between text-[10px] text-[#586879] mt-2 font-mono px-1">
                  <span>Sem 1</span>
                  <span>Sem 4</span>
                  <span className="font-bold text-[#819783]">Sem 6 (Actual: 35%)</span>
                  <span className="font-bold text-[#263A50]">Sem 8 (Meta: 50%)</span>
                  <span>Sem 12</span>
                  <span>Sem 16 (Final)</span>
                </div>
              </div>

              {/* Estadísticas de Entrega de Cátedra */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E5DFD3] text-xs">
                <div className="bg-white p-3 rounded-lg border border-[#E5DFD3] space-y-1">
                  <div className="text-[#819783] font-bold text-lg font-mono">28 / 42</div>
                  <div className="text-[#586879] text-[11px]">Estudiantes al día con todas las entregas prácticas</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E5DFD3] space-y-1">
                  <div className="text-[#B8863A] font-bold text-lg font-mono">10 / 42</div>
                  <div className="text-[#586879] text-[11px]">Con prórroga o entrega en proceso (carga laboral)</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E5DFD3] space-y-1">
                  <div className="text-[#B85D43] font-bold text-lg font-mono">4 / 42</div>
                  <div className="text-[#586879] text-[11px]">Sin actividad en campus en los últimos 14 días</div>
                </div>
              </div>
            </div>
          </div>

          {/* TARJETA 2: DIFICULTAD - TEMAS CON MAYOR DIFICULTAD (HEATMAP) */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5DFD3]">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#263A50] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                  <span>Dificultad · Temas con Mayor Dificultad</span>
                </h2>
                <p className="text-xs text-[#586879] mt-0.5">
                  Mapa de calor conceptual generado por las consultas de los estudiantes al Asistente DOC y correcciones de TPs.
                </p>
              </div>

              <span className="text-[11px] font-mono text-[#586879] bg-[#FAF8F1] px-3 py-1 rounded-full border border-[#E5DFD3]">
                Nivel de Cátedra · Análisis no individualizado
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Lista de temas con mapa de calor (col-7) */}
              <div className="lg:col-span-7 space-y-3">
                {/* Tema 1: Redes Neuronales (68%) */}
                <div
                  onClick={() => setTemaDificultadActivo('Redes Neuronales')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    temaDificultadActivo === 'Redes Neuronales'
                      ? 'bg-[#F9EFEB] border-[#B85D43] shadow-xs'
                      : 'bg-[#FAF8F1] border-[#E5DFD3] hover:border-[#DDD4C0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-[#263A50]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B85D43]" />
                      <span>Redes Neuronales (68% de dudas)</span>
                    </div>
                    <span className="font-mono font-bold text-[#B85D43]">68% consultas</span>
                  </div>
                  <div className="w-full bg-[#E5DFD3] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#B85D43] h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                  <p className="text-[11px] text-[#586879]">
                    Focos detectados: Derivadas parciales, regla de la cadena aplicada y matrices de pesos en NumPy.
                  </p>
                </div>

                {/* Tema 2: Backpropagation (52%) */}
                <div
                  onClick={() => setTemaDificultadActivo('Backpropagation')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    temaDificultadActivo === 'Backpropagation'
                      ? 'bg-[#FDF6ED] border-[#B8863A] shadow-xs'
                      : 'bg-[#FAF8F1] border-[#E5DFD3] hover:border-[#DDD4C0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-[#263A50]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B8863A]" />
                      <span>Backpropagation & Gradiente Descendente (52% de dudas)</span>
                    </div>
                    <span className="font-mono font-bold text-[#B8863A]">52% consultas</span>
                  </div>
                  <div className="w-full bg-[#E5DFD3] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#B8863A] h-full rounded-full" style={{ width: '52%' }} />
                  </div>
                  <p className="text-[11px] text-[#586879]">
                    Focos detectados: Learning rate oscilante y divergencia de pérdida en épocas tempranas.
                  </p>
                </div>

                {/* Tema 3: Funciones de Coste (41%) */}
                <div
                  onClick={() => setTemaDificultadActivo('Funciones de Coste')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    temaDificultadActivo === 'Funciones de Coste'
                      ? 'bg-[#EBF1EC] border-[#819783] shadow-xs'
                      : 'bg-[#FAF8F1] border-[#E5DFD3] hover:border-[#DDD4C0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-[#263A50]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#819783]" />
                      <span>Funciones de Coste / Regularización (41% de dudas)</span>
                    </div>
                    <span className="font-mono font-bold text-[#819783]">41% consultas</span>
                  </div>
                  <div className="w-full bg-[#E5DFD3] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#819783] h-full rounded-full" style={{ width: '41%' }} />
                  </div>
                  <p className="text-[11px] text-[#586879]">
                    Focos detectados: Diferencia práctica entre penalizaciones L1 (Lasso) y L2 (Ridge).
                  </p>
                </div>

                {/* Tema 4: Tensores (22%) */}
                <div
                  onClick={() => setTemaDificultadActivo('Preprocesamiento de Tensores')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    temaDificultadActivo === 'Preprocesamiento de Tensores'
                      ? 'bg-[#FAF8F1] border-[#263A50] shadow-xs'
                      : 'bg-[#FAF8F1] border-[#E5DFD3] hover:border-[#DDD4C0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-[#263A50]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#263A50]" />
                      <span>Preprocesamiento de Tensores (22% de dudas)</span>
                    </div>
                    <span className="font-mono font-bold text-[#263A50]">22% consultas</span>
                  </div>
                  <div className="w-full bg-[#E5DFD3] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#263A50] h-full rounded-full" style={{ width: '22%' }} />
                  </div>
                  <p className="text-[11px] text-[#586879]">
                    Focos detectados: Normalización por lotes (StandardScaler vs MinMaxScaler).
                  </p>
                </div>
              </div>

              {/* Detalle del tema activo (col-5) */}
              <div className="lg:col-span-5 bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#263A50] uppercase tracking-wider">
                      Diagnóstico Pedagógico
                    </span>
                    <span className="text-[11px] font-mono text-[#819783] font-semibold">
                      Tema Seleccionado
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5DFD3] space-y-2">
                    <h3 className="font-serif text-sm font-bold text-[#263A50]">
                      {temaDificultadActivo}
                    </h3>
                    <p className="text-xs text-[#586879] leading-relaxed">
                      El 64% de las dudas se concentran en estudiantes que realizan las lecturas en transporte público (AMBA) o en horarios nocturnos (post 22:00 hs), donde la formulación matemática abstracta sin código ejecutable genera mayor fricción cognitiva.
                    </p>
                  </div>

                  <div className="bg-[#EBF1EC] p-3.5 rounded-xl border border-[#819783]/30 text-xs text-[#263A50] space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-[#819783]">
                      <Sparkles className="w-4 h-4 stroke-[1.75]" />
                      <span>Sugerencia DOCE para Cátedra:</span>
                    </div>
                    <p className="text-[11px] text-[#586879]">
                      Publicar micro-videos de 4 minutos con el cálculo a mano de un perceptrón simple y habilitar una prórroga de entrega de 5 a 7 días.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerarGuiaDoc}
                  className="w-full py-2.5 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generar Micro-Desglose de Refuerzo</span>
                </button>
              </div>
            </div>
          </div>

          {/* TARJETA 3: DOC ASISTENTE PARA DOCENTES (MOCKUP OFICIAL) */}
          <div className="bg-[#FFFFFF] border-2 border-[#819783]/50 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DFD3]">
              <div className="flex items-center space-x-3">
                {/* DOC Avatar */}
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-[#E5DFD3] bg-white shadow-xs">
                  <img
                    src="/assets/aistudio/f32080f4-f26f-4530-9c76-16413cf9c53e_3d3d1ea7.png"
                    alt="DOC Asistente"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif text-lg font-bold text-[#263A50]">
                      DOC Asistente para Docentes
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#EBF1EC] text-[#819783] border border-[#819783]/30">
                      Sugerencia Pedagógica Activa
                    </span>
                  </div>
                  <p className="text-xs text-[#586879]">
                    Monitoreo asincrónico y propuestas no invasivas de apoyo para el cuerpo docente.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-[#819783] font-medium bg-[#FAF8F1] px-3 py-1.5 rounded-xl border border-[#E5DFD3]">
                <Clock className="w-3.5 h-3.5" />
                <span>Generado hace 15 min</span>
              </div>
            </div>

            {/* Mensaje de DOC */}
            <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-5 space-y-3">
              <div className="text-sm text-[#263A50] leading-relaxed font-serif italic">
                “DOC: Detecté retraso en el tema <strong>Redes Neuronales</strong> en el 35% de la cursada. ¿Querés que genere una guía de ejercicios asincrónicos de refuerzo o un micro-desglose conceptual para el campus?”
              </div>
              <p className="text-xs text-[#586879]">
                Esta sugerencia respeta la privacidad de los estudiantes y se basa en 27 consultas técnicas anonimizadas y retrasos reportados en el TP N.° 2.
              </p>
            </div>

            {/* Botones de Acción del Mockup */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalAjustarFecha(true)}
                className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#263A50] text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-[#819783]" />
                <span>Ajustar Fecha Parcial / Prórroga</span>
              </button>

              <button
                onClick={handleGenerarGuiaDoc}
                className="px-5 py-2.5 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Generar Material Didáctico</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODALES COMPARTIDOS Y ESPECÍFICOS                                       */}
      {/* ====================================================================== */}

      {/* Modal 1: Generar Material Didáctico de DOC */}
      {modalGenerarMaterial && (
        <div className="fixed inset-0 z-50 bg-[#263A50]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5DFD3]">
                  <img
                    src="/assets/aistudio/f32080f4-f26f-4530-9c76-16413cf9c53e_3d3d1ea7.png"
                    alt="DOC"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#263A50]">
                    Material Didáctico Generado por DOC
                  </h3>
                  <p className="text-[11px] text-[#586879]">
                    Guía estructurada de micro-aprendizaje para publicar en el Campus Virtual IFTS 12
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalGenerarMaterial(false)}
                className="text-[#586879] hover:text-[#263A50] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] text-xs font-mono text-[#263A50] whitespace-pre-wrap leading-relaxed">
              {materialGeneradoTexto}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5DFD3] text-xs">
              <span className="text-[11px] text-[#586879]">
                Listo para copiar o subir al foro de la materia.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setModalGenerarMaterial(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] text-[#586879] hover:text-[#263A50] cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => materialGeneradoTexto && copiarAlPortapapeles(materialGeneradoTexto)}
                  className="px-4 py-2 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {copiadoMaterial ? (
                    <>
                      <Check className="w-4 h-4 text-[#819783]" />
                      <span>¡Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Guía Didáctica</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Ajustar Fecha Parcial / Prórroga */}
      {modalAjustarFecha && (
        <div className="fixed inset-0 z-50 bg-[#263A50]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <div className="flex items-center space-x-2">
                <CalendarPlus className="w-5 h-5 text-[#819783]" />
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Ajustar Fecha de Parcial / TP
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalAjustarFecha(false);
                  setProrrogaConfirmada(false);
                }}
                className="text-[#586879] hover:text-[#263A50] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {prorrogaConfirmada ? (
              <div className="p-4 bg-[#EBF1EC] border border-[#819783]/40 rounded-xl text-xs text-[#4B634E] space-y-2">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#819783]" />
                  <span>¡Prórroga de Cátedra Registrada con Éxito!</span>
                </div>
                <p>
                  Se sincronizó la nueva fecha límite en el SIU Guaraní y en el Campus Virtual para el TP N.° 2 (Redes Neuronales). Nueva fecha: <strong>{nuevaFechaParcial}</strong>.
                </p>
                <button
                  onClick={() => {
                    setModalAjustarFecha(false);
                    setProrrogaConfirmada(false);
                  }}
                  className="mt-2 w-full py-2 rounded-xl bg-[#263A50] text-white font-semibold cursor-pointer"
                >
                  Aceptar y Volver al Panel
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-[#586879]">
                  Permite extender la entrega para toda la cohorte sin penalización sobre la calificación, equilibrando la exigencia técnica con el contexto laboral real.
                </p>

                <div className="space-y-1">
                  <label className="font-semibold text-[#263A50]">Materia e Instancia:</label>
                  <div className="p-2.5 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] font-medium text-[#263A50]">
                    {materiaSeleccionada} · TP N.° 2: Redes Neuronales Feedforward
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#263A50]">Nueva Fecha Límite de Entrega:</label>
                  <input
                    type="date"
                    value={nuevaFechaParcial}
                    onChange={(e) => setNuevaFechaParcial(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2.5 text-xs text-[#263A50]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#263A50]">Motivo Pedagógico Registrado:</label>
                  <textarea
                    rows={3}
                    value={motivoProrroga}
                    onChange={(e) => setMotivoProrroga(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2.5 text-xs text-[#263A50]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-[#E5DFD3]">
                  <button
                    type="button"
                    onClick={() => setModalAjustarFecha(false)}
                    className="px-4 py-2 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] text-[#586879] hover:text-[#263A50] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setProrrogaConfirmada(true)}
                    className="px-4 py-2 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white font-semibold cursor-pointer"
                  >
                    Confirmar Prórroga
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 3: Registrar Intervención Pedagógica (Pantalla 5) */}
      {alertaSeleccionadaParaIntervencion && (
        <div className="fixed inset-0 z-50 bg-[#263A50]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <h3 className="font-serif text-base font-bold text-[#263A50]">
                Registrar Acuerdo Pedagógico
              </h3>
              <button
                onClick={() => setAlertaSeleccionadaParaIntervencion(null)}
                className="text-[#586879] hover:text-[#263A50] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmarIntervencion} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#263A50]">Tipo de Mediación Pedagógica:</label>
                <select
                  value={tipoIntervencion}
                  onChange={(e) => setTipoIntervencion(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2.5 text-xs text-[#263A50]"
                >
                  <option value="Plan de contingencia laboral">Plan de contingencia laboral</option>
                  <option value="Flexibilización de entregas">Flexibilización de entregas prácticas</option>
                  <option value="Taller de refuerzo asincrónico">Taller de refuerzo asincrónico</option>
                  <option value="Tutoría personalizada 1 a 1">Tutoría personalizada 1 a 1</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#263A50]">Acuerdos consensuados:</label>
                <textarea
                  rows={3}
                  value={acuerdos}
                  onChange={(e) => setAcuerdos(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2.5 text-xs text-[#263A50]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#263A50]">Observaciones pedagógicas:</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2.5 text-xs text-[#263A50]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#263A50]">Fecha de seguimiento acordada:</label>
                <input
                  type="date"
                  value={fechaSeguimiento}
                  onChange={(e) => setFechaSeguimiento(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2 text-xs text-[#263A50]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAlertaSeleccionadaParaIntervencion(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] text-[#586879] hover:text-[#263A50] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white font-semibold cursor-pointer"
                >
                  Guardar Acuerdo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Calibración Umbral IA */}
      {modalAjusteIA && (
        <div className="fixed inset-0 z-50 bg-[#263A50]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <h3 className="font-serif text-base font-bold text-[#263A50]">
                Calibración del Umbral Predictivo
              </h3>
              <button
                onClick={() => setModalAjusteIA(false)}
                className="text-[#586879] hover:text-[#263A50] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[#586879]">
                Define el umbral de probabilidad para sugerir acompañamiento prioritario sin generar falsos positivos.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#263A50]">Umbral de activación:</span>
                  <span className="text-[#819783]">{umbralAlerta}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="85"
                  value={umbralAlerta}
                  onChange={(e) => setUmbralAlerta(Number(e.target.value))}
                  className="w-full accent-[#819783]"
                />
              </div>

              <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] text-[11px] text-[#586879]">
                F1-Score del modelo actual: <strong>0.89</strong> (Red Neuronal Supervisada v2.4).
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModalAjusteIA(false)}
                  className="px-4 py-2 rounded-xl bg-[#263A50] text-white font-semibold cursor-pointer"
                >
                  Confirmar Calibración
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Programar Taller de Apoyo */}
      {modalTaller && (
        <div className="fixed inset-0 z-50 bg-[#263A50]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <h3 className="font-serif text-base font-bold text-[#263A50]">
                Programar Taller de Apoyo Pedagógico
              </h3>
              <button
                onClick={() => {
                  setModalTaller(false);
                  setTallerConfirmado(false);
                }}
                className="text-[#586879] hover:text-[#263A50] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {tallerConfirmado ? (
              <div className="p-4 bg-[#EBF1EC] border border-[#819783]/40 rounded-xl text-xs text-[#4B634E] space-y-2">
                <div className="font-bold">¡Taller convocado con éxito!</div>
                <p>
                  Se envió invitación no punitiva y material asincrónico a los estudiantes de la cohorte para el tema: <strong>{temaTaller}</strong>.
                </p>
                <button
                  onClick={() => {
                    setModalTaller(false);
                    setTallerConfirmado(false);
                  }}
                  className="mt-2 w-full py-2 rounded-xl bg-[#263A50] text-white font-semibold cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#263A50]">Tema del Taller de Refuerzo:</label>
                  <input
                    type="text"
                    value={temaTaller}
                    onChange={(e) => setTemaTaller(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-2.5 text-xs text-[#263A50]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#263A50]">Modalidad:</label>
                  <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] text-[#586879]">
                    Híbrida: Asincrónico en Campus Virtual + Consulta sincrónica de 30 min optativa.
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setModalTaller(false)}
                    className="px-4 py-2 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] text-[#586879] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setTallerConfirmado(true)}
                    className="px-4 py-2 rounded-xl bg-[#263A50] hover:bg-[#1A2837] text-white font-semibold cursor-pointer"
                  >
                    Convocar al Taller
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
