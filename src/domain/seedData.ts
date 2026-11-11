/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Semillas de datos determinísticas para el Ecosistema DOCE - IFTS N.º 12
 */

import {
  Estudiante,
  Tutor,
  Cursada,
  ResultadoAcademico,
  RedNeuronalPredictiva,
  Alerta,
  IntervencionPedagogica,
  InteraccionDOC,
} from './models.js';

export function inicializarEcosistema() {
  const redNeuronal = new RedNeuronalPredictiva('v2.4-IFTS12-ANN', 0.912, 0.928, 0.905, 0.920, 1420);

  // 1. Estudiante Principal: Álex (del Mockup Oficial de DOCE - Grupo 6)
  const estAlex = new Estudiante(
    'est-alex-12',
    'Álex Martínez',
    'alex.martinez@alumnos.ifts12.edu.ar',
    'L-25012',
    'Visual-Sintético',
    '2026-1C',
    'Tecnicatura en Ciencia de Datos e Inteligencia Artificial'
  );
  estAlex.iniciar_sesion();

  estAlex.completar_onboarding({
    horas_trabajo_semanal: 38,
    minutos_viaje: 75,
    personas_a_cargo: 1,
    nivel_estres_percibido: 7,
    ritmo_estudio: 'Fragmentado',
  });

  const cAlexEst = new Cursada('CDIA-101', 'Estadística y Probabilidad Aplicada', '2026', 75);
  cAlexEst.agregar_resultado(new ResultadoAcademico('res-alex-1', 8.5, 90, 0, 'Lectura U1 finalizada'));

  const cAlexIA = new Cursada('CDIA-102', 'Inteligencia Artificial I (Machine Learning)', '2026', 35);
  cAlexIA.agregar_resultado(new ResultadoAcademico('res-alex-2', 6.0, 75, 1, 'Avance de TP en proceso, demora en redes'));

  const cAlexAlg = new Cursada('CDIA-103', 'Álgebra Lineal y Computacional', '2026', 60);
  cAlexAlg.agregar_resultado(new ResultadoAcademico('res-alex-3', 7.5, 85, 0, 'Repaso de matrices al día'));

  estAlex.cursadas = [cAlexEst, cAlexIA, cAlexAlg];

  // 2. Estudiante 2: Camila Gómez (Caso de Riesgo Alto)
  const est1 = new Estudiante(
    'est-24192',
    'Camila Gómez',
    'camila.gomez@alumnos.ifts12.edu.ar',
    'L-94192',
    'Visual-Sintético',
    '2026-1C',
    'Tecnicatura en Ciencia de Datos e Inteligencia Artificial'
  );

  est1.completar_onboarding({
    horas_trabajo_semanal: 44,
    minutos_viaje: 95,
    personas_a_cargo: 1,
    nivel_estres_percibido: 8,
    ritmo_estudio: 'Fragmentado',
  });

  const c1Prog = new Cursada('CDIA-104', 'Programación para Ciencia de Datos (Python)', '2026', 35);
  c1Prog.agregar_resultado(new ResultadoAcademico('res-1', 5.5, 70, 2, 'Primer parcial regular, debe recuperar TP2'));

  const c1BD = new Cursada('CDIA-105', 'Bases de Datos & SQL para Analytics', '2026', 30);
  c1BD.agregar_resultado(new ResultadoAcademico('res-4', 5.0, 65, 2, 'Dificultad en consultas complejas'));

  est1.cursadas = [c1Prog, c1BD];

  // 2. Estudiante 2: Juan Manuel Pérez (Riesgo Moderado)
  const est2 = new Estudiante(
    'est-24155',
    'Juan Manuel Pérez',
    'juan.perez@alumnos.ifts12.edu.ar',
    'L-24155',
    'Práctico-Secuencial',
    '2025-2C',
    'Tecnicatura Superior en Desarrollo de Software'
  );
  est2.completar_onboarding({
    horas_trabajo_semanal: 30,
    minutos_viaje: 45,
    personas_a_cargo: 1,
    nivel_estres_percibido: 6,
    ritmo_estudio: 'Regular',
  });

  const c2Alg = new Cursada('TSDS-201', 'Algoritmos y Estructuras de Datos', '2026', 55);
  c2Alg.agregar_resultado(new ResultadoAcademico('res-5', 7.0, 85, 0));
  const c2Red = new Cursada('TSDS-202', 'Redes y Comunicaciones', '2026', 50);
  c2Red.agregar_resultado(new ResultadoAcademico('res-6', 6.5, 78, 1));
  est2.cursadas = [c2Alg, c2Red];

  // 3. Estudiante 3: Sofía Carrizo (Riesgo Bajo)
  const est3 = new Estudiante(
    'est-23910',
    'Sofía Carrizo',
    'sofia.carrizo@alumnos.ifts12.edu.ar',
    'L-23910',
    'Reflexivo-Analítico',
    '2025-1C',
    'Tecnicatura Superior en Desarrollo de Software'
  );
  est3.completar_onboarding({
    horas_trabajo_semanal: 18,
    minutos_viaje: 25,
    personas_a_cargo: 0,
    nivel_estres_percibido: 3,
    ritmo_estudio: 'Intensivo',
  });
  const c3POO = new Cursada('TSDS-203', 'Programación Orientada a Objetos', '2026', 75);
  c3POO.agregar_resultado(new ResultadoAcademico('res-7', 9.0, 95, 0));
  const c3PP = new Cursada('TSDS-204', 'Práctica Profesionalizante I', '2026', 70);
  c3PP.agregar_resultado(new ResultadoAcademico('res-8', 8.5, 90, 0));
  est3.cursadas = [c3POO, c3PP];

  // Tutor del IFTS 12
  const tutorPrincipal = new Tutor(
    'tut-1201',
    'Prof. Lic. Valeria Morales',
    'vmorales@ifts12.edu.ar',
    'Cátedra de IA & Acompañamiento Pedagógico',
    'DOC-1240'
  );

  // Inferencia inicial con la Red Neuronal para generar predicciones y alertas
  const vectorAlex = estAlex.obtener_vector_ia();
  const resRedAlex = redNeuronal.evaluar_riesgo(vectorAlex, estAlex.id_usuario);

  const vectorEst1 = est1.obtener_vector_ia();
  const resRed1 = redNeuronal.evaluar_riesgo(vectorEst1, est1.id_usuario);

  const vectorEst2 = est2.obtener_vector_ia();
  const resRed2 = redNeuronal.evaluar_riesgo(vectorEst2, est2.id_usuario);

  const vectorEst3 = est3.obtener_vector_ia();
  const resRed3 = redNeuronal.evaluar_riesgo(vectorEst3, est3.id_usuario);

  // Lista de alertas iniciales
  const alertasIniciales: Alerta[] = [];
  if (resRed1.alerta) {
    alertasIniciales.push(resRed1.alerta);
  }

  // Alerta previa histórica ya atendida (para demostrar ciclo de vida institucional)
  const alertaHistorica = new Alerta(
    'alt-historica-01',
    'pred-hist-01',
    est2.id_usuario,
    'Sobrecarga por horario rotativo en fábrica y primera entrega atrasada en Redes',
    ['Sobrecarga Laboral', 'Traslado CABA/AMBA'],
    'Atendida',
    new Date(Date.now() - 86400000 * 5).toISOString()
  );
  alertaHistorica.intervencion_asociada_id = 'int-hist-01';
  alertasIniciales.push(alertaHistorica);

  // Intervención previa registrada
  const intervencionHistorica = new IntervencionPedagogica(
    'int-hist-01',
    alertaHistorica.id_alerta,
    tutorPrincipal.id_usuario,
    tutorPrincipal.nombre,
    est2.id_usuario,
    'Plan de contingencia laboral',
    'Se acordó entrega de trabajos prácticos en formato asincrónico con defensa remota los días sábados.',
    'Estudiante muy comprometido con la carrera, necesita flexibilidad en el horario presencial por turnos de fábrica.',
    new Date(Date.now() - 86400000 * 4).toISOString(),
    new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
  );

  // Interacciones iniciales con DOC (reflejando el diálogo exacto del mockup de la página 4)
  const interaccionesDOCIniciales: InteraccionDOC[] = [
    new InteraccionDOC(
      'intdoc-alex-1',
      estAlex.id_usuario,
      'Hola DOC, estoy con la lectura de Inteligencia Artificial I.',
      '¡Hola Álex! Soy DOC, tu compañero de estudio. Noté que esta lectura viene densa, ¿querés que la desglosemos en 3 puntos clave o usemos una plantilla de síntesis? ¡Vamos paso a paso!',
      'motivacion',
      false,
      new Date(Date.now() - 86400000 * 1).toISOString()
    ),
    new InteraccionDOC(
      'intdoc-1',
      est1.id_usuario,
      'Hola DOC, hoy salí muy tarde del trabajo y no sé si llego a estudiar para Programación.',
      '¡Hola Camila! En el IFTS 12 valoramos un montón tu esfuerzo diario. No intentes leer 40 hojas hoy: fijate una micro-meta de 15 minutos en el tren para repasar la sintaxis de clases y métodos. Con ese pequeño paso ya protegés tu cursada sin agotarte. ¡Estoy con vos!',
      'motivacion',
      false,
      new Date(Date.now() - 86400000 * 1).toISOString()
    ),
  ];

  return {
    estudiantes: [estAlex, est1, est2, est3],
    estudianteActualId: estAlex.id_usuario,
    tutor: tutorPrincipal,
    redNeuronal,
    predicciones: [resRedAlex.prediccion, resRed1.prediccion, resRed2.prediccion, resRed3.prediccion],
    alertas: alertasIniciales,
    intervenciones: [intervencionHistorica],
    interaccionesDOC: interaccionesDOCIniciales,
  };
}
