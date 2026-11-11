/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ecosistema DOCE - IFTS N.º 12
 * Vista del Estudiante según el Catálogo Oficial de Mockups Definitivos (Pantallas 1, 2, 3, 4 y 7)
 * "Una identidad cercana y adulta · Tu acompañamiento a medida"
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  HelpCircle,
  FileText,
  Send,
  MessageCircle,
  Bot,
  Flame,
  ArrowRight,
  TrendingUp,
  Brain,
  Headphones,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  Layers,
  Check,
  ChevronRight,
  Lightbulb,
  Sun,
  ListTodo,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import {
  Estudiante,
  PrediccionRiesgo,
  Alerta,
  InteraccionDOC,
  ModoDOC,
  RitmoEstudio,
} from '../domain/models.js';
import { ambientAudio } from '../utils/ambientAudio.js';
import { AuthUserResponse } from '../services/api.js';

export interface CursadaDetalleUI {
  codigo: string;
  nombre: string;
  subtitulo: string;
  estado: string;
  progreso: number;
  alDia: boolean;
  icono: 'book' | 'layers' | 'code';
}

export interface EstudianteDataPreset {
  metas: Array<{ id: string; texto: string; completada: boolean; materia: string }>;
  microVictorias: {
    porcentaje: number;
    mensaje: string;
    detalle: string;
    motivacion: string;
    insignia: string;
    nivel: string;
    puntos: number;
    historico: string;
  };
  pistaRecomendada: 'Tarde lluviosa' | 'Café de estudio' | 'Ondas Alpha';
  cursadas: CursadaDetalleUI[];
  adelantoOpcional: {
    titulo: string;
    etiqueta: string;
  };
  momentoSugerido: string;
  tiempoSugerido: string;
  perfilSocioLaboral: {
    horasTrabajo: number;
    minutosViaje: number;
    personasCargo: number;
    estres: number;
    ritmo: RitmoEstudio;
  };
}

export const PRESETS_ESTUDIANTES: Record<string, EstudianteDataPreset> = {
  'est-alex-12': {
    metas: [
      { id: 'm1', texto: 'Terminar el capítulo de Historia', completada: true, materia: 'Historia de los Medios' },
      { id: 'm2', texto: 'Practicar álgebra 30 min', completada: false, materia: 'Álgebra Lineal' },
      { id: 'm3', texto: 'Revisar apunte de Redes Neuronales', completada: false, materia: 'Inteligencia Artificial I' },
    ],
    microVictorias: {
      porcentaje: 75,
      mensaje: '¡Buen Trabajo, Álex!',
      detalle: '3 de 4 tareas semanales al día',
      motivacion: 'Reconocimiento continuo de avances sin acumular culpa. Cada lectura completada consolida tu permanencia en el IFTS 12.',
      insignia: '🎖️ ¡3 Trabajos Aprobados esta semana!',
      nivel: '¡Nivel 2 Desbloqueado! ✨',
      puntos: 420,
      historico: '“Hace 1 mes tenías 3 tareas atrasadas... ¡Hoy estás 100% al día!”',
    },
    pistaRecomendada: 'Tarde lluviosa',
    cursadas: [
      { codigo: 'CDIA-101', nombre: 'Estadística y Probabilidad Aplicada', subtitulo: 'Semana 8 · Muestreo y Esperanza Matemática', estado: 'Al día (75%)', progreso: 75, alDia: true, icono: 'book' },
      { codigo: 'CDIA-102', nombre: 'Inteligencia Artificial I (Machine Learning)', subtitulo: 'Avance de TP: Modelo de Regresión', estado: 'En curso (35%)', progreso: 35, alDia: false, icono: 'layers' },
      { codigo: 'CDIA-103', nombre: 'Álgebra Lineal y Computacional', subtitulo: 'Matrices y Tensores en Python', estado: 'Al día (60%)', progreso: 60, alDia: true, icono: 'code' },
    ],
    adelantoOpcional: {
      titulo: 'Defensa oral de TP2 (Sábado 24)',
      etiqueta: 'Flexibilizado',
    },
    momentoSugerido: 'Momento sugerido',
    tiempoSugerido: 'Bloque suave de 20 minutos',
    perfilSocioLaboral: {
      horasTrabajo: 38,
      minutosViaje: 75,
      personasCargo: 1,
      estres: 7,
      ritmo: 'Fragmentado',
    },
  },
  'est-24192': {
    metas: [
      { id: 'm1', texto: 'Descargar notebook de Pandas y NumPy', completada: true, materia: 'Programación para Ciencia de Datos (Python)' },
      { id: 'm2', texto: 'Repasar consultas JOIN y GROUP BY en SQLite', completada: false, materia: 'Bases de Datos & SQL' },
      { id: 'm3', texto: 'Resolver ejercicio de sintaxis de bucles for', completada: false, materia: 'Programación para Ciencia de Datos (Python)' },
      { id: 'm4', texto: 'Confirmar prórroga pedagógica con cátedra', completada: true, materia: 'Acompañamiento DOCE' },
    ],
    microVictorias: {
      porcentaje: 50,
      mensaje: '¡Gran avance, Camila!',
      detalle: '2 de 4 tareas semanales completadas',
      motivacion: 'Superaste el tramo de viaje largo y regularizaste la primera entrega de Python. Cada bloque cuenta para tu avance.',
      insignia: '🛡️ ¡Resiliencia y Compromiso!',
      nivel: 'Nivel 1 — En Ascenso 🌿',
      puntos: 280,
      historico: '“Completaste el módulo inicial de Python compensando 44h de jornada laboral y viaje desde AMBA.”',
    },
    pistaRecomendada: 'Café de estudio',
    cursadas: [
      { codigo: 'CDIA-104', nombre: 'Programación para Ciencia de Datos (Python)', subtitulo: 'Estructuras de Control y Funciones · Prórroga concedida', estado: 'Recuperando (35%)', progreso: 35, alDia: false, icono: 'code' },
      { codigo: 'CDIA-105', nombre: 'Bases de Datos & SQL para Analytics', subtitulo: 'Modelado Relacional y Consultas Agrupadas', estado: 'En curso (30%)', progreso: 30, alDia: false, icono: 'layers' },
    ],
    adelantoOpcional: {
      titulo: 'Entrega flexible de TP2 Programación (Miércoles 28)',
      etiqueta: 'Prórroga Activa',
    },
    momentoSugerido: 'Micro-módulo móvil',
    tiempoSugerido: 'Bloque de 15 min en transporte',
    perfilSocioLaboral: {
      horasTrabajo: 44,
      minutosViaje: 95,
      personasCargo: 1,
      estres: 8,
      ritmo: 'Fragmentado',
    },
  },
  'est-24155': {
    metas: [
      { id: 'm1', texto: 'Diagramar árbol binario de búsqueda en papel', completada: true, materia: 'Algoritmos y Estructuras de Datos' },
      { id: 'm2', texto: 'Configurar simulación de subredes en Packet Tracer', completada: true, materia: 'Redes y Comunicaciones' },
      { id: 'm3', texto: 'Completar cuestionario de la Unidad 3 antes del turno', completada: false, materia: 'Algoritmos y Estructuras de Datos' },
    ],
    microVictorias: {
      porcentaje: 66,
      mensaje: '¡Excelente ritmo, Juan Manuel!',
      detalle: '4 de 6 módulos aprobados con solidez',
      motivacion: 'Organización eficiente entre tus turnos de fábrica y las prácticas de algoritmos.',
      insignia: '⚙️ ¡Constancia en Algoritmos!',
      nivel: '¡Nivel 2 Desbloqueado! ✨',
      puntos: 375,
      historico: '“Mantuviste el promedio de 7.0 coordinando tus horarios de guardia rotativa.”',
    },
    pistaRecomendada: 'Ondas Alpha',
    cursadas: [
      { codigo: 'TSDS-201', nombre: 'Algoritmos y Estructuras de Datos', subtitulo: 'Pilas, Colas y Complejidad Asintótica Big-O', estado: 'Al día (55%)', progreso: 55, alDia: true, icono: 'code' },
      { codigo: 'TSDS-202', nombre: 'Redes y Comunicaciones', subtitulo: 'Modelo OSI y Direccionamiento IPv4/IPv6', estado: 'Al día (50%)', progreso: 50, alDia: true, icono: 'layers' },
    ],
    adelantoOpcional: {
      titulo: 'Laboratorio virtual de enrutamiento estático',
      etiqueta: 'Práctica opcional',
    },
    momentoSugerido: 'Ventana de descanso',
    tiempoSugerido: 'Bloque focalizado de 25 min',
    perfilSocioLaboral: {
      horasTrabajo: 30,
      minutosViaje: 45,
      personasCargo: 1,
      estres: 6,
      ritmo: 'Regular',
    },
  },
  'est-23910': {
    metas: [
      { id: 'm1', texto: 'Revisar diagrama UML de clases del proyecto grupal', completada: true, materia: 'Programación Orientada a Objetos' },
      { id: 'm2', texto: 'Redactar informe de avance semanal de práctica', completada: true, materia: 'Práctica Profesionalizante I' },
      { id: 'm3', texto: 'Implementar patrón Observer en Java', completada: false, materia: 'Programación Orientada a Objetos' },
    ],
    microVictorias: {
      porcentaje: 90,
      mensaje: '¡Desempeño Sobresaliente, Sofía!',
      detalle: '5 de 5 entregas al día',
      motivacion: 'Trayectoria académica consolidada con alta participación en los laboratorios.',
      insignia: '💎 ¡Excelencia Técnica!',
      nivel: '¡Nivel 3 Maestro! 🚀',
      puntos: 560,
      historico: '“9.0 en POO y liderazgo activo en Práctica Profesionalizante I.”',
    },
    pistaRecomendada: 'Tarde lluviosa',
    cursadas: [
      { codigo: 'TSDS-203', nombre: 'Programación Orientada a Objetos', subtitulo: 'Patrones de Diseño y Polimorfismo', estado: 'Al día (75%)', progreso: 75, alDia: true, icono: 'code' },
      { codigo: 'TSDS-204', nombre: 'Práctica Profesionalizante I', subtitulo: 'Desarrollo de Software para Entorno Real', estado: 'Al día (70%)', progreso: 70, alDia: true, icono: 'book' },
    ],
    adelantoOpcional: {
      titulo: 'Entrega final Sprint 2 de Práctica Profesionalizante',
      etiqueta: 'Adelantado',
    },
    momentoSugerido: 'Momento óptimo',
    tiempoSugerido: 'Bloque de estudio de 30 min',
    perfilSocioLaboral: {
      horasTrabajo: 18,
      minutosViaje: 25,
      personasCargo: 0,
      estres: 3,
      ritmo: 'Intensivo',
    },
  },
};

interface StudentViewProps {
  usuario?: AuthUserResponse | null;
  estudiante: Estudiante;
  prediccion: PrediccionRiesgo | null;
  alerta: Alerta | null;
  interaccionesDOC: InteraccionDOC[];
  onActualizarPerfil: (datos: {
    horas_trabajo_semanal: number;
    minutos_viaje: number;
    personas_a_cargo: number;
    nivel_estres_percibido: number;
    ritmo_estudio: RitmoEstudio;
  }) => void;
  onEnviarMensajeDOC: (mensaje: string, modo: ModoDOC) => Promise<void>;
  onDesglosarTextoDOC: (texto: string, materia: string) => Promise<string>;
  cargandoDOC: boolean;
}

export type PantallaEstudiante =
  | 'corcho' // Pantalla 1: Home — Tablero de Corcho Virtual (Moodboard Inspirador)
  | 'onboarding' // Pantalla 2: Onboarding & Test 'Perfil de Estudiante'
  | 'cursada_foco' // Pantalla 3: Plan de Cursada & Temporizador Adaptativo
  | 'doc' // Pantalla 4: Interfaz Conversacional del Asistente DOC
  | 'gamificacion'; // Pantalla 7: Módulo de Motivación, Gamificación y Visión a Futuro

export const StudentView: React.FC<StudentViewProps> = ({
  usuario,
  estudiante,
  prediccion,
  alerta,
  interaccionesDOC,
  onActualizarPerfil,
  onEnviarMensajeDOC,
  onDesglosarTextoDOC,
  cargandoDOC,
}) => {
  // Navegación por las 5 pantallas del estudiante según el catálogo oficial
  const [pantallaActiva, setPantallaActiva] = useState<PantallaEstudiante>('corcho');

  // Identificar si la vista está siendo consultada por Coordinación / Dirección
  const esCoordinacion = usuario?.rol === 'admin' || usuario?.id === 'user-adm-direccion';

  // Preset de datos precargados para el estudiante actual
  const presetActivo = useMemo(() => {
    return PRESETS_ESTUDIANTES[estudiante.id_usuario] || PRESETS_ESTUDIANTES['est-alex-12'];
  }, [estudiante.id_usuario]);

  // --- ESTADO PANTALLA 1: TABLERO DE CORCHO & REPRODUCTOR AMBIENTAL ---
  const [metasCorcho, setMetasCorcho] = useState(presetActivo.metas);
  const [nuevaMetaInput, setNuevaMetaInput] = useState('');
  const [audioReproduciendo, setAudioReproduciendo] = useState(false);
  const [pistaActual, setPistaActual] = useState<'Tarde lluviosa' | 'Café de estudio' | 'Ondas Alpha'>(presetActivo.pistaRecomendada);

  const toggleAudio = () => {
    const estado = ambientAudio.toggle(0.18);
    setAudioReproduciendo(estado);
  };

  const agregarMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaMetaInput.trim()) return;
    setMetasCorcho((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, texto: nuevaMetaInput.trim(), completada: false, materia: 'Ciencia de Datos' },
    ]);
    setNuevaMetaInput('');
  };

  const toggleMeta = (id: string) => {
    setMetasCorcho((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completada: !m.completada } : m))
    );
  };

  // --- ESTADO PANTALLA 2: ONBOARDING & TEST PERFIL DE ESTUDIANTE ---
  const [preguntaActual, setPreguntaActual] = useState(3);
  const totalPreguntas = 10;
  const preguntasTest = [
    {
      num: 1,
      titulo: '¿En qué franja horaria sentís mayor claridad mental para estudiar?',
      opciones: [
        { label: 'Mañana temprano (antes de iniciar la jornada laboral)', icono: '🌅', perfil: 'Enfoque Matutino' },
        { label: 'Tarde / Viaje de regreso en transporte público', icono: '🚌', perfil: 'Modular Móvil' },
        { label: 'Noche tranquila (después de cenar y cumplir obligaciones)', icono: '🌙', perfil: 'Nocturno' },
      ],
    },
    {
      num: 2,
      titulo: '¿Cuántas horas promedio le dedicás a tu actividad laboral cada semana?',
      opciones: [
        { label: 'Menos de 25 horas semanales', icono: '💼', perfil: 'Tiempo Parcial' },
        { label: 'Entre 35 y 45 horas semanales', icono: '⏰', perfil: 'Jornada Completa' },
        { label: 'Más de 45 horas semanales o turnos rotativos', icono: '🔄', perfil: 'Alta Carga Laboral' },
      ],
    },
    {
      num: 3,
      titulo: '¿Cómo preferís abordar las lecturas extensas?',
      opciones: [
        { label: 'En bloques de tiempo cortos (15 a 20 min)', icono: '⏱️', perfil: 'Enfoque en Bloques' },
        { label: 'Resumiendo en fichas visuales o mapas conceptuales', icono: '📑', perfil: 'Visual-Sintético' },
        { label: 'Escuchando o repasando mientras camino o viajo', icono: '🎧', perfil: 'Auditivo-Móvil' },
      ],
    },
    {
      num: 4,
      titulo: 'Frente a una entrega compleja de programación o matemáticas, ¿qué te ayuda más?',
      opciones: [
        { label: 'Un ejemplo de código mínimo funcionando paso a paso', icono: '💻', perfil: 'Práctico-Secuencial' },
        { label: 'Una analogía conceptual de la vida cotidiana', icono: '💡', perfil: 'Analógico-Intuitivo' },
        { label: 'Dividir el trabajo práctico en 3 micro-entregas', icono: '🧩', perfil: 'Modular' },
      ],
    },
  ];

  const preguntaActivaObj = preguntasTest.find((p) => p.num === preguntaActual) || preguntasTest[2];
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>('Resumiendo en fichas visuales');
  const [testFinalizado, setTestFinalizado] = useState(false);

  // Sincronizar datos precargados cada vez que cambia el estudiante seleccionado
  useEffect(() => {
    const p = PRESETS_ESTUDIANTES[estudiante.id_usuario] || PRESETS_ESTUDIANTES['est-alex-12'];
    setMetasCorcho(p.metas);
    setPistaActual(p.pistaRecomendada);
    const perf = estudiante.perfilEstudio;
    setHorasTrabajo(perf?.horas_trabajo_semanal ?? p.perfilSocioLaboral.horasTrabajo);
    setMinutosViaje(perf?.minutos_viaje ?? p.perfilSocioLaboral.minutosViaje);
    setPersonasCargo(perf?.personas_a_cargo ?? p.perfilSocioLaboral.personasCargo);
    setEstres(perf?.nivel_estres_percibido ?? p.perfilSocioLaboral.estres);
    setRitmo(perf?.ritmo_estudio ?? p.perfilSocioLaboral.ritmo);
  }, [estudiante.id_usuario]);

  // Perfil socio-laboral editable
  const perfil = estudiante.perfilEstudio;
  const [horasTrabajo, setHorasTrabajo] = useState(perfil?.horas_trabajo_semanal ?? presetActivo.perfilSocioLaboral.horasTrabajo);
  const [minutosViaje, setMinutosViaje] = useState(perfil?.minutos_viaje ?? presetActivo.perfilSocioLaboral.minutosViaje);
  const [personasCargo, setPersonasCargo] = useState(perfil?.personas_a_cargo ?? presetActivo.perfilSocioLaboral.personasCargo);
  const [estres, setEstres] = useState(perfil?.nivel_estres_percibido ?? presetActivo.perfilSocioLaboral.estres);
  const [ritmo, setRitmo] = useState<RitmoEstudio>(perfil?.ritmo_estudio ?? presetActivo.perfilSocioLaboral.ritmo);

  const handleGuardarPerfilOnboarding = () => {
    onActualizarPerfil({
      horas_trabajo_semanal: Number(horasTrabajo),
      minutos_viaje: Number(minutosViaje),
      personas_a_cargo: Number(personasCargo),
      nivel_estres_percibido: Number(estres),
      ritmo_estudio: ritmo,
    });
    setTestFinalizado(true);
  };

  // --- ESTADO PANTALLA 3: PLAN DE CURSADA & TEMPORIZADOR ADAPTATIVO ---
  const [duracionMinutos, setDuracionMinutos] = useState(25);
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [timerActivo, setTimerActivo] = useState(false);
  const [modoFoco, setModoFoco] = useState<'Enfoque Suave' | 'Micro-Bloque (15 min)' | 'Pausa Reparadora (5 min)'>('Enfoque Suave');

  useEffect(() => {
    let interval: any = null;
    if (timerActivo && segundosRestantes > 0) {
      interval = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    } else if (segundosRestantes === 0 && timerActivo) {
      setTimerActivo(false);
      ambientAudio.stop();
      setAudioReproduciendo(false);
    }
    return () => clearInterval(interval);
  }, [timerActivo, segundosRestantes]);

  const cambiarModoTimer = (min: number, nombre: 'Enfoque Suave' | 'Micro-Bloque (15 min)' | 'Pausa Reparadora (5 min)') => {
    setTimerActivo(false);
    setDuracionMinutos(min);
    setSegundosRestantes(min * 60);
    setModoFoco(nombre);
  };

  const toggleTimer = () => {
    setTimerActivo(!timerActivo);
    if (!timerActivo && audioReproduciendo === false) {
      // Activar lluvia suave automáticamente al enfocar
      ambientAudio.playRain(0.12);
      setAudioReproduciendo(true);
    }
  };

  const resetTimer = () => {
    setTimerActivo(false);
    setSegundosRestantes(duracionMinutos * 60);
  };

  const formatearTiempo = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- ESTADO PANTALLA 4: CHAT CON DOC & DESGLOSE ---
  const [mensajeInput, setMensajeInput] = useState('');
  const [modoDOC, setModoDOC] = useState<ModoDOC>('motivacion');
  const [textoParaDesglose, setTextoParaDesglose] = useState(
    'En el entrenamiento de redes neuronales artificiales, el algoritmo de retropropagación (backpropagation) calcula el gradiente de la función de pérdida con respecto a los pesos sinápticos mediante la regla de la cadena, permitiendo ajustar los hiperparámetros capa por capa.'
  );
  const [desgloseResultado, setDesgloseResultado] = useState('');
  const [desglosando, setDesglosando] = useState(false);

  const handleEnviarChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensajeInput.trim() || cargandoDOC) return;
    const txt = mensajeInput;
    setMensajeInput('');
    await onEnviarMensajeDOC(txt, modoDOC);
  };

  const handleEjecutarDesglose = async () => {
    let texto = textoParaDesglose.trim();
    if (!texto) {
      texto =
        'En el entrenamiento de redes neuronales artificiales, el algoritmo de retropropagación (backpropagation) calcula el gradiente de la función de pérdida con respecto a los pesos sinápticos mediante la regla de la cadena, permitiendo ajustar los hiperparámetros capa por capa.';
      setTextoParaDesglose(texto);
    }
    if (desglosando) return;
    setDesglosando(true);
    try {
      const res = await onDesglosarTextoDOC(texto, 'Inteligencia Artificial I');
      setDesgloseResultado(res);
    } catch (err) {
      setDesgloseResultado(
        '🎯 Concepto Clave: El algoritmo de retropropagación calcula cómo varía el error respecto a cada peso para corregirlo en sentido inverso.\n💡 Ejemplo Cotidiano: Es como ajustar el volumen de cada instrumento en una consola de sonido tras escuchar cómo suena la mezcla final.\n🚀 Micro-Acción para Hoy: Dibuja un esquema de 3 capas (entrada, oculta, salida) y anota dónde se calcula el error antes de descansar. ¡Listo por hoy!'
      );
    } finally {
      setDesglosando(false);
    }
  };

  const avatarDOC = '/assets/aistudio/f32080f4-f26f-4530-9c76-16413cf9c53e_3d3d1ea7.png';

  return (
    <div className="space-y-6">
      {/* Barra de Navegación del Catálogo de 5 Pantallas del Estudiante */}
      <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#263A50] text-sm flex items-center space-x-1.5">
              <span>DOCE Estudiante</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
            </span>
            <span className="text-xs text-[#586879] hidden md:inline">
              · Colección Oficial de Pantallas
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-[#EEE7D7]/70 p-1 rounded-xl border border-[#E2DBCF] overflow-x-auto text-xs">
            <button
              onClick={() => setPantallaActiva('corcho')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                pantallaActiva === 'corcho'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>📌 Tablero de Corcho</span>
            </button>

            <button
              onClick={() => setPantallaActiva('onboarding')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                pantallaActiva === 'onboarding'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>📋 Test de Perfil</span>
            </button>

            <button
              onClick={() => setPantallaActiva('cursada_foco')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                pantallaActiva === 'cursada_foco'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>⏱️ Cursada & Foco</span>
            </button>

            <button
              onClick={() => setPantallaActiva('doc')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                pantallaActiva === 'doc'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>💬 Asistente DOC</span>
            </button>

            <button
              onClick={() => setPantallaActiva('gamificacion')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                pantallaActiva === 'gamificacion'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>✨ Motivación & Futuro</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANTALLA 1: HOME — TABLERO DE CORCHO VIRTUAL (MOODBOARD INSPIRADOR)        */}
      {/* ========================================================================= */}
      {pantallaActiva === 'corcho' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header empático o institucional según rol (En Coordinación no dar bienvenida) */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {esCoordinacion ? (
                  <ShieldCheck className="w-5 h-5 text-[#819783]" />
                ) : (
                  <Sun className="w-5 h-5 text-[#B8863A]" />
                )}
                <span className="text-xs uppercase font-bold text-[#819783] tracking-wider">
                  {esCoordinacion
                    ? 'Supervisión Institucional · Coordinación General IFTS N.º 12'
                    : 'Rincón de Estudio Cálido · IFTS N.º 12'}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#263A50] flex items-center space-x-3">
                {esCoordinacion ? (
                  <span>Supervisión de Trayectoria: {estudiante.nombre}</span>
                ) : (
                  <span>Bienvenido, {estudiante.nombre.split(' ')[0]}</span>
                )}
                <span className="w-2 h-2 rounded-full bg-[#819783]" />
              </h1>
              <p className="text-sm text-[#586879] max-w-2xl leading-relaxed">
                {esCoordinacion
                  ? 'Panel de supervisión pedagógica institucional. Auditoría del avance curricular, metas de estudio y factores de permanencia sin intervención punitiva.'
                  : 'Sin presiones ni vigilancia estricta. Este es tu espacio para avanzar a tu propio ritmo, reconociendo tus micro-victorias de la semana.'}
              </p>
            </div>

            {/* Selector de pantalla rápida / estado */}
            <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-2xl p-4 flex items-center space-x-4 shrink-0 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center shrink-0">
                {esCoordinacion ? (
                  <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
                ) : (
                  <Coffee className="w-6 h-6 stroke-[1.75]" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-[#263A50]">
                  {esCoordinacion ? 'Caso Académico Auditado' : presetActivo.momentoSugerido}
                </div>
                <div className="text-[11px] text-[#586879]">
                  {esCoordinacion ? `Legajo ${estudiante.legajo}` : presetActivo.tiempoSugerido}
                </div>
                <div className="text-[10px] text-[#819783] font-medium flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  <span>
                    {esCoordinacion
                      ? estudiante.carrera.replace('Tecnicatura en ', '').replace('Tecnicatura Superior en ', '')
                      : `Estilo: ${estudiante.estilo_aprendizaje}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* El Tablero de Corcho Virtual (Textura cálida con notas adhesivas) */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-[#DCD4C4] border-8 border-[#C5BBA7] shadow-inner space-y-6">
            {/* Chinchetas en esquinas del marco */}
            <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#819783] border-2 border-white shadow-xs" />
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#819783] border-2 border-white shadow-xs" />

            <div className="flex items-center justify-between pb-2 border-b border-[#C5BBA7]/60">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#263A50] uppercase tracking-wider">
                <span>Tablero de Corcho Personal</span>
                <span>·</span>
                <span className="text-[#586879] font-normal normal-case">
                  Organizador visual de prioridades
                </span>
              </div>
              <span className="text-[11px] text-[#263A50] bg-white/70 px-2.5 py-0.5 rounded-full border border-[#C5BBA7]">
                Semana 8 · 1° Cuatrimestre
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Nota Adhesiva 1: Tus Metas de Estudio (Amarillo suave con chincheta) */}
              <div className="md:col-span-6 bg-[#FEF9E7] border border-[#F9E79F] rounded-2xl p-6 shadow-md relative transform -rotate-0.5 hover:rotate-0 transition-transform">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#B85D43] border border-white shadow-xs" />
                <div className="flex items-center space-x-2 mb-3">
                  <Coffee className="w-4 h-4 text-[#B8863A]" />
                  <h3 className="font-serif text-base font-bold text-[#263A50]">
                    Tus Metas de Estudio
                  </h3>
                </div>

                <div className="space-y-2.5 mb-4">
                  {metasCorcho.map((meta) => (
                    <div
                      key={meta.id}
                      onClick={() => toggleMeta(meta.id)}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#FAF8F1] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={meta.completada}
                        onChange={() => {}}
                        className="w-4 h-4 accent-[#819783] rounded cursor-pointer"
                      />
                      <span
                        className={`text-xs flex-1 ${
                          meta.completada
                            ? 'line-through text-[#8C98A4]'
                            : 'text-[#263A50] font-medium'
                        }`}
                      >
                        {meta.texto}
                      </span>
                      <span className="text-[10px] text-[#586879] font-mono">
                        {meta.materia}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={agregarMeta} className="flex space-x-2 pt-2 border-t border-[#F9E79F]">
                  <input
                    type="text"
                    value={nuevaMetaInput}
                    onChange={(e) => setNuevaMetaInput(e.target.value)}
                    placeholder="Agregar una nueva meta..."
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F1] border border-[#F0E6BD] rounded-xl text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-xl bg-[#263A50] text-white hover:bg-[#1E2E40] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Nota Adhesiva 2: Micro-Victorias (Verde sabio suave) */}
              <div className="md:col-span-6 bg-[#EBF1EC] border border-[#CDE0D0] rounded-2xl p-6 shadow-md relative transform rotate-0.5 hover:rotate-0 transition-transform flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#819783] border border-white shadow-xs" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#819783]" />
                      <h3 className="font-serif text-base font-bold text-[#263A50]">
                        Micro-Victorias
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#819783] bg-white px-2 py-0.5 rounded-md border border-[#CDE0D0]">
                      {presetActivo.microVictorias.porcentaje}%
                    </span>
                  </div>

                  <p className="text-xs text-[#586879] mb-4">
                    {presetActivo.microVictorias.motivacion}
                  </p>

                  <div className="bg-white/80 p-3.5 rounded-xl border border-[#CDE0D0] flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#819783] text-white flex items-center justify-center shrink-0 text-lg">
                      🌱
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#263A50]">
                        Progreso Semanal: {presetActivo.microVictorias.porcentaje}%
                      </div>
                      <div className="text-[11px] text-[#819783] font-semibold">
                        {presetActivo.microVictorias.mensaje}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#586879] pt-2 border-t border-[#CDE0D0]">
                  <span>{presetActivo.microVictorias.detalle}</span>
                  <button
                    onClick={() => setPantallaActiva('gamificacion')}
                    className="text-[#263A50] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Ver logros</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Widget de Audio Ambiental: Lo-Fi Beats & Lluvia */}
              <div className="md:col-span-7 bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center shrink-0 shadow-xs">
                    <Headphones className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-[#819783] tracking-wider">
                      Música Ambiental · Lo-Fi Beats
                    </div>
                    <div className="text-sm font-serif font-bold text-[#263A50]">
                      Escuchando ahora: “{pistaActual}”
                    </div>
                    <div className="text-[11px] text-[#586879] flex items-center space-x-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#819783] animate-pulse" />
                      <span>Audio relajante para sostener el foco</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {(['Tarde lluviosa', 'Café de estudio', 'Ondas Alpha'] as const).map((pista) => (
                      <button
                        key={pista}
                        onClick={() => {
                          setPistaActual(pista);
                          if (!audioReproduciendo) toggleAudio();
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium border cursor-pointer ${
                          pistaActual === pista
                            ? 'bg-[#EEE7D7] text-[#263A50] border-[#DDD4C0]'
                            : 'bg-white text-[#586879] border-transparent hover:bg-[#FAF8F1]'
                        }`}
                      >
                        {pista.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={toggleAudio}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      audioReproduciendo
                        ? 'bg-[#819783] text-white hover:bg-[#6E8370]'
                        : 'bg-[#263A50] text-white hover:bg-[#1E2E40]'
                    }`}
                    title={audioReproduciendo ? 'Pausar audio' : 'Reproducir audio ambiental'}
                  >
                    {audioReproduciendo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Menú de Accesos Directos Integrado */}
              <div className="md:col-span-5 bg-[#FAF8F1] border border-[#DDD4C0] rounded-2xl p-5 shadow-md flex items-center justify-around">
                <button
                  onClick={() => setPantallaActiva('cursada_foco')}
                  className="flex flex-col items-center space-y-1.5 text-xs text-[#263A50] font-semibold hover:text-[#819783] transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center shadow-xs">
                    <BookOpen className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span>Plan Cursada</span>
                </button>

                <button
                  onClick={() => setPantallaActiva('doc')}
                  className="flex flex-col items-center space-y-1.5 text-xs text-[#263A50] font-semibold hover:text-[#819783] transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center shadow-xs">
                    <Bot className="w-5 h-5 stroke-[1.75] text-[#819783]" />
                  </div>
                  <span>Asistente DOC</span>
                </button>

                <button
                  onClick={() => setPantallaActiva('onboarding')}
                  className="flex flex-col items-center space-y-1.5 text-xs text-[#263A50] font-semibold hover:text-[#819783] transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center shadow-xs">
                    <Compass className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span>Diagnóstico</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 2: ONBOARDING & TEST 'PERFIL DE ESTUDIANTE'                      */}
      {/* ========================================================================= */}
      {pantallaActiva === 'onboarding' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="text-center space-y-2 pb-4 border-b border-[#F0EBE0]">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#819783] text-xs font-semibold">
                <span>DOCE · Test de Perfil de Estudiante</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#263A50]">
                Perfilado Inicial de Hábitos & Estudio
              </h2>
              <p className="text-xs sm:text-sm text-[#586879] max-w-lg mx-auto">
                Captura inclusiva y no estigmatizante para personalizar las recomendaciones y temporizadores a tus horarios reales.
              </p>
            </div>

            {/* Ilustración de libros y café */}
            <div className="flex justify-center py-2">
              <div className="w-20 h-20 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] flex items-center justify-center text-3xl shadow-xs">
                📚☕
              </div>
            </div>

            {/* Pregunta Activa */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#586879]">
                <span className="font-semibold text-[#263A50]">
                  Pregunta {preguntaActivaObj.num} de {totalPreguntas}
                </span>
                <div className="flex items-center space-x-1 text-[#819783]">
                  <Lightbulb className="w-4 h-4" />
                  <span>Sin respuestas incorrectas</span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full h-2 bg-[#EEE7D7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#819783] transition-all duration-300"
                  style={{ width: `${(preguntaActivaObj.num / totalPreguntas) * 100}%` }}
                />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#263A50] text-center pt-2">
                {preguntaActivaObj.titulo}
              </h3>

              {/* Botonera de Opciones Táctiles */}
              <div className="space-y-2.5 pt-2">
                {preguntaActivaObj.opciones.map((op, idx) => {
                  const seleccionada = respuestaSeleccionada === op.label;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRespuestaSeleccionada(op.label)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center space-x-3.5 cursor-pointer ${
                        seleccionada
                          ? 'bg-[#EBF1EC] border-[#819783] text-[#263A50] shadow-xs'
                          : 'bg-[#FAF8F1] border-[#E5DFD3] hover:bg-[#F2ECE0] text-[#263A50]'
                      }`}
                    >
                      <span className="text-xl shrink-0">{op.icono}</span>
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-semibold">{op.label}</div>
                        <div className="text-[10px] text-[#586879]">Perfil asociado: {op.perfil}</div>
                      </div>
                      {seleccionada && <Check className="w-5 h-5 text-[#819783]" />}
                    </button>
                  );
                })}
              </div>

              {/* Paginador de Preguntas */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE0]">
                <button
                  type="button"
                  disabled={preguntaActual <= 1}
                  onClick={() => setPreguntaActual((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-xs font-semibold text-[#586879] hover:text-[#263A50] disabled:opacity-30 cursor-pointer"
                >
                  Anterior
                </button>

                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPreguntaActual(n)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        preguntaActual === n
                          ? 'bg-[#263A50] text-white'
                          : 'bg-[#FAF8F1] border border-[#E5DFD3] text-[#586879]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (preguntaActual < 4) {
                      setPreguntaActual((p) => p + 1);
                    } else {
                      handleGuardarPerfilOnboarding();
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-[#263A50] text-white text-xs font-semibold hover:bg-[#1E2E40] cursor-pointer flex items-center space-x-1"
                >
                  <span>{preguntaActual >= 4 ? 'Finalizar Perfil' : 'Siguiente'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ajuste de Parámetros Socio-Laborales Reales */}
            <div className="mt-6 pt-6 border-t border-[#F0EBE0] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#263A50] uppercase tracking-wider">
                  Sincronización Socio-Laboral Real (IFTS 12)
                </span>
                <span className="text-[11px] text-[#819783] font-medium">
                  {horasTrabajo}h trabajo · {minutosViaje}m viaje
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#586879] font-medium mb-1">
                    Horas de trabajo semanal: <strong>{horasTrabajo}h</strong>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={horasTrabajo}
                    onChange={(e) => setHorasTrabajo(Number(e.target.value))}
                    className="w-full accent-[#819783]"
                  />
                </div>

                <div>
                  <label className="block text-[#586879] font-medium mb-1">
                    Minutos de viaje diario: <strong>{minutosViaje}m</strong>
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={150}
                    step={5}
                    value={minutosViaje}
                    onChange={(e) => setMinutosViaje(Number(e.target.value))}
                    className="w-full accent-[#819783]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGuardarPerfilOnboarding}
                className="w-full py-2.5 rounded-xl bg-[#819783] hover:bg-[#6E8370] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Actualizar Diagnóstico y Sincronizar con Tutoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 3: PLAN DE CURSADA & TEMPORIZADOR ADAPTATIVO                     */}
      {/* ========================================================================= */}
      {pantallaActiva === 'cursada_foco' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Plan de Asignaturas Semanales */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#263A50] flex items-center space-x-2">
                      <span>DOCE · Mi Plan de Cursada</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                    </h2>
                    <p className="text-xs text-[#586879]">
                      Desglose de tareas semanales para evitar la sensación de inmensidad
                    </p>
                  </div>
                </div>

                {/* Lo que tenemos para esta semana */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] uppercase font-bold text-[#819783] tracking-wider flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                    <span>Lo que tenemos para esta semana:</span>
                  </div>

                  {presetActivo.cursadas.map((cur) => (
                    <div
                      key={cur.codigo}
                      className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] hover:border-[#819783] transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EEE7D7] text-[#263A50] flex items-center justify-center">
                          {cur.icono === 'book' ? (
                            <BookOpen className="w-4 h-4 stroke-[1.75]" />
                          ) : cur.icono === 'code' ? (
                            <FileText className="w-4 h-4 stroke-[1.75]" />
                          ) : (
                            <Layers className="w-4 h-4 stroke-[1.75]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#263A50]">
                            {cur.nombre}
                          </div>
                          <div className="text-[11px] text-[#586879]">
                            {cur.subtitulo}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                          cur.alDia
                            ? 'text-[#819783] bg-[#EBF1EC] border-[#D0DEC7]'
                            : 'text-[#B8863A] bg-[#FEF9E7] border-[#F9E79F]'
                        }`}
                      >
                        {cur.estado}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Lo que podés ir adelantando */}
                <div className="pt-3 border-t border-[#F0EBE0] space-y-2">
                  <div className="text-[11px] uppercase font-bold text-[#586879] tracking-wider">
                    Lo que podés ir adelantando (Opcional):
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5DFD3] text-xs text-[#586879] flex items-center justify-between">
                    <span>{presetActivo.adelantoOpcional.titulo}</span>
                    <span className="text-[10px] text-[#819783] font-semibold">
                      {presetActivo.adelantoOpcional.etiqueta}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Adaptive Focus Timer (Temporizador de Foco Adaptativo) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-7 shadow-xs text-center space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#263A50] flex items-center justify-center space-x-1.5">
                    <span>Adaptive Focus Timer</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  </h3>
                  <p className="text-xs text-[#586879] mt-0.5">
                    Temporizador de concentración flexible con pausas según tu perfil
                  </p>
                </div>

                {/* Display Circular del Temporizador */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#EEE7D7"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#819783"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={
                        2 * Math.PI * 42 * (1 - segundosRestantes / (duracionMinutos * 60))
                      }
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-3xl font-bold text-[#263A50] tracking-tight">
                      {formatearTiempo(segundosRestantes)}
                    </span>
                    <span className="text-[11px] text-[#819783] font-semibold mt-0.5">
                      {modoFoco}
                    </span>
                  </div>
                </div>

                {/* Botones de Control Play / Pausa / Reset */}
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={toggleTimer}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                      timerActivo
                        ? 'bg-[#B8863A] hover:bg-[#A0742E]'
                        : 'bg-[#263A50] hover:bg-[#1E2E40]'
                    }`}
                  >
                    {timerActivo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-2xl bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#586879] flex items-center justify-center transition-colors cursor-pointer"
                    title="Reiniciar bloque"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Modos rápidos de foco */}
                <div className="flex justify-center space-x-1.5 pt-2 border-t border-[#F0EBE0]">
                  <button
                    onClick={() => cambiarModoTimer(25, 'Enfoque Suave')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      duracionMinutos === 25
                        ? 'bg-[#263A50] text-white border-[#263A50]'
                        : 'bg-[#FAF8F1] text-[#586879] border-[#E5DFD3]'
                    }`}
                  >
                    25 min Suave
                  </button>
                  <button
                    onClick={() => cambiarModoTimer(15, 'Micro-Bloque (15 min)')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      duracionMinutos === 15
                        ? 'bg-[#263A50] text-white border-[#263A50]'
                        : 'bg-[#FAF8F1] text-[#586879] border-[#E5DFD3]'
                    }`}
                  >
                    15 min Micro
                  </button>
                  <button
                    onClick={() => cambiarModoTimer(5, 'Pausa Reparadora (5 min)')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      duracionMinutos === 5
                        ? 'bg-[#819783] text-white border-[#819783]'
                        : 'bg-[#FAF8F1] text-[#586879] border-[#E5DFD3]'
                    }`}
                  >
                    5 min Pausa
                  </button>
                </div>

                {/* Interruptor de Audio Ambiental Lluvia / Lo-Fi */}
                <div className="bg-[#FAF8F1] p-3 rounded-2xl border border-[#E5DFD3] flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-left">
                    <Headphones className="w-4 h-4 text-[#819783]" />
                    <div>
                      <div className="text-xs font-bold text-[#263A50]">Sonidos Ambientales</div>
                      <div className="text-[10px] text-[#586879]">Lluvia relajante / Ruido Lo-Fi</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleAudio}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      audioReproduciendo
                        ? 'bg-[#819783] text-white shadow-xs'
                        : 'bg-[#EEE7D7] text-[#586879]'
                    }`}
                  >
                    {audioReproduciendo ? 'Activo' : 'Silencio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 4: INTERFAZ CONVERSACIONAL DEL ASISTENTE DOC                     */}
      {/* ========================================================================= */}
      {pantallaActiva === 'doc' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Modal / Chat con Avatar de DOC */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl overflow-hidden shadow-xs flex flex-col h-[680px]">
              
              {/* Header con Avatar oficial de DOC */}
              <div className="p-4 sm:p-5 border-b border-[#E5DFD3] bg-[#FAF8F1] flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={avatarDOC}
                    alt="DOC - Tu Compañero de Estudio"
                    className="w-12 h-12 rounded-2xl object-cover border border-[#E5DFD3] shadow-xs bg-white"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-[#263A50] text-base">
                        DOC · Tu Compañero de Estudio
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#819783]" />
                    </div>
                    <p className="text-[11px] text-[#586879]">
                      Atención asistida por IA · Diálogo empático y anticipatorio · &lt;180 palabras
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-[#EEE7D7]/70 p-1 rounded-xl border border-[#E2DBCF] text-xs">
                  <button
                    type="button"
                    onClick={() => setModoDOC('motivacion')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      modoDOC === 'motivacion'
                        ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                        : 'text-[#586879] hover:text-[#263A50]'
                    }`}
                  >
                    Motivación
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoDOC('desglose_lectura')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      modoDOC === 'desglose_lectura'
                        ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                        : 'text-[#586879] hover:text-[#263A50]'
                    }`}
                  >
                    Desglose
                  </button>
                </div>
              </div>

              {/* Historial de Mensajes */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF8F1]/40">
                {interaccionesDOC.map((inter) => (
                  <div key={inter.id_interaccion} className="space-y-3">
                    {/* Mensaje del Estudiante */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#263A50] text-[#FAF8F1] rounded-2xl rounded-tr-xs p-3.5 text-xs shadow-xs leading-relaxed">
                        <p>{inter.mensaje_usuario}</p>
                      </div>
                    </div>

                    {/* Respuesta de DOC */}
                    <div className="flex items-start space-x-3">
                      <img
                        src={avatarDOC}
                        alt="DOC"
                        className="w-8 h-8 rounded-xl object-cover shrink-0 border border-[#E5DFD3] bg-white shadow-xs mt-1"
                      />
                      <div className="max-w-[88%] bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl rounded-tl-xs p-4 text-xs text-[#263A50] shadow-xs space-y-2">
                        <p className="whitespace-pre-wrap leading-relaxed">{inter.respuesta_doc}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#586879] pt-1.5 border-t border-[#F0EBE0]">
                          <span className="font-mono text-[#819783]">
                            {inter.respuesta_doc.trim().split(/\s+/).length} palabras (límite &lt;180)
                          </span>
                          {inter.fue_fallback && (
                            <span className="bg-[#EEE7D7] text-[#263A50] px-1.5 py-0.5 rounded">
                              Modo local de contingencia
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {cargandoDOC && (
                  <div className="flex items-center space-x-3 text-xs text-[#586879] animate-pulse">
                    <img src={avatarDOC} alt="DOC" className="w-8 h-8 rounded-xl opacity-70" />
                    <span>DOC está pensando tu respuesta...</span>
                  </div>
                )}
              </div>

              {/* Botonera de Acciones Rápidas (según el Mockup Pantalla 4) */}
              <div className="p-3 bg-[#FAF8F1] border-t border-[#E5DFD3] flex items-center space-x-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleEjecutarDesglose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEE7D7] border border-[#DDD4C0] text-xs font-semibold text-[#263A50] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  📑 Desglosar en 3 puntos
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEnviarMensajeDOC(
                      'DOC, ¿podés generarme una plantilla estructurada para el Trabajo Práctico de Regresión?',
                      'asistencia_tecnica'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEE7D7] border border-[#DDD4C0] text-xs font-semibold text-[#263A50] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  📝 Generar plantilla de TP
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEnviarMensajeDOC(
                      'DOC, esta semana tengo horas extras en el trabajo. ¿Cómo reorganizamos las entregas para no quemarme?',
                      'planificacion'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEE7D7] border border-[#DDD4C0] text-xs font-semibold text-[#263A50] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  🔄 Reorganizar entregas
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleEnviarChat} className="p-4 bg-white border-t border-[#E5DFD3] flex space-x-2">
                <input
                  type="text"
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  placeholder="Escribile a DOC sobre tu cursada, dudas o cansancio del día..."
                  className="flex-1 px-4 py-2.5 text-xs bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783]"
                />
                <button
                  type="submit"
                  disabled={!mensajeInput.trim() || cargandoDOC}
                  className="px-4 py-2.5 rounded-xl bg-[#263A50] hover:bg-[#1E2E40] text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Columna Derecha: Herramienta de Desglose de Lecturas */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                  <h3 className="font-serif text-base font-bold text-[#263A50]">
                    Herramienta de Desglose de Lecturas
                  </h3>
                </div>

                <p className="text-xs text-[#586879] leading-relaxed">
                  Pegá el apunte denso de la materia y DOC lo sintetizará en: <strong>1 concepto clave</strong>, <strong>1 analogía cotidiana</strong> y <strong>1 micro-acción de 15 min</strong>.
                </p>

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={textoParaDesglose}
                    onChange={(e) => setTextoParaDesglose(e.target.value)}
                    placeholder="Escribí o pegá el texto técnico a desglosar..."
                    className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-3 text-xs text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783]"
                  />

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#586879] uppercase font-semibold tracking-wider block">
                      Cargar apunte de ejemplo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setTextoParaDesglose(
                            'En el entrenamiento de redes neuronales artificiales, el algoritmo de retropropagación (backpropagation) calcula el gradiente de la función de pérdida con respecto a los pesos sinápticos mediante la regla de la cadena, permitiendo ajustar los hiperparámetros capa por capa.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[11px] text-[#263A50] font-medium transition-colors cursor-pointer"
                      >
                        Redes: Backpropagation
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTextoParaDesglose(
                            'La matriz de confusión evalúa el rendimiento de un clasificador binario o multiclase detallando verdaderos positivos, falsos positivos, verdaderos negativos y falsos negativos, sirviendo de base para calcular métricas como Precisión, Recall y F1-Score.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[11px] text-[#263A50] font-medium transition-colors cursor-pointer"
                      >
                        Métricas: Matriz de Confusión
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleEjecutarDesglose}
                    disabled={desglosando}
                    className="w-full py-2.5 rounded-xl bg-[#263A50] hover:bg-[#1E2E40] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 stroke-[1.75]" />
                    <span>{desglosando ? 'Desglosando lectura con DOC...' : 'Desglosar en 3 puntos'}</span>
                  </button>
                </div>

                {desgloseResultado && (
                  <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#819783]/40 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-[#819783] font-bold uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Síntesis Conceptual de DOC (&lt;160 palabras):</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onEnviarMensajeDOC(`DOC, te comparto el desglose que hicimos:\n${desgloseResultado}`, 'desglose_lectura')
                        }
                        className="text-[10px] text-[#263A50] hover:text-[#819783] font-semibold underline cursor-pointer"
                      >
                        Enviar al chat
                      </button>
                    </div>
                    <div className="text-xs text-[#263A50] whitespace-pre-wrap leading-relaxed font-sans">
                      {desgloseResultado}
                    </div>
                  </div>
                )}
              </div>

              {/* Pedagogía No Punitiva */}
              <div className="p-5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl space-y-2 text-xs text-[#586879] shadow-xs">
                <div className="font-serif font-bold text-[#263A50] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#819783]" />
                  <span>Pedagogía No Punitiva</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  DOC nunca te penalizará por demoras ni preguntas básicas. Tu proceso de aprendizaje en el IFTS N.º 12 avanza un paso a la vez con respeto a tus tiempos laborales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 7: MÓDULO DE MOTIVACIÓN, GAMIFICACIÓN Y VISIÓN A FUTURO          */}
      {/* ========================================================================= */}
      {pantallaActiva === 'gamificacion' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Banner de Nivel Desbloqueado */}
          <div className="bg-[#FEF9E7] border border-[#F9E79F] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#B8863A] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                🏆
              </div>
              <div>
                <div className="text-xs font-bold text-[#B8863A] uppercase tracking-wider">
                  DOCE · Incentivos Progresivos
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#263A50]">
                  {presetActivo.microVictorias.nivel}
                </h2>
                <p className="text-xs text-[#586879] mt-0.5">
                  Consistencia en entregas y superación del período crítico de cursada
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold text-[#263A50] bg-white px-3.5 py-1.5 rounded-xl border border-[#F9E79F] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#819783]" />
              <span>{presetActivo.microVictorias.puntos} Puntos DOCE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tarjeta 1: Micro-Victoria */}
            <div className="md:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center">
                  <Award className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Micro-Victoria de la Semana
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#EBF1EC] border-2 border-[#819783] mx-auto flex items-center justify-center text-2xl">
                  🎖️
                </div>
                <div className="font-serif text-lg font-bold text-[#263A50]">
                  {presetActivo.microVictorias.insignia}
                </div>
                <p className="text-xs text-[#586879] max-w-sm mx-auto">
                  {presetActivo.microVictorias.motivacion}
                </p>
              </div>
            </div>

            {/* Tarjeta 2: Progreso Mensual (Histórico Positivo) */}
            <div className="md:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEE7D7] text-[#263A50] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Progreso Mensual
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-[#EBF1EC] border border-[#CDE0D0] text-center space-y-2">
                <div className="text-xs font-semibold text-[#819783] uppercase tracking-wider">
                  Evolución en la cohorte
                </div>
                <div className="font-serif text-xl font-bold text-[#263A50]">
                  {presetActivo.microVictorias.historico}
                </div>
                <p className="text-xs text-[#586879]">
                  Reconocimiento al avance sostenido y compatibilización con tus tiempos personales.
                </p>
              </div>
            </div>

            {/* Tarjeta 3: Proyección 2° Año (Visión de Futuro Profesional) */}
            <div className="md:col-span-7 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center">
                    <Brain className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#263A50]">
                      Proyección 2° Año · Ciencia de Datos e IA
                    </h3>
                    <div className="text-[11px] text-[#586879]">
                      El camino que estás construyendo en el IFTS N.º 12
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#819783] bg-[#EBF1EC] px-2.5 py-1 rounded-full border border-[#D0DEC7]">
                  ¡Próximamente!
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-3">
                <p className="text-xs text-[#263A50] leading-relaxed">
                  En <strong>Ciencia de Datos II</strong> vas a construir tus propios recomendadores de IA basados en redes neuronales profundas y procesamiento de lenguaje natural (NLP).
                </p>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-[#263A50]">
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD3]">
                    🐍 Python Avanzado
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD3]">
                    ⚡ PyTorch & HuggingFace
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD3]">
                    🚀 Despliegue en Cloud
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 4: Mensaje Final de DOC */}
            <div className="md:col-span-5 bg-[#263A50] text-[#FAF8F1] rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={avatarDOC}
                    alt="DOC"
                    className="w-10 h-10 rounded-xl object-cover bg-white p-0.5 border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#819783]">
                      DOC te acompaña
                    </div>
                    <div className="font-serif text-sm font-bold">
                      Acompañamiento a tu medida
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#EEE7D7]">
                  “¡Te falta muy poquito para terminar la entrega de hoy! ¿La hacemos juntos en un bloque de 15 minutos en el colectivo o antes de cenar?”
                </p>
              </div>

              <button
                onClick={() => setPantallaActiva('cursada_foco')}
                className="w-full py-2.5 rounded-xl bg-[#819783] hover:bg-[#6E8370] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>¡A darle! Ver mi plan de estudio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
