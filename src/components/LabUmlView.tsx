/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Laboratorio de Inteligencia Artificial y Arquitectura UML
 * Ecosistema DOCE · IFTS N.º 12
 * "Una identidad cercana y adulta · Tu acompañamiento a medida"
 */

import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  Binary,
  Layers,
  ArrowRight,
  GitBranch,
  Boxes,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import {
  RedNeuronalPredictiva,
  VectorEstudiante,
  RitmoEstudio,
} from '../domain/models.js';

interface LabUmlViewProps {
  redNeuronal: RedNeuronalPredictiva;
}

export const LabUmlView: React.FC<LabUmlViewProps> = ({ redNeuronal }) => {
  const [seccion, setSeccion] = useState<'uml' | 'simulador'>('simulador');

  // Sliders del Simulador en Vivo
  const [horasTrabajo, setHorasTrabajo] = useState(42);
  const [minutosViaje, setMinutosViaje] = useState(90);
  const [personasCargo, setPersonasCargo] = useState(1);
  const [estres, setEstres] = useState(8);
  const [ritmo, setRitmo] = useState<RitmoEstudio>('Fragmentado');
  const [notaPromedio, setNotaPromedio] = useState(5.5);
  const [asistencia, setAsistencia] = useState(70);
  const [entregasAtrasadas, setEntregasAtrasadas] = useState(2);
  const [avanceCarrera, setAvanceCarrera] = useState(35);

  // Inferencia reactiva en vivo
  const vectorActual: VectorEstudiante = useMemo(() => {
    return {
      horas_trabajo_semanal: horasTrabajo,
      minutos_viaje: minutosViaje,
      personas_a_cargo: personasCargo,
      nivel_estres_percibido: estres,
      ritmo_estudio: ritmo,
      nota_promedio: notaPromedio,
      asistencia_promedio: asistencia,
      entregas_atrasadas_totales: entregasAtrasadas,
      porcentaje_avance_carrera: avanceCarrera,
    };
  }, [horasTrabajo, minutosViaje, personasCargo, estres, ritmo, notaPromedio, asistencia, entregasAtrasadas, avanceCarrera]);

  const { prediccion, alerta } = useMemo(() => {
    return redNeuronal.evaluar_riesgo(vectorActual, 'est-simulacion-live');
  }, [redNeuronal, vectorActual]);

  return (
    <div className="space-y-6">
      {/* Top Banner Editorial */}
      <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-[#EBF1EC] text-[#819783]">
                <BrainCircuit className="w-5 h-5 stroke-[1.75]" />
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#263A50] tracking-tight">
                Laboratorio de IA y Arquitectura UML
              </h1>
              <span className="w-2 h-2 rounded-full bg-[#819783]" />
            </div>
            <p className="text-xs sm:text-sm text-[#586879]">
              Telemetría del modelo supervisado IFTS 12 y explorador de relaciones orientadas a objetos.
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center space-x-1.5 bg-[#EEE7D7]/70 p-1 rounded-xl border border-[#E2DBCF] text-xs">
            <button
              onClick={() => setSeccion('simulador')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 font-semibold ${
                seccion === 'simulador'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Simulador de Red Neuronal</span>
            </button>

            <button
              onClick={() => setSeccion('uml')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 font-semibold ${
                seccion === 'uml'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Diagrama de Clases UML</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- SECCIÓN 1: SIMULADOR DE RED NEURONAL ---------------- */}
      {seccion === 'simulador' && (
        <div className="space-y-6">
          {/* Telemetry Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl p-3.5 shadow-xs">
              <div className="text-[10px] uppercase font-semibold text-[#586879]">Versión Modelo</div>
              <div className="text-sm font-mono font-bold text-[#263A50] mt-1">{redNeuronal.version_modelo}</div>
              <div className="text-[10px] text-[#819783]">Perceptrón Multicapa</div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl p-3.5 shadow-xs">
              <div className="text-[10px] uppercase font-semibold text-[#586879]">F1-Score</div>
              <div className="text-lg font-bold font-serif text-[#263A50] mt-1">{(redNeuronal.f1_score * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[#819783]">Balance Precisión/Recall</div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl p-3.5 shadow-xs">
              <div className="text-[10px] uppercase font-semibold text-[#586879]">Exactitud (Accuracy)</div>
              <div className="text-lg font-bold font-serif text-[#263A50] mt-1">{(redNeuronal.accuracy * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[#586879]">Validación cruzada 5-fold</div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl p-3.5 shadow-xs">
              <div className="text-[10px] uppercase font-semibold text-[#586879]">Precision / Recall</div>
              <div className="text-lg font-bold font-serif text-[#263A50] mt-1">90.5% / 92.0%</div>
              <div className="text-[10px] text-[#819783]">Minimiza falsos negativos</div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl p-3.5 shadow-xs col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-semibold text-[#586879]">Dataset Histórico</div>
              <div className="text-lg font-bold font-serif text-[#263A50] mt-1">{redNeuronal.total_entrenamientos}</div>
              <div className="text-[10px] text-[#586879]">Cohortes IFTS 12</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Sliders Panel (col 7) */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3]">
                <h3 className="font-serif text-sm font-bold text-[#263A50] flex items-center space-x-2">
                  <Binary className="w-4 h-4 text-[#819783] stroke-[1.75]" />
                  <span>Ajuste de Vector del Estudiante en Tiempo Real</span>
                </h3>
                <span className="text-[11px] text-[#819783] font-mono">Inferencia reactiva</span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Horas trabajo */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Horas Trabajo:</span>
                    <span className="font-mono font-bold text-[#263A50]">{horasTrabajo} h/sem</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="2"
                    value={horasTrabajo}
                    onChange={(e) => setHorasTrabajo(Number(e.target.value))}
                    className="w-full accent-[#819783] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: +0.22</div>
                </div>

                {/* Minutos Viaje */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Minutos Viaje:</span>
                    <span className="font-mono font-bold text-[#263A50]">{minutosViaje} min</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="5"
                    value={minutosViaje}
                    onChange={(e) => setMinutosViaje(Number(e.target.value))}
                    className="w-full accent-[#819783] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: +0.12</div>
                </div>

                {/* Personas a cargo */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Personas a Cargo:</span>
                    <span className="font-mono font-bold text-[#263A50]">{personasCargo}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={personasCargo}
                    onChange={(e) => setPersonasCargo(Number(e.target.value))}
                    className="w-full accent-[#819783] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: +0.10</div>
                </div>

                {/* Estrés */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Estrés Autopercibido:</span>
                    <span className="font-mono font-bold text-[#263A50]">{estres} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={estres}
                    onChange={(e) => setEstres(Number(e.target.value))}
                    className="w-full accent-[#819783] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: +0.14</div>
                </div>

                {/* Nota Promedio */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Nota Promedio:</span>
                    <span className="font-mono font-bold text-[#263A50]">{notaPromedio.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={notaPromedio}
                    onChange={(e) => setNotaPromedio(Number(e.target.value))}
                    className="w-full accent-[#819783] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: -0.25 (factor protector)</div>
                </div>

                {/* Asistencia */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Asistencia Promedio:</span>
                    <span className="font-mono font-bold text-[#263A50]">{asistencia}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={asistencia}
                    onChange={(e) => setAsistencia(Number(e.target.value))}
                    className="w-full accent-[#819783] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: -0.20 (factor protector)</div>
                </div>

                {/* Entregas Atrasadas */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#263A50] font-medium">Entregas Pendientes:</span>
                    <span className="font-mono font-bold text-[#B85D43]">{entregasAtrasadas} TP</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={entregasAtrasadas}
                    onChange={(e) => setEntregasAtrasadas(Number(e.target.value))}
                    className="w-full accent-[#B85D43] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#586879]">Peso sináptico: +0.28 (correlación r=0.74)</div>
                </div>

                {/* Ritmo de Estudio */}
                <div className="space-y-1 bg-[#FAF8F1] p-3 rounded-xl border border-[#E5DFD3]">
                  <span className="text-xs text-[#263A50] font-medium block">Ritmo de Estudio:</span>
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    {(['Continuo', 'Fragmentado', 'Nocturno'] as RitmoEstudio[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRitmo(r)}
                        className={`py-1 text-[11px] rounded-lg border font-medium transition-all ${
                          ritmo === r
                            ? 'bg-[#263A50] text-[#FAF8F1] border-[#263A50]'
                            : 'bg-white border-[#E5DFD3] text-[#586879]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inferencia Result (col 5) */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E5DFD3]">
                  <span className="font-bold text-[#263A50] uppercase tracking-wider">
                    Resultado de Inferencia (MLP)
                  </span>
                  <span className="font-mono text-[10px] text-[#586879]">ID: {prediccion.id_prediccion}</span>
                </div>

                {/* Gauge Meter */}
                <div className="py-6 text-center space-y-2">
                  <div className="text-4xl font-extrabold font-serif text-[#263A50]">
                    {Math.round(prediccion.probabilidad_desercion * 100)}%
                  </div>
                  <div className="text-xs text-[#586879] uppercase tracking-wider">
                    Probabilidad Estimada de Demora o Deserción
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                      prediccion.nivel_riesgo === 'Alto'
                        ? 'bg-[#F9EFEB] text-[#B85D43] border-[#B85D43]/30'
                        : prediccion.nivel_riesgo === 'Moderado'
                        ? 'bg-[#FAF3E6] text-[#B8863A] border-[#B8863A]/30'
                        : 'bg-[#EBF1EC] text-[#819783] border-[#819783]/30'
                    }`}
                  >
                    Nivel de Acompañamiento: {prediccion.nivel_riesgo}
                  </span>
                </div>
              </div>

              {/* Dynamic Alert Trigger status */}
              <div className="p-4 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#263A50]">Disparo Automático de Alerta:</span>
                  {alerta ? (
                    <span className="text-[#B85D43] flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>ACOMPAÑAMIENTO REQUERIDO (P &gt;= 65%)</span>
                    </span>
                  ) : (
                    <span className="text-[#819783] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sin Intervención Necesaria</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#586879]">
                  {alerta
                    ? `Se genera una entidad Alerta(id="${alerta.id_alerta}", estado="Pendiente") y se orienta al dashboard de tutoría para coordinar contención no punitiva.`
                    : 'La probabilidad se encuentra controlada dentro de los rangos regulares de la cursada.'}
                </p>
              </div>

              {/* Explainable AI Factors */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#263A50]">
                  Factores Críticos Identificados (XAI):
                </div>
                {prediccion.factores_criticos.length > 0 ? (
                  <div className="space-y-1.5">
                    {prediccion.factores_criticos.map((f, i) => (
                      <div
                        key={i}
                        className="bg-[#FAF8F1] p-2.5 rounded-lg border border-[#E5DFD3] text-xs space-y-0.5"
                      >
                        <div className="flex justify-between items-center text-[11px] font-semibold text-[#263A50]">
                          <span>{f.nombre}</span>
                          <span className="text-[#819783]">Impacto {f.impacto}%</span>
                        </div>
                        <p className="text-[10px] text-[#586879]">{f.descripcion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#586879] italic">
                    Sin factores críticos de riesgo significativo en este vector.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SECCIÓN 2: DIAGRAMA DE CLASES UML ---------------- */}
      {seccion === 'uml' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#263A50] flex items-center space-x-2">
                <Boxes className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                <span>Arquitectura Orientada a Objetos: Clases y Relaciones UML del Ecosistema DOCE</span>
              </h2>
              <p className="text-xs text-[#586879] mt-1">
                Representación exacta de los cuatro módulos del sistema, implementados en TypeScript y validados con pruebas unitarias.
              </p>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Módulo de Usuarios y Roles (Herencia) */}
              <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#263A50]" />
                    <h3 className="font-serif text-sm font-bold text-[#263A50]">1. Módulo de Usuarios y Roles</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EEE7D7] text-[#263A50]">
                    Herencia (Generalización)
                  </span>
                </div>

                {/* Base Class */}
                <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] font-mono text-xs space-y-1 shadow-xs">
                  <div className="text-[#263A50] font-bold">«Superclase» Usuario</div>
                  <div className="text-[11px] text-[#586879]">
                    + id_usuario: string<br />
                    + nombre: string<br />
                    + email: string<br />
                    + rol: 'estudiante' | 'tutor'
                  </div>
                  <div className="text-[11px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                    + iniciar_sesion(): boolean<br />
                    + cerrar_sesion(): boolean
                  </div>
                </div>

                <div className="flex justify-center text-[#586879] text-xs font-serif italic">
                  ▲ Hereda de Usuario ▲
                </div>

                {/* Subclasses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold">Estudiante</div>
                    <div className="text-[10px] text-[#586879]">
                      + legajo: string<br />
                      + estilo_aprendizaje: string<br />
                      + cohorte: string
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + completar_onboarding()<br />
                      + consultar_trayectoria()<br />
                      + interactuar_con_doc()
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold">Tutor</div>
                    <div className="text-[10px] text-[#586879]">
                      + especialidad: string<br />
                      + legajo_docente: string
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + consultar_dashboard_alertas()<br />
                      + registrar_intervencion()
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Módulo de Perfil y Cursada (Composición y Agregación) */}
              <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#819783]" />
                    <h3 className="font-serif text-sm font-bold text-[#263A50]">2. Perfil y Cursada Académica</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EEE7D7] text-[#263A50]">
                    Composición (1:1, 1..*) & Agregación
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold flex justify-between">
                      <span>PerfilEstudio</span>
                      <span className="text-[10px] text-[#819783] font-normal">◆ Composición 1:1 con Estudiante</span>
                    </div>
                    <div className="text-[10px] text-[#586879]">
                      + horas_trabajo_semanal: number<br />
                      + minutos_viaje: number<br />
                      + personas_a_cargo: number<br />
                      + nivel_estres_percibido: number
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + actualizar_perfil()<br />
                      + es_vulnerable(): boolean
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold flex justify-between">
                      <span>Cursada</span>
                      <span className="text-[10px] text-[#263A50] font-normal">◇ Agregación 0..* con Estudiante</span>
                    </div>
                    <div className="text-[10px] text-[#586879]">
                      + codigo_materia: string<br />
                      + nombre_materia: string<br />
                      + porcentaje_avance: number
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + obtener_mapa_calor(avance_esperado)
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold flex justify-between">
                      <span>ResultadoAcademico</span>
                      <span className="text-[10px] text-[#819783] font-normal">◆ Composición 1..* con Cursada</span>
                    </div>
                    <div className="text-[10px] text-[#586879]">
                      + nota_parcial: number<br />
                      + asistencia_porcentaje: number<br />
                      + entregas_atrasadas: number
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + calcular_promedio(): number
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Módulo de IA Predictiva y Alertas (Dependencia e Invocación) */}
              <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B85D43]" />
                    <h3 className="font-serif text-sm font-bold text-[#263A50]">3. IA Predictiva y Alertas</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EEE7D7] text-[#263A50]">
                    Dependencia & Invocación
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold">RedNeuronalPredictiva</div>
                    <div className="text-[10px] text-[#586879]">
                      + version_modelo: string<br />
                      + f1_score: number<br />
                      + accuracy: number
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + evaluar_riesgo(vector_estudiante): &#123;prediccion, alerta&#125;
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                      <div className="text-[#263A50] font-bold">PrediccionRiesgo</div>
                      <div className="text-[10px] text-[#586879]">
                        + probabilidad_desercion: number<br />
                        + nivel_riesgo: 'Alto'|'Mod'|'Bajo'
                      </div>
                      <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                        + clasificar_riesgo()
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                      <div className="text-[#263A50] font-bold">Alerta (1 --&gt; 0..1)</div>
                      <div className="text-[10px] text-[#586879]">
                        + estado: 'Pendiente'|'Atendida'<br />
                        + fecha_generacion: string
                      </div>
                      <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                        + notificar_tutoria()<br />
                        + marcar_atendida()
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Módulo de IA Conversacional (Asociación) */}
              <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#819783]" />
                    <h3 className="font-serif text-sm font-bold text-[#263A50]">4. IA Conversacional (Agente DOC)</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EEE7D7] text-[#263A50]">
                    Asociación (--)
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold">AgenteDOC</div>
                    <div className="text-[10px] text-[#586879]">
                      + system_prompt: string (No punitivo)<br />
                      + limite_palabras: number (&lt; 180)<br />
                      + modo: 'motivacion' | 'desglose_lectura'
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + desglosar_lectura(texto, materia)<br />
                      + generar_mensaje_motivacional()<br />
                      + activar_fallback()
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#E5DFD3] space-y-1 shadow-xs">
                    <div className="text-[#263A50] font-bold">InteraccionDOC</div>
                    <div className="text-[10px] text-[#586879]">
                      + id_interaccion: string<br />
                      + mensaje_usuario: string<br />
                      + respuesta_doc: string<br />
                      + conteo_palabras: number
                    </div>
                    <div className="text-[10px] text-[#819783] pt-1 border-t border-[#E5DFD3]">
                      + registrar_interaccion()
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
