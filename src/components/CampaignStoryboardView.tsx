/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Identidad Visual Cercana y Adulta & Storyboard Institucional
 * DOCE · Tu acompañamiento a medida
 * Tecnicatura en Ciencia de Datos e Inteligencia Artificial - IFTS N.º 12
 */

import React, { useState } from 'react';
import {
  Palette,
  Check,
  X,
  FileText,
  ExternalLink,
  BookOpen,
  Clapperboard,
  Coffee,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

export const CampaignStoryboardView: React.FC = () => {
  const [escenaActiva, setEscenaActiva] = useState<number>(1);
  const [tabInterno, setTabInterno] = useState<'identidad' | 'storyboard'>('identidad');

  return (
    <div className="space-y-6">
      {/* Header Banner Editorial con Tipografía Domine */}
      <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EEE7D7] text-[#263A50] border border-[#DDD4C0]">
                Guía Oficial de Marca · IFTS N.º 12
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
              <span className="text-xs text-[#586879]">Grupo 6 · Ciclo Lectivo 2027</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#263A50] tracking-tight">
              Una identidad cercana y adulta
            </h1>

            <p className="text-sm text-[#586879] max-w-2xl leading-relaxed">
              DOCE propone un acompañamiento a medida: un compañero digital para organizar el estudio y una herramienta institucional para reconocer necesidades sin etiquetar ni sancionar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/assets/aistudio/DOCE_-_Pre_entrega_-_Medios_de_Comunicaci_n_ae7e7e40.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#263A50] text-xs font-semibold transition-all flex items-center space-x-2 shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#819783] stroke-[1.75]" />
              <span>Ver PDF del Anexo</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#586879]" />
            </a>

            <div className="flex rounded-xl bg-[#EEE7D7]/70 p-1 border border-[#E2DBCF]">
              <button
                onClick={() => setTabInterno('identidad')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tabInterno === 'identidad'
                    ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                    : 'text-[#586879] hover:text-[#263A50]'
                }`}
              >
                Identidad y Estilo
              </button>
              <button
                onClick={() => setTabInterno('storyboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tabInterno === 'storyboard'
                    ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                    : 'text-[#586879] hover:text-[#263A50]'
                }`}
              >
                Storyboard 2027
              </button>
            </div>
          </div>
        </div>

        {/* Citas Clave del Ecosistema */}
        <div className="mt-6 pt-5 border-t border-[#E5DFD3] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#E5DFD3] space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#819783] tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
              <span>Idea Fuerza de la Campaña</span>
            </div>
            <div className="font-serif text-base font-bold text-[#263A50]">
              “DOCE: un compañero para estudiar y una herramienta para acompañar.”
            </div>
          </div>

          <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#E5DFD3] space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#586879] tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#586879]" />
              <span>Firma y Filosofía</span>
            </div>
            <div className="text-xs text-[#263A50] leading-relaxed">
              <strong>DOCE. Tu acompañamiento a medida.</strong> Personas adultas, contextos cotidianos y distintas formas de estudiar en el IFTS N.º 12.
            </div>
          </div>
        </div>
      </div>

      {tabInterno === 'identidad' && (
        <div className="space-y-6">
          {/* Documento Oficial de la Identidad Adulta Adjunto */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                <h2 className="font-serif text-lg font-bold text-[#263A50]">
                  Documento Rector: Sistema Visual y Criterios Creativos
                </h2>
              </div>
              <span className="text-xs text-[#586879] font-medium">
                Página 8 · Guía Oficial DOCE
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#E5DFD3] bg-[#FAF8F1] shadow-xs">
              <img
                src="/assets/aistudio/DOCE_identidad_adulta_0ee6b3eb.jpeg"
                alt="DOCE - Una identidad cercana y adulta"
                className="w-full h-auto object-contain max-h-[520px] mx-auto"
              />
            </div>
          </div>

          {/* Desglose Interactivo de la Identidad: Paleta, Tipografías y Criterios SÍ / NO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Paleta Oficial (col-6) */}
            <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#E5DFD3]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#819783]" />
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Paleta Cromática Institucional
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Azul Marino */}
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-[#263A50] border border-[#1A2837] shadow-xs flex items-end p-2">
                    <span className="text-[10px] font-mono text-[#FAF8F1] font-semibold">#263A50</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#263A50]">Azul marino</div>
                    <div className="text-[11px] text-[#586879]">Solidez y estructura</div>
                  </div>
                </div>

                {/* Verde Sabio */}
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-[#819783] border border-[#6B806D] shadow-xs flex items-end p-2">
                    <span className="text-[10px] font-mono text-white font-semibold">#819783</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#263A50]">Verde sabio</div>
                    <div className="text-[11px] text-[#586879]">Acompañamiento y firma</div>
                  </div>
                </div>

                {/* Crema */}
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-[#EEE7D7] border border-[#DDD4C0] shadow-xs flex items-end p-2">
                    <span className="text-[10px] font-mono text-[#263A50] font-semibold">#EEE7D7</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#263A50]">Crema</div>
                    <div className="text-[11px] text-[#586879]">Superficies cálidas</div>
                  </div>
                </div>

                {/* Papel de arroz */}
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] shadow-xs flex items-end p-2">
                    <span className="text-[10px] font-mono text-[#263A50] font-semibold">#FAF8F1</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#263A50]">Papel de arroz</div>
                    <div className="text-[11px] text-[#586879]">Lienzo editorial</div>
                  </div>
                </div>
              </div>

              {/* Tipografía Oficial */}
              <div className="pt-3 border-t border-[#E5DFD3] space-y-3">
                <div className="text-xs font-bold text-[#263A50] flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-[#819783] stroke-[1.75]" />
                  <span>Tipografía Editorial</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] space-y-1">
                    <div className="font-serif text-2xl font-bold text-[#263A50]">Aa</div>
                    <div className="text-xs font-bold text-[#263A50]">Títulos: Domine</div>
                    <div className="text-[11px] text-[#586879]">Serif editorial cálida y humana</div>
                  </div>

                  <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] space-y-1">
                    <div className="font-sans text-2xl font-bold text-[#263A50]">Aa</div>
                    <div className="text-xs font-bold text-[#263A50]">Textos: Public Sans</div>
                    <div className="text-[11px] text-[#586879]">Sans serif clara, legible y limpia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directrices SÍ vs NO (col-6) */}
            <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#E5DFD3]">
                <Compass className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Criterios de Diseño (SÍ vs. NO)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Columna SÍ */}
                <div className="p-4 bg-[#EBF1EC]/60 rounded-xl border border-[#819783]/30 space-y-3">
                  <div className="text-xs font-bold text-[#4B634E] uppercase tracking-wider flex items-center space-x-1.5">
                    <Check className="w-4 h-4 text-[#819783] stroke-[2.5]" />
                    <span>SÍ (Identidad Adulta)</span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#263A50]">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#819783] font-bold">✓</span>
                      <span><strong>Íconos lineales:</strong> Trazo fino y claro, sin estridencias.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#819783] font-bold">✓</span>
                      <span><strong>Texturas de papel sutiles:</strong> Tonos cálidos y naturales.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#819783] font-bold">✓</span>
                      <span><strong>El punto verde como firma:</strong> Sello de cercanía empática.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#819783] font-bold">✓</span>
                      <span><strong>Personas adultas:</strong> Contextos cotidianos de estudio real.</span>
                    </li>
                  </ul>
                </div>

                {/* Columna NO */}
                <div className="p-4 bg-[#F9EFEB]/70 rounded-xl border border-[#B85D43]/20 space-y-3">
                  <div className="text-xs font-bold text-[#9C4B33] uppercase tracking-wider flex items-center space-x-1.5">
                    <X className="w-4 h-4 text-[#B85D43] stroke-[2.5]" />
                    <span>NO (A Evitar)</span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#263A50]">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#B85D43] font-bold">✗</span>
                      <span><strong>Personajes estilo mascota:</strong> Sin estética infantil.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#B85D43] font-bold">✗</span>
                      <span><strong>Semáforos que etiqueten:</strong> Sin castigos visuales punitivos.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#B85D43] font-bold">✗</span>
                      <span><strong>Estética de videojuego:</strong> Sin neones ni insignias arcade.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#B85D43] font-bold">✗</span>
                      <span><strong>Juicios sancionatorios:</strong> Siempre acompañamiento reflexivo.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E5DFD3] text-xs text-[#586879] leading-relaxed">
                💡 <strong>Dignidad del Estudiante Adulto:</strong> En el IFTS N.º 12, los estudiantes combinan 38 horas de trabajo semanal con 75 minutos de viaje. DOCE respeta sus tiempos de vida sin paternalismos ni etiquetas.
              </div>
            </div>
          </div>
        </div>
      )}

      {tabInterno === 'storyboard' && (
        <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
            <div className="flex items-center space-x-2">
              <Clapperboard className="w-5 h-5 text-[#819783] stroke-[1.75]" />
              <h2 className="font-serif text-lg font-bold text-[#263A50]">
                2. Storyboard para Piezas Audiovisuales (Campaña 2027)
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#EEE7D7] text-[#263A50]">
              4 Momentos de Acompañamiento
            </span>
          </div>

          <p className="text-xs text-[#586879] leading-relaxed">
            Guion visual desarrollado por el Grupo 6 para la difusión en campus virtual y canales institucionales, mostrando la transición del agobio a la finalización exitosa.
          </p>

          {/* Pieza Gráfica 4 Paneles */}
          <div className="bg-[#FAF8F1] p-3 rounded-2xl border border-[#E5DFD3] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#586879]">
              <span className="font-bold text-[#263A50]">Registro de Campaña Audiovisual</span>
              <span className="text-[11px] text-[#819783]">1: Análisis · 2: Desglose · 3: Café & Pausa · 4: Logro</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#E5DFD3] bg-white flex items-center justify-center p-2">
              <img
                src="/assets/aistudio/f37443e7-e749-4d5e-a8f8-0cc934297258_54687733.png"
                alt="Storyboard 4 Paneles DOCE - Grupo 6"
                className="w-full max-h-80 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Selector de Escena */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { num: 1, title: 'Panel 1: Diagnóstico', tag: '1. Diagnóstico' },
              { num: 2, title: 'Panel 2: Desglose', tag: '2. Desglose' },
              { num: 3, title: 'Panel 3: Enfoque & Pausa', tag: '3. Enfoque' },
              { num: 4, title: 'Panel 4: Logro', tag: '4. Victoria' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setEscenaActiva(s.num)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  escenaActiva === s.num
                    ? 'bg-[#263A50] text-[#FAF8F1] border-[#263A50] shadow-xs'
                    : 'bg-[#FAF8F1] border-[#E5DFD3] text-[#586879] hover:text-[#263A50] hover:bg-[#EEE7D7]'
                }`}
              >
                <div className="text-[10px] font-semibold uppercase">{s.tag}</div>
                <div className="text-xs font-bold mt-0.5">Escena {s.num}</div>
              </button>
            ))}
          </div>

          {/* Detalle de la Escena Activa */}
          <div className="bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-5 space-y-3">
            {escenaActiva === 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#B85D43] uppercase tracking-wider">
                    Escena 1: El Estudiante Abrumado
                  </span>
                  <span className="text-[#586879] font-mono">00:00 - 00:05</span>
                </div>
                <p className="text-xs text-[#263A50] leading-relaxed">
                  Plano medio del estudiante sentado frente al escritorio tras una larga jornada de trabajo y viaje en transporte público. Apuntes acumulados y pantalla abierta.
                </p>
                <div className="text-xs italic text-[#B85D43]">
                  Pensamiento: “No llego a leer todo esto... son demasiados conceptos juntos.”
                </div>
              </div>
            )}

            {escenaActiva === 2 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#263A50] uppercase tracking-wider">
                    Escena 2: Asistencia de DOC (Desglose)
                  </span>
                  <span className="text-[#586879] font-mono">00:05 - 00:12</span>
                </div>
                <p className="text-xs text-[#263A50] leading-relaxed">
                  Aparece el panel de acompañamiento digital DOC con una síntesis clara y amigable en tres puntos clave.
                </p>
                <div className="text-xs italic text-[#819783]">
                  DOC: “No hace falta leer todo de golpe. Vamos a desglosarlo en 3 puntos clave y un micro-bloque de 15 minutos.”
                </div>
              </div>
            )}

            {escenaActiva === 3 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#819783] uppercase tracking-wider">
                    Escena 3: Pausa y Enfoque Adaptativo
                  </span>
                  <span className="text-[#586879] font-mono">00:12 - 00:20</span>
                </div>
                <p className="text-xs text-[#263A50] leading-relaxed">
                  El estudiante activa una sesión corta de 25 minutos con sonidos ambientales relajantes. DOC propone una pausa activa con café. El rostro del estudiante se relaja.
                </p>
                <div className="text-xs italic text-[#263A50]">
                  Estudiante: “Ahora sí se comprende cómo se conecta este modelo con el trabajo práctico.”
                </div>
              </div>
            )}

            {escenaActiva === 4 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#819783] uppercase tracking-wider">
                    Escena 4: Entrega Aprobada y Cierre
                  </span>
                  <span className="text-[#586879] font-mono">00:20 - 00:30</span>
                </div>
                <p className="text-xs text-[#263A50] leading-relaxed">
                  Entrega confirmada a tiempo. Notificación de tarea aprobada y tranquilidad alcanzada. Cierre institucional con la firma DOCE.
                </p>
                <div className="text-xs italic text-[#263A50]">
                  Voz en off: “DOCE: un compañero para estudiar y una herramienta para acompañar. IFTS N.º 12.”
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
