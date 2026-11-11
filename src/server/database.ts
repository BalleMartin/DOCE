/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Base de Datos y Estado del Backend para el Ecosistema DOCE - IFTS N.º 12
 */

import {
  Usuario,
  Estudiante,
  Tutor,
  Cursada,
  ResultadoAcademico,
  RedNeuronalPredictiva,
  Alerta,
  IntervencionPedagogica,
  InteraccionDOC,
  PrediccionRiesgo,
  VectorEstudiante,
  AreaSistema,
} from '../domain/models.js';

export interface UserAccount {
  id: string;
  email: string;
  legajo: string;
  nombre: string;
  passwordHash: string; // Para validación simulada
  rol: 'estudiante' | 'tutor' | 'comunicacion' | 'investigador_ia' | 'admin';
  area_asignada: AreaSistema;
  areas_permitidas: AreaSistema[];
  estudiante_id?: string;
  tutor_id?: string;
  descripcion_cargo: string;
}

export class BackendDatabase {
  public users: UserAccount[] = [];
  public estudiantes: Estudiante[] = [];
  public tutorPrincipal: Tutor;
  public redNeuronal: RedNeuronalPredictiva;
  public predicciones: PrediccionRiesgo[] = [];
  public alertas: Alerta[] = [];
  public intervenciones: IntervencionPedagogica[] = [];
  public interaccionesDOC: InteraccionDOC[] = [];
  public sesionesActivas: Map<string, { userId: string; createdAt: Date }> = new Map();

  constructor() {
    this.redNeuronal = new RedNeuronalPredictiva('v2.4-IFTS12-ANN', 0.912, 0.928, 0.905, 0.920, 1420);

    // Tutor Principal / Cátedra de IA
    this.tutorPrincipal = new Tutor(
      'tut-1201',
      'Prof. Lic. Valeria Morales',
      'vmorales@ifts12.edu.ar',
      'Cátedra de IA & Acompañamiento Pedagógico',
      'DOC-1240'
    );

    // Inicializar Estudiantes
    this.inicializarEstudiantes();

    // Inicializar Cuentas con roles y áreas asignadas
    this.inicializarUsuarios();

    // Inferencia inicial
    this.ejecutarInferenciaInicial();
  }

  private inicializarEstudiantes() {
    // 1. Álex Martínez (Estudiante Principal)
    const estAlex = new Estudiante(
      'est-alex-12',
      'Álex Martínez',
      'alex.martinez@alumnos.ifts12.edu.ar',
      'L-25012',
      'Visual-Sintético',
      '2026-1C',
      'Tecnicatura en Ciencia de Datos e Inteligencia Artificial'
    );
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
    cAlexIA.agregar_resultado(new ResultadoAcademico('res-alex-2', 6.0, 75, 1, 'Avance en curso'));

    const cAlexAlg = new Cursada('CDIA-103', 'Álgebra Lineal y Computacional', '2026', 60);
    cAlexAlg.agregar_resultado(new ResultadoAcademico('res-alex-3', 7.5, 85, 0, 'Al día con matrices'));

    estAlex.cursadas = [cAlexEst, cAlexIA, cAlexAlg];

    // 2. Camila Gómez
    const estCamila = new Estudiante(
      'est-24192',
      'Camila Gómez',
      'camila.gomez@alumnos.ifts12.edu.ar',
      'L-94192',
      'Visual-Sintético',
      '2026-1C',
      'Tecnicatura en Ciencia de Datos e Inteligencia Artificial'
    );
    estCamila.completar_onboarding({
      horas_trabajo_semanal: 44,
      minutos_viaje: 95,
      personas_a_cargo: 1,
      nivel_estres_percibido: 8,
      ritmo_estudio: 'Fragmentado',
    });
    const c1Prog = new Cursada('CDIA-104', 'Programación para Ciencia de Datos (Python)', '2026', 35);
    c1Prog.agregar_resultado(new ResultadoAcademico('res-1', 5.5, 70, 2, 'Recuperatorio TP2'));
    const c1BD = new Cursada('CDIA-105', 'Bases de Datos & SQL para Analytics', '2026', 30);
    c1BD.agregar_resultado(new ResultadoAcademico('res-4', 5.0, 65, 2, 'Dificultad en consultas complejas'));
    estCamila.cursadas = [c1Prog, c1BD];

    // 3. Juan Manuel Pérez
    const estJuan = new Estudiante(
      'est-24155',
      'Juan Manuel Pérez',
      'juan.perez@alumnos.ifts12.edu.ar',
      'L-24155',
      'Práctico-Secuencial',
      '2025-2C',
      'Tecnicatura Superior en Desarrollo de Software'
    );
    estJuan.completar_onboarding({
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
    estJuan.cursadas = [c2Alg, c2Red];

    this.estudiantes = [estAlex, estCamila, estJuan];
  }

  private inicializarUsuarios() {
    this.users = [
      {
        id: 'user-est-alex',
        email: 'alex.martinez@alumnos.ifts12.edu.ar',
        legajo: 'L-25012',
        nombre: 'Álex Martínez',
        passwordHash: 'doce2026',
        rol: 'estudiante',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante'],
        estudiante_id: 'est-alex-12',
        descripcion_cargo: 'Estudiante · Tecnicatura en Ciencia de Datos e IA',
      },
      {
        id: 'user-est-camila',
        email: 'camila.gomez@alumnos.ifts12.edu.ar',
        legajo: 'L-94192',
        nombre: 'Camila Gómez',
        passwordHash: 'doce2026',
        rol: 'estudiante',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante'],
        estudiante_id: 'est-24192',
        descripcion_cargo: 'Estudiante (1º Año) · Tecnicatura en Ciencia de Datos e IA',
      },
      {
        id: 'user-est-juan',
        email: 'juan.perez@alumnos.ifts12.edu.ar',
        legajo: 'L-24155',
        nombre: 'Juan Manuel Pérez',
        passwordHash: 'doce2026',
        rol: 'estudiante',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante'],
        estudiante_id: 'est-24155',
        descripcion_cargo: 'Estudiante (2º Año) · Tecnicatura en Desarrollo de Software',
      },
      {
        id: 'user-tutor-valeria',
        email: 'vmorales@ifts12.edu.ar',
        legajo: 'DOC-1240',
        nombre: 'Prof. Lic. Valeria Morales',
        passwordHash: 'doce2026',
        rol: 'tutor',
        area_asignada: 'tutor',
        areas_permitidas: ['tutor'],
        tutor_id: 'tut-1201',
        descripcion_cargo: 'Cátedra de IA & Acompañamiento Pedagógico',
      },
      {
        id: 'user-com-lucia',
        email: 'lramos@ifts12.edu.ar',
        legajo: 'COM-1206',
        nombre: 'Lic. Lucía Ramos',
        passwordHash: 'doce2026',
        rol: 'comunicacion',
        area_asignada: 'campana',
        areas_permitidas: ['campana'],
        descripcion_cargo: 'Equipo de Medios & Identidad Institucional (Grupo 6)',
      },
      {
        id: 'user-ia-roberto',
        email: 'rsanchez@ifts12.edu.ar',
        legajo: 'IA-1204',
        nombre: 'Ing. Roberto Sánchez',
        passwordHash: 'doce2026',
        rol: 'investigador_ia',
        area_asignada: 'lab',
        areas_permitidas: ['lab'],
        descripcion_cargo: 'Cátedra de IA & Sistemas · Laboratorio de Modelos',
      },
      {
        id: 'user-adm-direccion',
        email: 'direccion@ifts12.edu.ar',
        legajo: 'ADM-1200',
        nombre: 'Coordinación General IFTS N.º 12',
        passwordHash: 'doce2026',
        rol: 'admin',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante', 'tutor', 'campana', 'lab'],
        descripcion_cargo: 'Dirección y Secretaría Académica',
      },
    ];
  }

  private ejecutarInferenciaInicial() {
    this.predicciones = [];
    this.alertas = [];

    for (const est of this.estudiantes) {
      const vector = est.obtener_vector_ia();
      const { prediccion, alerta } = this.redNeuronal.evaluar_riesgo(vector, est.id_usuario);
      this.predicciones.push(prediccion);
      if (alerta) {
        this.alertas.push(alerta);
      }
    }

    // Alerta histórica ya atendida para demostrar el flujo completo
    const alertaHistorica = new Alerta(
      'alt-historica-01',
      'pred-hist-01',
      'est-24155',
      'Sobrecarga por horario rotativo en planta industrial y primera entrega atrasada en Redes',
      ['Sobrecarga Laboral', 'Traslado CABA/AMBA'],
      'Atendida',
      new Date(Date.now() - 86400000 * 5).toISOString()
    );
    alertaHistorica.intervencion_asociada_id = 'int-hist-01';
    this.alertas.push(alertaHistorica);

    const intervencionHistorica = new IntervencionPedagogica(
      'int-hist-01',
      alertaHistorica.id_alerta,
      alertaHistorica.estudiante_id,
      this.tutorPrincipal.id_usuario,
      'Plan de contingencia laboral',
      'Se acordó entrega de trabajos prácticos en formato asincrónico con defensa remota los días sábados.',
      'El alumno mantiene buen rendimiento en evaluaciones prácticas; su dificultad radica exclusivamente en la superposición horaria.',
      new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
    );
    this.intervenciones.push(intervencionHistorica);

    // Mensaje de bienvenida inicial de DOC
    this.interaccionesDOC.push(
      new InteraccionDOC(
        'int-welcome-01',
        'est-alex-12',
        'Hola DOC, estoy con la lectura de Inteligencia Artificial I.',
        '¡Hola Álex! Soy DOC, tu compañero de estudio. Noté que esta lectura viene densa, ¿querés que la desglosemos en 3 puntos clave o usemos una plantilla de síntesis? ¡Vamos paso a paso!',
        'motivacion',
        false
      )
    );
  }

  // Métodos de Autenticación
  public autenticar(identificador: string, pass: string): { user: UserAccount; token: string } | null {
    const ident = identificador.trim().toLowerCase();
    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === ident ||
        u.legajo.toLowerCase() === ident ||
        (u.rol === 'tutor' && (ident.includes('valeria') || ident.includes('morales') || ident.includes('valenzuela') || ident === 'doc-1240')) ||
        (u.id === 'user-est-camila' && (ident === 'l-94192' || ident === 'l-24192' || ident.includes('camila') || ident.includes('94192'))) ||
        u.nombre.toLowerCase().includes(ident) ||
        u.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(ident.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );

    if (!user) return null;

    // Validación de password (permite 'ifts12', 'doce2026', '123456' o demo)
    if (pass && pass.trim() !== '' && pass !== 'ifts12' && pass !== 'doce2026' && pass !== '123456') {
      return null;
    }

    const token = `token-${user.id}-${Date.now()}`;
    this.sesionesActivas.set(token, { userId: user.id, createdAt: new Date() });
    return { user, token };
  }

  public obtenerUsuarioPorToken(token: string): UserAccount | null {
    const sesion = this.sesionesActivas.get(token);
    if (!sesion) return null;
    return this.users.find((u) => u.id === sesion.userId) || null;
  }

  public cerrarSesion(token: string): boolean {
    return this.sesionesActivas.delete(token);
  }
}

// Instancia singleton en memoria para el servidor
export const backendDB = new BackendDatabase();
