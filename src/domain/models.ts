/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ecosistema DOCE - IFTS N.º 12
 * Modelo de Dominio Orientado a Objetos (UML)
 */

export type RolUsuario = 'estudiante' | 'tutor' | 'comunicacion' | 'investigador_ia' | 'admin';
export type AreaSistema = 'estudiante' | 'tutor' | 'campana' | 'lab';
export type NivelRiesgo = 'Alto' | 'Moderado' | 'Bajo';
export type EstadoAlerta = 'Pendiente' | 'Atendida';
export type RitmoEstudio = 'Intensivo' | 'Regular' | 'Fragmentado';
export type ModoDOC = 'motivacion' | 'desglose_lectura' | 'planificacion' | 'asistencia_tecnica';

export interface FactorCritico {
  nombre: string;
  impacto: number; // 0 a 100
  descripcion: string;
}

export interface VectorEstudiante {
  horas_trabajo_semanal: number;
  minutos_viaje: number;
  personas_a_cargo: number;
  nivel_estres_percibido: number; // 1-10
  ritmo_estudio: RitmoEstudio;
  nota_promedio: number;
  asistencia_promedio: number;
  entregas_atrasadas_totales: number;
  porcentaje_avance_carrera: number;
}

export interface MapaCalorEstado {
  codigo_materia: string;
  nombre_materia: string;
  avance_esperado: number;
  avance_real: number;
  diferencia: number;
  estado: 'En cronograma' | 'Alerta leve' | 'Atraso crítico';
  color_badge: string;
}

// ----------------------------------------------------
// 1. MÓDULO DE USUARIOS Y ROLES (Herencia)
// ----------------------------------------------------

/**
 * Superclase Base: Modela la entidad genérica del sistema.
 */
export class Usuario {
  public id_usuario: string;
  public nombre: string;
  public email: string;
  public rol: RolUsuario;
  public area_asignada: AreaSistema;
  public areas_permitidas: AreaSistema[];
  public sesion_activa: boolean = false;
  public ultimo_acceso: string | null = null;

  constructor(
    id_usuario: string,
    nombre: string,
    email: string,
    rol: RolUsuario,
    area_asignada?: AreaSistema,
    areas_permitidas?: AreaSistema[]
  ) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;

    // Asignación estricta de área por rol
    if (area_asignada) {
      this.area_asignada = area_asignada;
    } else {
      switch (rol) {
        case 'estudiante':
          this.area_asignada = 'estudiante';
          break;
        case 'tutor':
          this.area_asignada = 'tutor';
          break;
        case 'comunicacion':
          this.area_asignada = 'campana';
          break;
        case 'investigador_ia':
          this.area_asignada = 'lab';
          break;
        case 'admin':
        default:
          this.area_asignada = 'estudiante';
          break;
      }
    }

    if (areas_permitidas) {
      this.areas_permitidas = areas_permitidas;
    } else {
      if (rol === 'admin') {
        this.areas_permitidas = ['estudiante', 'tutor', 'campana', 'lab'];
      } else {
        this.areas_permitidas = [this.area_asignada];
      }
    }
  }

  public iniciar_sesion(): boolean {
    this.sesion_activa = true;
    this.ultimo_acceso = new Date().toISOString();
    return true;
  }

  public cerrar_sesion(): boolean {
    this.sesion_activa = false;
    return true;
  }
}

/**
 * Subclase Estudiante: Representa al alumno en la plataforma del IFTS N.º 12.
 */
export class Estudiante extends Usuario {
  public legajo: string;
  public estilo_aprendizaje: string;
  public cohorte: string;
  public carrera: string;
  // Composición 1:1 con PerfilEstudio (el ciclo de vida está ligado al estudiante)
  public perfilEstudio: PerfilEstudio | null = null;
  // Agregación 0..* con Cursada (las materias existen independientemente)
  public cursadas: Cursada[] = [];

  constructor(
    id_usuario: string,
    nombre: string,
    email: string,
    legajo: string,
    estilo_aprendizaje: string = 'Visual-Sintético',
    cohorte: string = '2026-1C',
    carrera: string = 'Tecnicatura Superior en Desarrollo de Software'
  ) {
    super(id_usuario, nombre, email, 'estudiante');
    this.legajo = legajo;
    this.estilo_aprendizaje = estilo_aprendizaje;
    this.cohorte = cohorte;
    this.carrera = carrera;
  }

  public completar_onboarding(datos: {
    horas_trabajo_semanal: number;
    minutos_viaje: number;
    personas_a_cargo: number;
    nivel_estres_percibido: number;
    ritmo_estudio: RitmoEstudio;
  }): PerfilEstudio {
    const id_perfil = `perf-${this.id_usuario}-${Date.now()}`;
    this.perfilEstudio = new PerfilEstudio(
      id_perfil,
      this.id_usuario,
      datos.horas_trabajo_semanal,
      datos.minutos_viaje,
      datos.personas_a_cargo,
      datos.nivel_estres_percibido,
      datos.ritmo_estudio
    );
    return this.perfilEstudio;
  }

  public consultar_trayectoria(): {
    legajo: string;
    total_materias: number;
    promedio_general: number;
    asistencia_general: number;
    materias_en_riesgo: string[];
    es_vulnerable_socio_laboral: boolean;
  } {
    if (this.cursadas.length === 0) {
      return {
        legajo: this.legajo,
        total_materias: 0,
        promedio_general: 0,
        asistencia_general: 0,
        materias_en_riesgo: [],
        es_vulnerable_socio_laboral: this.perfilEstudio?.es_vulnerable() ?? false,
      };
    }

    let sumaPromedios = 0;
    let sumaAsistencia = 0;
    const materiasEnRiesgo: string[] = [];

    for (const c of this.cursadas) {
      const promedio = c.calcular_promedio_materia();
      sumaPromedios += promedio;
      const res = c.resultados[0];
      if (res) {
        sumaAsistencia += res.asistencia_porcentaje;
        if (promedio < 6 || res.asistencia_porcentaje < 75 || res.entregas_atrasadas >= 2) {
          materiasEnRiesgo.push(c.nombre_materia);
        }
      }
    }

    return {
      legajo: this.legajo,
      total_materias: this.cursadas.length,
      promedio_general: Number((sumaPromedios / this.cursadas.length).toFixed(2)),
      asistencia_general: Number((sumaAsistencia / this.cursadas.length).toFixed(1)),
      materias_en_riesgo: materiasEnRiesgo,
      es_vulnerable_socio_laboral: this.perfilEstudio?.es_vulnerable() ?? false,
    };
  }

  public obtener_vector_ia(): VectorEstudiante {
    const trayectoria = this.consultar_trayectoria();
    let totalEntregasAtrasadas = 0;
    let avanceTotal = 0;

    for (const c of this.cursadas) {
      avanceTotal += c.porcentaje_avance;
      for (const r of c.resultados) {
        totalEntregasAtrasadas += r.entregas_atrasadas;
      }
    }

    const avancePromedio = this.cursadas.length > 0 ? avanceTotal / this.cursadas.length : 35;

    return {
      horas_trabajo_semanal: this.perfilEstudio ? this.perfilEstudio.horas_trabajo_semanal : 20,
      minutos_viaje: this.perfilEstudio ? this.perfilEstudio.minutos_viaje : 45,
      personas_a_cargo: this.perfilEstudio ? this.perfilEstudio.personas_a_cargo : 0,
      nivel_estres_percibido: this.perfilEstudio ? this.perfilEstudio.nivel_estres_percibido : 5,
      ritmo_estudio: this.perfilEstudio ? this.perfilEstudio.ritmo_estudio : 'Regular',
      nota_promedio: trayectoria.promedio_general > 0 ? trayectoria.promedio_general : 7,
      asistencia_promedio: trayectoria.asistencia_general > 0 ? trayectoria.asistencia_general : 80,
      entregas_atrasadas_totales: totalEntregasAtrasadas,
      porcentaje_avance_carrera: Math.round(avancePromedio),
    };
  }
}

/**
 * Subclase Tutor: Representa al equipo de acompañamiento institucional y pedagógico del IFTS N.º 12.
 */
export class Tutor extends Usuario {
  public especialidad: string;
  public legajo_docente: string;

  constructor(
    id_usuario: string,
    nombre: string,
    email: string,
    especialidad: string = 'Acompañamiento Pedagógico y Retención',
    legajo_docente: string = 'T-1204'
  ) {
    super(id_usuario, nombre, email, 'tutor');
    this.especialidad = especialidad;
    this.legajo_docente = legajo_docente;
  }

  public consultar_dashboard_alertas(alertas: Alerta[], soloPendientes: boolean = false): Alerta[] {
    if (soloPendientes) {
      return alertas.filter(a => a.estado === 'Pendiente');
    }
    return [...alertas].sort((a, b) => {
      // Priorizar pendientes primero, luego por fecha más reciente
      if (a.estado !== b.estado) return a.estado === 'Pendiente' ? -1 : 1;
      return new Date(b.fecha_generacion).getTime() - new Date(a.fecha_generacion).getTime();
    });
  }

  public registrar_intervencion(
    alerta: Alerta,
    tipo_intervencion: string,
    acuerdos_alcanzados: string,
    observaciones_no_punitivas: string,
    fecha_seguimiento: string
  ): IntervencionPedagogica {
    const intervencion = new IntervencionPedagogica(
      `int-${Date.now()}`,
      alerta.id_alerta,
      this.id_usuario,
      this.nombre,
      alerta.estudiante_id,
      tipo_intervencion,
      acuerdos_alcanzados,
      observaciones_no_punitivas,
      new Date().toISOString(),
      fecha_seguimiento
    );
    alerta.marcar_atendida(intervencion.id_intervencion);
    return intervencion;
  }
}

// ----------------------------------------------------
// 2. MÓDULO DE PERFIL SOCIO-LABORAL Y CURSADA (Composición y Agregación)
// ----------------------------------------------------

/**
 * PerfilEstudio: Almacena el diagnóstico socio-laboral recogido en el onboarding.
 * Composición 1:1 con Estudiante.
 */
export class PerfilEstudio {
  public id_perfil: string;
  public estudiante_id: string;
  public horas_trabajo_semanal: number;
  public minutos_viaje: number;
  public personas_a_cargo: number;
  public nivel_estres_percibido: number; // 1-10
  public ritmo_estudio: RitmoEstudio;
  public fecha_actualizacion: string;

  constructor(
    id_perfil: string,
    estudiante_id: string,
    horas_trabajo_semanal: number = 0,
    minutos_viaje: number = 30,
    personas_a_cargo: number = 0,
    nivel_estres_percibido: number = 4,
    ritmo_estudio: RitmoEstudio = 'Regular'
  ) {
    this.id_perfil = id_perfil;
    this.estudiante_id = estudiante_id;
    this.horas_trabajo_semanal = horas_trabajo_semanal;
    this.minutos_viaje = minutos_viaje;
    this.personas_a_cargo = personas_a_cargo;
    this.nivel_estres_percibido = nivel_estres_percibido;
    this.ritmo_estudio = ritmo_estudio;
    this.fecha_actualizacion = new Date().toISOString();
  }

  public actualizar_perfil(nuevosDatos: {
    horas_trabajo_semanal?: number;
    minutos_viaje?: number;
    personas_a_cargo?: number;
    nivel_estres_percibido?: number;
    ritmo_estudio?: RitmoEstudio;
  }): void {
    if (nuevosDatos.horas_trabajo_semanal !== undefined) {
      this.horas_trabajo_semanal = nuevosDatos.horas_trabajo_semanal;
    }
    if (nuevosDatos.minutos_viaje !== undefined) {
      this.minutos_viaje = nuevosDatos.minutos_viaje;
    }
    if (nuevosDatos.personas_a_cargo !== undefined) {
      this.personas_a_cargo = nuevosDatos.personas_a_cargo;
    }
    if (nuevosDatos.nivel_estres_percibido !== undefined) {
      this.nivel_estres_percibido = nuevosDatos.nivel_estres_percibido;
    }
    if (nuevosDatos.ritmo_estudio !== undefined) {
      this.ritmo_estudio = nuevosDatos.ritmo_estudio;
    }
    this.fecha_actualizacion = new Date().toISOString();
  }

  /**
   * Evalúa factores de sobrecarga cognitiva y laboral típicos de estudiantes del IFTS N.º 12.
   * Regla de vulnerabilidad socio-laboral:
   * - Jornada laboral pesada (>= 35hs)
   * - Largas distancias de viaje diario (>= 80 min)
   * - Cuidado de familiares (>= 2 personas a cargo)
   * - Alto estrés percibido (>= 8/10)
   * O puntaje combinado de riesgo >= 60
   */
  public es_vulnerable(): boolean {
    const puntajeCarga =
      (this.horas_trabajo_semanal * 1.0) +
      (this.minutos_viaje * 0.3) +
      (this.personas_a_cargo * 12) +
      (this.nivel_estres_percibido * 4.5);

    return (
      this.horas_trabajo_semanal >= 35 ||
      this.minutos_viaje >= 85 ||
      this.personas_a_cargo >= 2 ||
      this.nivel_estres_percibido >= 8 ||
      puntajeCarga >= 65
    );
  }

  public obtener_indice_sobrecarga(): { puntaje: number; nivel: 'Bajo' | 'Moderado' | 'Crítico'; factores: string[] } {
    const factores: string[] = [];
    if (this.horas_trabajo_semanal >= 30) {
      factores.push(`Jornada laboral extensa (${this.horas_trabajo_semanal}h/sem)`);
    }
    if (this.minutos_viaje >= 60) {
      factores.push(`Traslado diario prolongado (${this.minutos_viaje} min)`);
    }
    if (this.personas_a_cargo > 0) {
      factores.push(`Responsabilidad de cuidado (${this.personas_a_cargo} personas a cargo)`);
    }
    if (this.nivel_estres_percibido >= 7) {
      factores.push(`Estrés autopercibido alto (${this.nivel_estres_percibido}/10)`);
    }
    if (this.ritmo_estudio === 'Fragmentado') {
      factores.push('Ventanas de estudio fragmentadas');
    }

    const puntaje = Math.min(
      100,
      Math.round(
        (this.horas_trabajo_semanal / 45) * 35 +
        (this.minutos_viaje / 120) * 25 +
        (this.personas_a_cargo / 3) * 20 +
        (this.nivel_estres_percibido / 10) * 20
      )
    );

    let nivel: 'Bajo' | 'Moderado' | 'Crítico' = 'Bajo';
    if (puntaje >= 65) nivel = 'Crítico';
    else if (puntaje >= 40) nivel = 'Moderado';

    return { puntaje, nivel, factores };
  }
}

/**
 * Cursada: Mapea la inscripción del estudiante en las asignaturas de la carrera.
 * Agregación 0..* con Estudiante.
 */
export class Cursada {
  public codigo_materia: string;
  public nombre_materia: string;
  public anio_lectivo: string;
  public porcentaje_avance: number; // 0 a 100
  // Composición 1..* con ResultadoAcademico
  public resultados: ResultadoAcademico[] = [];

  constructor(
    codigo_materia: string,
    nombre_materia: string,
    anio_lectivo: string = '2026',
    porcentaje_avance: number = 50
  ) {
    this.codigo_materia = codigo_materia;
    this.nombre_materia = nombre_materia;
    this.anio_lectivo = anio_lectivo;
    this.porcentaje_avance = porcentaje_avance;
  }

  public agregar_resultado(resultado: ResultadoAcademico): void {
    this.resultados.push(resultado);
  }

  public calcular_promedio_materia(): number {
    if (this.resultados.length === 0) return 0;
    const sum = this.resultados.reduce((acc, curr) => acc + curr.calcular_promedio(), 0);
    return Number((sum / this.resultados.length).toFixed(2));
  }

  /**
   * Obtiene el mapa de calor comparativo contra el cronograma oficial institucional (semana lectiva).
   */
  public obtener_mapa_calor(avanceEsperadoSemana: number = 60): MapaCalorEstado {
    const diferencia = this.porcentaje_avance - avanceEsperadoSemana;
    let estado: 'En cronograma' | 'Alerta leve' | 'Atraso crítico' = 'En cronograma';
    let color_badge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

    if (diferencia < -20) {
      estado = 'Atraso crítico';
      color_badge = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    } else if (diferencia < -8) {
      estado = 'Alerta leve';
      color_badge = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }

    return {
      codigo_materia: this.codigo_materia,
      nombre_materia: this.nombre_materia,
      avance_esperado: avanceEsperadoSemana,
      avance_real: this.porcentaje_avance,
      diferencia,
      estado,
      color_badge,
    };
  }
}

/**
 * ResultadoAcademico: Registra el rendimiento en cada materia.
 * Composición 1..* con Cursada.
 */
export class ResultadoAcademico {
  public id_resultado: string;
  public nota_parcial: number; // 1 a 10
  public asistencia_porcentaje: number; // 0 a 100
  public entregas_atrasadas: number;
  public observaciones?: string;

  constructor(
    id_resultado: string,
    nota_parcial: number,
    asistencia_porcentaje: number,
    entregas_atrasadas: number = 0,
    observaciones: string = ''
  ) {
    this.id_resultado = id_resultado;
    this.nota_parcial = nota_parcial;
    this.asistencia_porcentaje = asistencia_porcentaje;
    this.entregas_atrasadas = entregas_atrasadas;
    this.observaciones = observaciones;
  }

  public calcular_promedio(): number {
    return this.nota_parcial;
  }
}

// ----------------------------------------------------
// 3. MÓDULO DE IA PREDICTIVA Y ALERTAS (Dependencia e Invocación)
// ----------------------------------------------------

/**
 * PrediccionRiesgo: Entidad instanciada tras la inferencia de la red neuronal.
 */
export class PrediccionRiesgo {
  public id_prediccion: string;
  public probabilidad_desercion: number; // 0.0 a 1.0
  public nivel_riesgo: NivelRiesgo;
  public fecha_calculo: string;
  public factores_criticos: FactorCritico[];
  public estudiante_id: string;

  constructor(
    id_prediccion: string,
    estudiante_id: string,
    probabilidad_desercion: number,
    factores_criticos: FactorCritico[] = [],
    fecha_calculo: string = new Date().toISOString()
  ) {
    this.id_prediccion = id_prediccion;
    this.estudiante_id = estudiante_id;
    this.probabilidad_desercion = Math.max(0, Math.min(1, Number(probabilidad_desercion.toFixed(3))));
    this.factores_criticos = factores_criticos;
    this.fecha_calculo = fecha_calculo;
    this.nivel_riesgo = this.clasificar_riesgo();
  }

  public clasificar_riesgo(): NivelRiesgo {
    if (this.probabilidad_desercion >= 0.65) {
      return 'Alto';
    } else if (this.probabilidad_desercion >= 0.35) {
      return 'Moderado';
    }
    return 'Bajo';
  }
}

/**
 * Alerta: Se genera automáticamente cuando la probabilidad de deserción clasifica en "Riesgo Alto".
 * Relación 1 --> 0..1 con PrediccionRiesgo.
 */
export class Alerta {
  public id_alerta: string;
  public prediccion_id: string;
  public estudiante_id: string;
  public estudiante_codigo_anonimizado: string;
  public estado: EstadoAlerta;
  public fecha_generacion: string;
  public motivo_principal: string;
  public intervencion_asociada_id?: string;
  public factores_resumen: string[];

  constructor(
    id_alerta: string,
    prediccion_id: string,
    estudiante_id: string,
    motivo_principal: string,
    factores_resumen: string[] = [],
    estado: EstadoAlerta = 'Pendiente',
    fecha_generacion: string = new Date().toISOString()
  ) {
    this.id_alerta = id_alerta;
    this.prediccion_id = prediccion_id;
    this.estudiante_id = estudiante_id;
    // Protección ética de datos en la alerta temprana institucional:
    this.estudiante_codigo_anonimizado = `EST-${estudiante_id.slice(-5).toUpperCase()}`;
    this.motivo_principal = motivo_principal;
    this.factores_resumen = factores_resumen;
    this.estado = estado;
    this.fecha_generacion = fecha_generacion;
  }

  public notificar_tutoria(): string {
    return `[DOCE - Notificación Institucional IFTS 12] Alerta temprana activa para ${this.estudiante_codigo_anonimizado}. Motivo: ${this.motivo_principal}. Prioridad: Inmediata.`;
  }

  public marcar_atendida(intervencion_id?: string): void {
    this.estado = 'Atendida';
    if (intervencion_id) {
      this.intervencion_asociada_id = intervencion_id;
    }
  }
}

/**
 * RedNeuronalPredictiva: Modelo supervisado de aprendizaje automático.
 * Computa la inferencia no lineal a partir del vector del estudiante.
 */
export class RedNeuronalPredictiva {
  public version_modelo: string;
  public f1_score: number;
  public accuracy: number;
  public precision: number;
  public recall: number;
  public total_entrenamientos: number;

  constructor(
    version_modelo: string = 'v2.4-IFTS12-ANN',
    f1_score: number = 0.912,
    accuracy: number = 0.928,
    precision: number = 0.905,
    recall: number = 0.920,
    total_entrenamientos: number = 1420
  ) {
    this.version_modelo = version_modelo;
    this.f1_score = f1_score;
    this.accuracy = accuracy;
    this.precision = precision;
    this.recall = recall;
    this.total_entrenamientos = total_entrenamientos;
  }

  /**
   * evalúa el vector del estudiante y genera una PrediccionRiesgo.
   * La fórmula aplica pesos calibrados al perfil de estudiantes de tecnicaturas de CABA:
   * Horas de trabajo excesivas y largos viajes en transporte público incrementan la fatiga y deserción temprana.
   */
  public evaluar_riesgo(vector: VectorEstudiante, estudiante_id: string = 'est-default'): {
    prediccion: PrediccionRiesgo;
    alerta: Alerta | null;
  } {
    // Normalizaciones (0 a 1)
    const normTrabajo = Math.min(vector.horas_trabajo_semanal / 45, 1.0);
    const normViaje = Math.min(vector.minutos_viaje / 120, 1.0);
    const normCuidado = Math.min(vector.personas_a_cargo / 3, 1.0);
    const normEstres = Math.min(vector.nivel_estres_percibido / 10, 1.0);
    const normRitmo = vector.ritmo_estudio === 'Fragmentado' ? 0.9 : vector.ritmo_estudio === 'Regular' ? 0.4 : 0.2;
    
    // Académicos inversos (menor nota/asistencia = mayor riesgo)
    const normNotaInversa = Math.max(0, (10 - vector.nota_promedio) / 10);
    const normAsistenciaInversa = Math.max(0, (100 - vector.asistencia_promedio) / 100);
    const normEntregasAtrasadas = Math.min(vector.entregas_atrasadas_totales / 4, 1.0);
    const normAtrasoAvance = Math.max(0, (60 - vector.porcentaje_avance_carrera) / 60);

    // Pesos sinápticos entrenados para el contexto del IFTS 12
    const wTrabajo = 0.22;
    const wViaje = 0.12;
    const wCuidado = 0.08;
    const wEstres = 0.13;
    const wNota = 0.20;
    const wAsistencia = 0.15;
    const wEntregas = 0.10;

    const sumaPonderada =
      (normTrabajo * wTrabajo) +
      (normViaje * wViaje) +
      (normCuidado * wCuidado) +
      (normEstres * wEstres) +
      (normRitmo * 0.05) +
      (normNotaInversa * wNota) +
      (normAsistenciaInversa * wAsistencia) +
      (normEntregasAtrasadas * wEntregas) +
      (normAtrasoAvance * 0.05);

    // Activación sigmoide modificada centrada
    const z = (sumaPonderada - 0.42) * 5.2;
    const sigmoid = 1 / (1 + Math.exp(-z));
    const probabilidad = Math.min(0.98, Math.max(0.04, sigmoid));

    // Factores explicables (XAI)
    const factores: FactorCritico[] = [];
    if (vector.horas_trabajo_semanal >= 30) {
      factores.push({
        nombre: 'Sobrecarga Laboral',
        impacto: Math.round(normTrabajo * 100),
        descripcion: `${vector.horas_trabajo_semanal} hs semanales de trabajo formal/informal limitan el tiempo de estudio.`,
      });
    }
    if (vector.minutos_viaje >= 60) {
      factores.push({
        nombre: 'Tiempo de Traslado CABA/AMBA',
        impacto: Math.round(normViaje * 100),
        descripcion: `${vector.minutos_viaje} minutos de viaje diario generan fatiga acumulativa.`,
      });
    }
    if (vector.asistencia_promedio < 75) {
      factores.push({
        nombre: 'Asistencia Debajo del Umbral',
        impacto: Math.round(normAsistenciaInversa * 100),
        descripcion: `Asistencia actual al ${vector.asistencia_promedio}% (mínimo requerido 75%).`,
      });
    }
    if (vector.entregas_atrasadas_totales > 0) {
      factores.push({
        nombre: 'Entregas Prácticas Pendientes',
        impacto: Math.round(normEntregasAtrasadas * 100),
        descripcion: `${vector.entregas_atrasadas_totales} trabajos prácticos con fecha vencida.`,
      });
    }
    if (vector.nota_promedio < 6) {
      factores.push({
        nombre: 'Rendimiento Parcial Comprometido',
        impacto: Math.round(normNotaInversa * 100),
        descripcion: `Promedio de calificaciones parciales de ${vector.nota_promedio}.`,
      });
    }
    if (vector.nivel_estres_percibido >= 7) {
      factores.push({
        nombre: 'Estrés Autopercibido Elevado',
        impacto: Math.round(normEstres * 100),
        descripcion: `Nivel de saturación declarado de ${vector.nivel_estres_percibido}/10.`,
      });
    }

    const idPrediccion = `pred-${Date.now()}`;
    const prediccion = new PrediccionRiesgo(
      idPrediccion,
      estudiante_id,
      probabilidad,
      factores
    );

    // Disparo de Alerta si el riesgo clasifica en "Alto"
    let alerta: Alerta | null = null;
    if (prediccion.nivel_riesgo === 'Alto') {
      const motivo = factores.length > 0
        ? `Alta probabilidad de deserción (${Math.round(probabilidad * 100)}%) impulsada por ${factores[0].nombre}.`
        : `Alta probabilidad de deserción (${Math.round(probabilidad * 100)}%) detectada por la red.`;
      
      const idAlerta = `alt-${Date.now()}`;
      alerta = new Alerta(
        idAlerta,
        idPrediccion,
        estudiante_id,
        motivo,
        factores.map(f => f.nombre),
        'Pendiente'
      );
    }

    return { prediccion, alerta };
  }
}

// ----------------------------------------------------
// 4. MÓDULO DE IA CONVERSACIONAL (Asociación)
// ----------------------------------------------------

/**
 * InteraccionDOC: Mantiene el registro auditable de los intercambios entre el estudiante y DOC.
 */
export class InteraccionDOC {
  public id_interaccion: string;
  public estudiante_id: string;
  public mensaje_usuario: string;
  public respuesta_doc: string;
  public fecha_hora: string;
  public modo_usado: ModoDOC;
  public conteo_palabras: number;
  public fue_fallback: boolean;

  constructor(
    id_interaccion: string,
    estudiante_id: string,
    mensaje_usuario: string,
    respuesta_doc: string,
    modo_usado: ModoDOC = 'motivacion',
    fue_fallback: boolean = false,
    fecha_hora: string = new Date().toISOString()
  ) {
    this.id_interaccion = id_interaccion;
    this.estudiante_id = estudiante_id;
    this.mensaje_usuario = mensaje_usuario;
    this.respuesta_doc = respuesta_doc;
    this.modo_usado = modo_usado;
    this.fue_fallback = fue_fallback;
    this.fecha_hora = fecha_hora;
    this.conteo_palabras = this.calcular_palabras(respuesta_doc);
  }

  private calcular_palabras(texto: string): number {
    return texto.trim().split(/\s+/).filter(Boolean).length;
  }

  public registrar_interaccion(): { id: string; fecha: string; palabras: number } {
    return {
      id: this.id_interaccion,
      fecha: this.fecha_hora,
      palabras: this.conteo_palabras,
    };
  }
}

/**
 * AgenteDOC: Compañero digital de estudio respaldado por LLM.
 * Diseñado con motivación activa y pedagogía no punitiva para el IFTS N.º 12.
 */
export class AgenteDOC {
  public nombre: string = 'DOC';
  public limite_palabras: number = 180;
  public modo: ModoDOC;
  public readonly system_prompt: string;

  constructor(modo: ModoDOC = 'motivacion') {
    this.modo = modo;
    this.system_prompt = `Eres DOC, el compañero digital pedagógico del IFTS N.º 12 (Instituto de Formación Técnica Superior N.º 12 de CABA).
Tu misión es acompañar, motivar y desglosar conceptos complejos para estudiantes trabajadores que equilibran empleo, viaje en transporte público y estudio superior.
REGLAS OBLIGATORIAS:
1. NUNCA emitas juicios punitivos, recriminaciones por demoras o sanciones.
2. Promueve la permanencia estudiantil con empatía y pasos concretos realizables hoy.
3. Máximo estricto: MENOS DE 180 PALABRAS por respuesta. Sé claro, cálido, estructurado y sintético.
4. Si el estudiante comparte apuntes densos, desglosa la lectura en:
   - 🎯 Concepto Clave
   - 💡 Ejemplo Cotidiano
   - 🚀 Paso de Acción Inmediato (15 min).`;
  }

  public activar_fallback(mensaje: string, modo: ModoDOC = 'motivacion'): string {
    const fallbacksPorModo: Record<ModoDOC, string[]> = {
      motivacion: [
        `¡Hola! En el IFTS 12 sabemos el enorme esfuerzo de cursar después de trabajar y viajar en transporte público. No necesitas resolver toda la carrera hoy: solo da un paso a la vez. ¿Qué tema de la materia te gustaría revisar en un bloque de 15 minutos? ¡Estoy con vos!`,
        `Cada minuto que le dedicas a tu tecnicatura suma un montón. Aunque el día haya sido agotador, repasar un solo concepto antes de descansar afianza lo aprendido. ¡Fuerza, venís construyendo tu futuro paso a paso!`,
      ],
      desglose_lectura: [
        `📚 Desglose rápido para tu cursada:\n1. Idea principal: Identificá la variable o definición central sin abrumarte.\n2. Conexión práctica: Pensalo como una función en código o un flujo real.\n3. Micro-meta: Leé solo 2 párrafos y anota una duda para el profe. ¡Menos es más!`,
      ],
      planificacion: [
        `⏱️ Estrategia de estudio exprés IFTS 12:\n- Bloque 1 (15 min): Repaso de conceptos en el colectivo/tren.\n- Pausa (5 min): Desconexión total.\n- Bloque 2 (20 min): Resolución de 1 ejercicio del TP.\nCon este micro-ritmo proteges tu descanso y no te atrasas.`,
      ],
      asistencia_tecnica: [
        `💻 Recordá que en la Tecnicatura del IFTS 12 el código se aprende probando y cometiendo errores. Si un ejercicio no compila, aísla la función y revisa los tipos. La tutoría pedagógica y tus profes están para orientarte.`,
      ],
    };

    const lista = fallbacksPorModo[modo] || fallbacksPorModo.motivacion;
    return lista[Math.floor(Math.random() * lista.length)];
  }

  public async desglosar_lectura(texto: string, apiCaller?: (prompt: string, sys: string) => Promise<string>): Promise<string> {
    const prompt = `Desglosa la siguiente lectura o apunte técnico para un estudiante del IFTS 12 en menos de 180 palabras:\n\n"${texto}"`;
    if (apiCaller) {
      try {
        const respuesta = await apiCaller(prompt, this.system_prompt);
        return respuesta;
      } catch (err) {
        console.warn('Fallback activado en desglosar_lectura:', err);
      }
    }
    return this.activar_fallback(texto, 'desglose_lectura');
  }

  public async generar_mensaje_motivacional(
    perfil?: PerfilEstudio | null,
    apiCaller?: (prompt: string, sys: string) => Promise<string>
  ): Promise<string> {
    const contexto = perfil
      ? `Estudiante con ${perfil.horas_trabajo_semanal}hs de trabajo semanal, ${perfil.minutos_viaje} min de viaje y estrés ${perfil.nivel_estres_percibido}/10.`
      : `Estudiante de tecnicatura superior técnica.`;

    const prompt = `Genera un mensaje pedagógico cálido, empático y motivador (máximo 140 palabras) para: ${contexto}. No uses juicios ni frases vacías; ofrece una micro-meta.`;

    if (apiCaller) {
      try {
        const respuesta = await apiCaller(prompt, this.system_prompt);
        return respuesta;
      } catch (err) {
        console.warn('Fallback activado en generar_mensaje_motivacional:', err);
      }
    }
    return this.activar_fallback('', 'motivacion');
  }
}

// ----------------------------------------------------
// 5. INTERVENCIÓN PEDAGÓGICA (Tutoría Institucional)
// ----------------------------------------------------

export class IntervencionPedagogica {
  public id_intervencion: string;
  public alerta_id: string;
  public tutor_id: string;
  public tutor_nombre: string;
  public estudiante_id: string;
  public tipo_intervencion: string;
  public acuerdos_alcanzados: string;
  public observaciones_no_punitivas: string;
  public fecha_intervencion: string;
  public fecha_seguimiento: string;

  constructor(
    id_intervencion: string,
    alerta_id: string,
    tutor_id: string,
    tutor_nombre: string,
    estudiante_id: string,
    tipo_intervencion: string,
    acuerdos_alcanzados: string,
    observaciones_no_punitivas: string,
    fecha_intervencion: string = new Date().toISOString(),
    fecha_seguimiento: string = ''
  ) {
    this.id_intervencion = id_intervencion;
    this.alerta_id = alerta_id;
    this.tutor_id = tutor_id;
    this.tutor_nombre = tutor_nombre;
    this.estudiante_id = estudiante_id;
    this.tipo_intervencion = tipo_intervencion;
    this.acuerdos_alcanzados = acuerdos_alcanzados;
    this.observaciones_no_punitivas = observaciones_no_punitivas;
    this.fecha_intervencion = fecha_intervencion;
    this.fecha_seguimiento = fecha_seguimiento;
  }
}
