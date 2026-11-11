import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Usuario,
  Estudiante,
  Tutor,
  PerfilEstudio,
  Cursada,
  ResultadoAcademico,
  RedNeuronalPredictiva,
  AgenteDOC,
  InteraccionDOC,
} from './models.js';

test('1. Módulo de Usuarios y Roles: Herencia y Métodos Base', () => {
  const usuario = new Usuario('u-01', 'Carlos Rossi', 'carlos@ifts12.edu.ar', 'admin');
  assert.equal(usuario.sesion_activa, false);
  usuario.iniciar_sesion();
  assert.equal(usuario.sesion_activa, true);
  assert.ok(usuario.ultimo_acceso !== null);
  usuario.cerrar_sesion();
  assert.equal(usuario.sesion_activa, false);

  const estudiante = new Estudiante('est-01', 'Camila Gómez', 'camila@ifts12.edu.ar', 'L-24192');
  assert.equal(estudiante.rol, 'estudiante');
  assert.equal(estudiante.legajo, 'L-24192');
  assert.equal(estudiante.estilo_aprendizaje, 'Visual-Sintético');

  const tutor = new Tutor('tut-01', 'Prof. Martín Valenzuela', 'mvalenzuela@ifts12.edu.ar', 'Acompañamiento Pedagógico');
  assert.equal(tutor.rol, 'tutor');
  assert.equal(tutor.especialidad, 'Acompañamiento Pedagógico');
});

test('2. Módulo de Perfil Socio-Laboral y Cursada: Composición y Agregación', () => {
  const estudiante = new Estudiante('est-02', 'Lucía Méndez', 'lucia@ifts12.edu.ar', 'L-24890');
  
  // Onboarding (Composición 1:1)
  const perfil = estudiante.completar_onboarding({
    horas_trabajo_semanal: 40,
    minutos_viaje: 90,
    personas_a_cargo: 1,
    nivel_estres_percibido: 8,
    ritmo_estudio: 'Fragmentado',
  });

  assert.ok(estudiante.perfilEstudio !== null);
  assert.equal(estudiante.perfilEstudio.horas_trabajo_semanal, 40);
  assert.equal(estudiante.perfilEstudio.es_vulnerable(), true);

  // Cursada (Agregación) y ResultadoAcademico (Composición)
  const cursadaProg = new Cursada('TSDS-101', 'Programación I', '2026', 40);
  cursadaProg.agregar_resultado(new ResultadoAcademico('res-1', 7.5, 80, 1));
  cursadaProg.agregar_resultado(new ResultadoAcademico('res-2', 8.5, 85, 0));

  assert.equal(cursadaProg.calcular_promedio_materia(), 8.0);

  // Mapa de calor
  const mapa = cursadaProg.obtener_mapa_calor(65);
  assert.equal(mapa.estado, 'Atraso crítico'); // 40 vs 65 diferencia -25

  estudiante.cursadas.push(cursadaProg);
  const trayectoria = estudiante.consultar_trayectoria();
  assert.equal(trayectoria.total_materias, 1);
  assert.equal(trayectoria.promedio_general, 8.0);
  assert.equal(trayectoria.es_vulnerable_socio_laboral, true);
});

test('3. Módulo de IA Predictiva y Alertas: Inferencia y Disparo de Alerta', () => {
  const red = new RedNeuronalPredictiva('v2.4-IFTS12-ANN', 0.912);
  assert.equal(red.f1_score, 0.912);

  // Vector de estudiante de alto riesgo: 42 hs de trabajo, 100 min viaje, 2 hijos, estrés 9, notas 4.5, asistencia 60%, 3 atrasos
  const vectorAltoRiesgo = {
    horas_trabajo_semanal: 42,
    minutos_viaje: 100,
    personas_a_cargo: 2,
    nivel_estres_percibido: 9,
    ritmo_estudio: 'Fragmentado' as const,
    nota_promedio: 4.5,
    asistencia_promedio: 60,
    entregas_atrasadas_totales: 3,
    porcentaje_avance_carrera: 25,
  };

  const resultado = red.evaluar_riesgo(vectorAltoRiesgo, 'est-riesgo-01');
  assert.equal(resultado.prediccion.nivel_riesgo, 'Alto');
  assert.ok(resultado.prediccion.probabilidad_desercion >= 0.65);
  assert.ok(resultado.alerta !== null);
  assert.equal(resultado.alerta.estado, 'Pendiente');
  assert.ok(resultado.alerta.factores_resumen.length > 0);

  // Notificar tutoría
  const notificacion = resultado.alerta.notificar_tutoria();
  assert.ok(notificacion.includes('DOCE - Notificación Institucional IFTS 12'));

  // Vector de bajo riesgo
  const vectorBajoRiesgo = {
    horas_trabajo_semanal: 15,
    minutos_viaje: 30,
    personas_a_cargo: 0,
    nivel_estres_percibido: 3,
    ritmo_estudio: 'Regular' as const,
    nota_promedio: 8.5,
    asistencia_promedio: 92,
    entregas_atrasadas_totales: 0,
    porcentaje_avance_carrera: 60,
  };

  const resBajo = red.evaluar_riesgo(vectorBajoRiesgo, 'est-bajo-01');
  assert.equal(resBajo.prediccion.nivel_riesgo, 'Bajo');
  assert.equal(resBajo.alerta, null);
});

test('4. Módulo de IA Conversacional: AgenteDOC y Límite de Palabras (<180)', () => {
  const doc = new AgenteDOC('motivacion');
  assert.equal(doc.nombre, 'DOC');
  assert.equal(doc.limite_palabras, 180);

  const fallback = doc.activar_fallback('mensaje de prueba', 'motivacion');
  assert.ok(fallback.length > 0);
  const words = fallback.trim().split(/\s+/).length;
  assert.ok(words < 180, `Words should be < 180, got ${words}`);

  const interaccion = new InteraccionDOC(
    'int-01',
    'est-01',
    'No llego con los tiempos de estudio',
    fallback,
    'motivacion',
    true
  );
  assert.ok(interaccion.conteo_palabras < 180);
  assert.equal(interaccion.fue_fallback, true);
});

test('5. Tutor: Dashboard de Alertas e Intervención Pedagógica', () => {
  const tutor = new Tutor('tut-02', 'Prof. Laura Benítez', 'lbenitez@ifts12.edu.ar');
  const red = new RedNeuronalPredictiva();
  const vectorRiesgo = {
    horas_trabajo_semanal: 40,
    minutos_viaje: 90,
    personas_a_cargo: 1,
    nivel_estres_percibido: 8,
    ritmo_estudio: 'Fragmentado' as const,
    nota_promedio: 5.0,
    asistencia_promedio: 70,
    entregas_atrasadas_totales: 2,
    porcentaje_avance_carrera: 30,
  };

  const { alerta } = red.evaluar_riesgo(vectorRiesgo, 'est-alerta-99');
  assert.ok(alerta !== null);

  const dashboardAlertas = tutor.consultar_dashboard_alertas([alerta]);
  assert.equal(dashboardAlertas.length, 1);
  assert.equal(dashboardAlertas[0].estado, 'Pendiente');

  // Registrar intervención
  const intervencion = tutor.registrar_intervencion(
    alerta,
    'Plan de contingencia laboral',
    'Se acordó entrega asincrónica de TP2 y tutoría par semanal los sábados.',
    'Estudiante con alta motivación pero sobrecarga horaria en horario rotativo.',
    '2026-04-15'
  );

  assert.equal(alerta.estado, 'Atendida');
  assert.equal(alerta.intervencion_asociada_id, intervencion.id_intervencion);
  assert.equal(intervencion.tipo_intervencion, 'Plan de contingencia laboral');
});
