/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Servidor Backend del Ecosistema DOCE - IFTS N.º 12
 * Provee API REST separada con autenticación, control de acceso por rol (RBAC),
 * telemetría de Red Neuronal, acompañamiento pedagógico e integración con Gemini AI.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { backendDB, UserAccount } from './src/server/database.js';
import { IntervencionPedagogica, InteraccionDOC, RitmoEstudio } from './src/domain/models.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Inicialización de Google GenAI en el servidor
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const DOC_SYSTEM_PROMPT = `Eres DOC, el compañero digital pedagógico del IFTS N.º 12 (Instituto de Formación Técnica Superior N.º 12 del GCBA).
Acompañas a estudiantes adultos de tecnicaturas superiores técnicas (Ciencia de Datos e IA, Desarrollo de Software) que en su mayoría trabajan y viajan largas distancias en CABA/AMBA.
REGLAS ESTRICTAS:
1. Límite inquebrantable: MENOS DE 180 PALABRAS por respuesta.
2. NUNCA emitas juicios punitivos, advertencias sancionatorias ni culpes al estudiante por falta de tiempo o atrasos.
3. Brinda contención empática, validación del esfuerzo y propone 1 micro-meta alcanzable hoy (15 a 20 minutos).
4. Tono cálido, argentino institucional y respetuoso ("vos", "revisá", "anotá").`;

// Helper para extraer usuario autenticado desde header Authorization
function getAuthenticatedUser(req: Request): UserAccount | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return backendDB.obtenerUsuarioPorToken(token);
}

// ----------------------------------------------------
// 1. ENDPOINTS DE AUTENTICACIÓN Y ROLES (RBAC)
// ----------------------------------------------------

/**
 * Login: Autentica al usuario por email o legajo y retorna el área asignada estrictamente a su rol.
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { identificador, password } = req.body;

    if (!identificador) {
      return res.status(400).json({ error: 'Identificador (email o legajo) requerido' });
    }

    const authResult = backendDB.autenticar(identificador, password || 'doce2026');

    if (!authResult) {
      return res.status(401).json({ error: 'Credenciales inválidas para el IFTS N.º 12' });
    }

    const { user, token } = authResult;

    // Buscar datos adicionales de estudiante o tutor si corresponde
    let estudianteData = null;
    if (user.estudiante_id) {
      estudianteData = backendDB.estudiantes.find((e) => e.id_usuario === user.estudiante_id);
    }

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        legajo: user.legajo,
        rol: user.rol,
        area_asignada: user.area_asignada,
        areas_permitidas: user.areas_permitidas,
        descripcion_cargo: user.descripcion_cargo,
        estudiante_id: user.estudiante_id,
        tutor_id: user.tutor_id,
        estudiante: estudianteData,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error en el proceso de autenticación', detalle: error?.message });
  }
});

/**
 * Me: Valida sesión activa y devuelve datos del usuario.
 */
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Sesión no válida o expirada' });
  }

  let estudianteData = null;
  if (user.estudiante_id) {
    estudianteData = backendDB.estudiantes.find((e) => e.id_usuario === user.estudiante_id);
  }

  return res.json({
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      legajo: user.legajo,
      rol: user.rol,
      area_asignada: user.area_asignada,
      areas_permitidas: user.areas_permitidas,
      descripcion_cargo: user.descripcion_cargo,
      estudiante_id: user.estudiante_id,
      tutor_id: user.tutor_id,
      estudiante: estudianteData,
    },
  });
});

/**
 * Logout: Invalida token de sesión en el backend.
 */
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    backendDB.cerrarSesion(token);
  }
  return res.json({ success: true, message: 'Sesión cerrada correctamente' });
});

// ----------------------------------------------------
// 2. ENDPOINTS DE ESTUDIANTE
// ----------------------------------------------------

/**
 * Obtener datos completos de estudiante, cursadas, predicción y alertas.
 */
app.get('/api/estudiante/perfil', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const studentId = (req.query.id as string) || (user?.estudiante_id ?? 'est-alex-12');

  const estudiante = backendDB.estudiantes.find((e) => e.id_usuario === studentId);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  const prediccion = backendDB.predicciones.find((p) => p.estudiante_id === estudiante.id_usuario) || null;
  const alerta = backendDB.alertas.find((a) => a.estudiante_id === estudiante.id_usuario && a.estado === 'Pendiente') || null;
  const interacciones = backendDB.interaccionesDOC.filter((i) => i.estudiante_id === estudiante.id_usuario);

  return res.json({
    estudiante,
    trayectoria: estudiante.consultar_trayectoria(),
    prediccion,
    alerta,
    interaccionesDOC: interacciones,
    sobrecarga: estudiante.perfilEstudio?.obtener_indice_sobrecarga() ?? null,
  });
});

/**
 * Actualizar diagnóstico socio-laboral del estudiante y recalcular inferencia de IA.
 */
app.put('/api/estudiante/perfil', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const studentId = (req.body.id_estudiante as string) || (user?.estudiante_id ?? 'est-alex-12');

  const estudiante = backendDB.estudiantes.find((e) => e.id_usuario === studentId);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  const { horas_trabajo_semanal, minutos_viaje, personas_a_cargo, nivel_estres_percibido, ritmo_estudio } = req.body;

  if (estudiante.perfilEstudio) {
    estudiante.perfilEstudio.actualizar_perfil({
      horas_trabajo_semanal: Number(horas_trabajo_semanal),
      minutos_viaje: Number(minutos_viaje),
      personas_a_cargo: Number(personas_a_cargo),
      nivel_estres_percibido: Number(nivel_estres_percibido),
      ritmo_estudio: ritmo_estudio as RitmoEstudio,
    });
  } else {
    estudiante.completar_onboarding({
      horas_trabajo_semanal: Number(horas_trabajo_semanal),
      minutos_viaje: Number(minutos_viaje),
      personas_a_cargo: Number(personas_a_cargo),
      nivel_estres_percibido: Number(nivel_estres_percibido),
      ritmo_estudio: ritmo_estudio as RitmoEstudio,
    });
  }

  // Re-evaluar inferencia con la Red Neuronal
  const vector = estudiante.obtener_vector_ia();
  const { prediccion, alerta } = backendDB.redNeuronal.evaluar_riesgo(vector, estudiante.id_usuario);

  // Actualizar predicciones
  backendDB.predicciones = backendDB.predicciones.filter((p) => p.estudiante_id !== estudiante.id_usuario);
  backendDB.predicciones.unshift(prediccion);

  // Si se generó alerta
  if (alerta) {
    backendDB.alertas = backendDB.alertas.filter(
      (a) => !(a.estudiante_id === estudiante.id_usuario && a.estado === 'Pendiente')
    );
    backendDB.alertas.unshift(alerta);
  }

  return res.json({
    success: true,
    mensaje: 'Perfil socio-laboral actualizado e inferencia de IA recalculada',
    prediccion,
    alerta,
    sobrecarga: estudiante.perfilEstudio?.obtener_indice_sobrecarga(),
  });
});

// ----------------------------------------------------
// 3. ENDPOINTS DE TUTORÍA
// ----------------------------------------------------

/**
 * Dashboard institucional de tutoría con métricas y alertas.
 */
app.get('/api/tutor/dashboard', (_req: Request, res: Response) => {
  return res.json({
    tutor: backendDB.tutorPrincipal,
    indicadoresRetencion: [
      { factor: 'Demoras académicas en entregas (carga laboral)', porcentaje: 82.3, color: '#B85D43' },
      { factor: 'Inasistencias frecuentes justificadas (>25%)', porcentaje: 53.8, color: '#B8863A' },
      { factor: 'Baja actividad en campus virtual', porcentaje: 38.3, color: '#819783' },
      { factor: 'Traslado excesivo en transporte CABA/AMBA', porcentaje: 28.9, color: '#263A50' },
    ],
    resumenRed: {
      version: backendDB.redNeuronal.version_modelo,
      f1_score: backendDB.redNeuronal.f1_score,
      accuracy: backendDB.redNeuronal.accuracy,
      estudiantesEnSeguimiento: '~25% de la cohorte activa',
    },
    alertas: backendDB.alertas,
    intervenciones: backendDB.intervenciones,
    estudiantes: backendDB.estudiantes.map((e) => ({
      id_usuario: e.id_usuario,
      nombre: e.nombre,
      legajo: e.legajo,
      estilo_aprendizaje: e.estilo_aprendizaje,
    })),
  });
});

/**
 * Registrar intervención pedagógica institucional no punitiva.
 */
app.post('/api/tutor/intervenciones', (req: Request, res: Response) => {
  const { alerta_id, tipo_intervencion, acuerdos_alcanzados, observaciones, fecha_seguimiento } = req.body;

  const alerta = backendDB.alertas.find((a) => a.id_alerta === alerta_id);
  if (!alerta) {
    return res.status(404).json({ error: 'Alerta no encontrada' });
  }

  const nuevaIntervencion = new IntervencionPedagogica(
    `int-${Date.now()}`,
    alerta.id_alerta,
    alerta.estudiante_id,
    backendDB.tutorPrincipal.id_usuario,
    tipo_intervencion || 'Plan de contingencia laboral',
    acuerdos_alcanzados || 'Acuerdos coordinados con el estudiante',
    observaciones || '',
    fecha_seguimiento || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );

  backendDB.intervenciones.unshift(nuevaIntervencion);

  // Marcar alerta como atendida
  alerta.marcar_atendida(nuevaIntervencion.id_intervencion);

  return res.json({
    success: true,
    intervencion: nuevaIntervencion,
    alerta,
  });
});

/**
 * Notificar al estudiante sobre apoyo pedagógico.
 */
app.post('/api/tutor/notificar', (req: Request, res: Response) => {
  const { alerta_id } = req.body;
  const alerta = backendDB.alertas.find((a) => a.id_alerta === alerta_id);
  if (!alerta) {
    return res.status(404).json({ error: 'Alerta no encontrada' });
  }

  alerta.notificar_tutoria();

  return res.json({
    success: true,
    mensaje: `Notificación institucional enviada al legajo anonimizado ${alerta.estudiante_codigo_anonimizado}`,
    alerta,
  });
});

// ----------------------------------------------------
// 4. ENDPOINTS DE LABORATORIO DE IA
// ----------------------------------------------------

/**
 * Evaluación de vector arbitrario en el simulador de Red Neuronal.
 */
app.post('/api/lab/evaluate', (req: Request, res: Response) => {
  const vector = req.body.vector;
  if (!vector) {
    return res.status(400).json({ error: 'Vector de estudiante requerido' });
  }

  const { prediccion, alerta } = backendDB.redNeuronal.evaluar_riesgo(vector, 'sim-live-req');

  return res.json({
    prediccion,
    alerta,
    version_modelo: backendDB.redNeuronal.version_modelo,
    f1_score: backendDB.redNeuronal.f1_score,
    accuracy: backendDB.redNeuronal.accuracy,
  });
});

// ----------------------------------------------------
// 5. ENDPOINTS DE IA CONVERSACIONAL (DOC)
// ----------------------------------------------------

/**
 * Chat con DOC (<180 palabras, no punitivo).
 */
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { mensaje, modo, perfil, estudiante_id } = req.body;
    if (!mensaje) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    let respuestaTexto = '';
    let esFallback = false;

    if (ai) {
      try {
        let promptContext = `Mensaje del estudiante: "${mensaje}"\n`;
        if (perfil) {
          promptContext += `Contexto socio-laboral: Trabaja ${perfil.horas_trabajo_semanal}h/sem, viaja ${perfil.minutos_viaje} min/día, nivel de estrés ${perfil.nivel_estres_percibido}/10, ritmo ${perfil.ritmo_estudio}.\n`;
        }
        if (modo) {
          promptContext += `Modo de acompañamiento: ${modo}.\n`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptContext,
          config: {
            systemInstruction: DOC_SYSTEM_PROMPT,
          },
        });

        respuestaTexto = response.text || '';
      } catch (err: any) {
        console.warn('Error en Gemini API, utilizando fallback adaptativo:', err?.message || err);
        esFallback = true;
      }
    } else {
      esFallback = true;
    }

    if (esFallback || !respuestaTexto) {
      const m = (mensaje || '').toLowerCase();
      if (m.includes('cansad') || m.includes('trabaj') || m.includes('viaj') || m.includes('tiempo')) {
        respuestaTexto = `¡Te entiendo perfectamente! En el IFTS 12 valoramos un montón tu esfuerzo: cursar una tecnicatura tras trabajar y viajar no es poca cosa. No intentes abarcar toda la materia hoy. Fijate una micro-meta de 15 minutos: lee solo una diapositiva o prueba una función de código. ¡Cada paso cuenta y estás avanzando!`;
      } else if (m.includes('entreg') || m.includes('tp') || m.includes('parcial') || m.includes('atras')) {
        respuestaTexto = `¡No te desanimes! Los profes y el equipo de tutoría del IFTS 12 estamos para acompañarte, no para juzgarte. Si tenés una entrega pendiente, hablá con tu tutor o docente para acordar una prórroga o plan de contingencia. Enfocate hoy en desbloquear el primer punto. ¿Querés que revisemos qué concepto te está trabando?`;
      } else {
        respuestaTexto = `¡Hola! Soy DOC, tu compañero en el IFTS 12. Sé lo demandante que es equilibrar la vida laboral con el estudio técnico. Mi objetivo es que no aflojes y que puedas estudiar a tu propio ritmo. ¿Qué tema o duda puntual tenés hoy? Vamos de a poco, un concepto a la vez.`;
      }
    }

    const conteoPalabras = respuestaTexto.trim().split(/\s+/).length;

    // Registrar interacción en base de datos del backend
    const nuevaInteraccion = new InteraccionDOC(
      `int-${Date.now()}`,
      estudiante_id || 'est-alex-12',
      mensaje,
      respuestaTexto,
      modo || 'motivacion',
      esFallback
    );
    backendDB.interaccionesDOC.push(nuevaInteraccion);

    return res.json({
      respuesta: respuestaTexto,
      es_fallback: esFallback,
      palabras: conteoPalabras,
      interaccion: nuevaInteraccion,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Error interno en el servicio pedagógico',
      detalle: error?.message,
    });
  }
});

/**
 * Desglose Conceptual de Lectura (<160 palabras).
 */
app.post('/api/gemini/breakdown', async (req: Request, res: Response) => {
  try {
    const { texto, materia } = req.body;
    if (!texto) {
      return res.status(400).json({ error: 'Texto para desglose requerido' });
    }

    let respuestaTexto = '';
    let esFallback = false;

    if (ai) {
      try {
        const prompt = `Desglosa el siguiente texto/apunte técnico de ${materia || 'la materia'} para un estudiante del IFTS 12.
Estructura exactamente en menos de 160 palabras:
🎯 Concepto Clave: (1 frase simple)
💡 Ejemplo o Analogía Cotidiana: (1 o 2 oraciones)
🚀 Micro-Acción para Hoy: (ejercicio o prueba de 15 min)

Texto a desglosar:
"""${texto}"""`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: DOC_SYSTEM_PROMPT,
          },
        });

        respuestaTexto = response.text || '';
      } catch (err: any) {
        console.warn('Error en desglose Gemini API, usando fallback:', err?.message || err);
        esFallback = true;
      }
    } else {
      esFallback = true;
    }

    if (esFallback || !respuestaTexto) {
      respuestaTexto = `🎯 Concepto Clave: El texto sintetiza la estructura modular y el flujo de control fundamental del tema.\n💡 Ejemplo Cotidiano: Pensalo como un circuito o receta paso a paso donde cada bloque tiene una sola responsabilidad.\n🚀 Micro-Acción para Hoy: Escribí en una hoja o bloc 3 ideas centrales en viñetas y dejá 1 pregunta para consultar en el foro o clase. ¡Listo por hoy!`;
    }

    return res.json({
      desglose: respuestaTexto,
      es_fallback: esFallback,
      palabras: respuestaTexto.trim().split(/\s+/).length,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Error al procesar el desglose de lectura',
    });
  }
});

// ----------------------------------------------------
// 6. SERVIR FRONTEND CON VITE
// ----------------------------------------------------
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[DOCE] Backend activo en http://localhost:${PORT}`);
});
