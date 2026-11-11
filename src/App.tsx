/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ecosistema DOCE - IFTS N.º 12
 * Arquitectura Separada Backend-Frontend con Control de Acceso por Roles (RBAC).
 * Interfaz Editorial Adulta: Domine Serif, Public Sans, Paleta Sabio-Marino-Crema.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.js';
import { StudentView } from './components/StudentView.js';
import { TutorView } from './components/TutorView.js';
import { LabUmlView } from './components/LabUmlView.js';
import { CampaignStoryboardView } from './components/CampaignStoryboardView.js';
import { LoginView } from './components/LoginView.js';
import { inicializarEcosistema } from './domain/seedData.js';
import {
  Estudiante,
  Tutor,
  Alerta,
  IntervencionPedagogica,
  InteraccionDOC,
  PrediccionRiesgo,
  RitmoEstudio,
  ModoDOC,
  AgenteDOC,
  AreaSistema,
} from './domain/models.js';
import { api, AuthUserResponse, tokenStorage } from './services/api.js';
import { Bell, X, ShieldAlert } from 'lucide-react';

export default function App() {
  const [dataEcosistema] = useState(() => inicializarEcosistema());

  // Estado de Autenticación y RBAC
  const [usuario, setUsuario] = useState<AuthUserResponse | null>(null);
  const [comprobandoSesion, setComprobandoSesion] = useState<boolean>(true);

  // Vista activa en el frontend (restringida a las áreas permitidas del usuario)
  const [vistaActiva, setVistaActiva] = useState<AreaSistema>('estudiante');

  // Datos del Ecosistema
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(dataEcosistema.estudiantes);
  const [estudianteActualId, setEstudianteActualId] = useState<string>(dataEcosistema.estudianteActualId);
  const [tutor] = useState<Tutor>(dataEcosistema.tutor);
  const [redNeuronal] = useState(dataEcosistema.redNeuronal);
  const [predicciones, setPredicciones] = useState<PrediccionRiesgo[]>(dataEcosistema.predicciones);
  const [alertas, setAlertas] = useState<Alerta[]>(dataEcosistema.alertas);
  const [intervenciones, setIntervenciones] = useState<IntervencionPedagogica[]>(dataEcosistema.intervenciones);
  const [interaccionesDOC, setInteraccionesDOC] = useState<InteraccionDOC[]>(dataEcosistema.interaccionesDOC);

  const [cargandoDOC, setCargandoDOC] = useState(false);
  const [toastNotif, setToastNotif] = useState<string | null>(null);

  // AgenteDOC local para fallback
  const agenteDOC = useMemo(() => new AgenteDOC('motivacion'), []);

  // Verificar sesión existente en el backend al montar el componente
  useEffect(() => {
    let montado = true;
    const verificarSesion = async () => {
      try {
        const usuarioSesion = await api.auth.getMe();
        if (montado && usuarioSesion) {
          if (usuarioSesion.rol === 'tutor' || usuarioSesion.id.includes('tutor')) {
            usuarioSesion.nombre = 'Prof. Lic. Valeria Morales';
          }
          setUsuario(usuarioSesion);
          // Abrir exclusivamente el área asignada al usuario
          setVistaActiva(usuarioSesion.area_asignada);
          if (usuarioSesion.estudiante_id) {
            setEstudianteActualId(usuarioSesion.estudiante_id);
          }
        }
      } catch (err) {
        console.warn('Error verificando sesión en backend:', err);
      } finally {
        if (montado) setComprobandoSesion(false);
      }
    };

    verificarSesion();
    return () => {
      montado = false;
    };
  }, []);

  // Estudiante actualmente seleccionado
  const estudianteActual = useMemo(() => {
    return estudiantes.find((e) => e.id_usuario === estudianteActualId) || estudiantes[0];
  }, [estudiantes, estudianteActualId]);

  // Predicción y Alerta correspondiente al estudiante actual
  const prediccionActual = useMemo(() => {
    return predicciones.find((p) => p.estudiante_id === estudianteActual.id_usuario) || null;
  }, [predicciones, estudianteActual]);

  const alertaActual = useMemo(() => {
    return alertas.find((a) => a.estudiante_id === estudianteActual.id_usuario && a.estado === 'Pendiente') || null;
  }, [alertas, estudianteActual]);

  const totalAlertasPendientes = useMemo(() => {
    return alertas.filter((a) => a.estado === 'Pendiente').length;
  }, [alertas]);

  // Manejar Login exitoso
  const handleLoginSuccess = (userAuth: AuthUserResponse) => {
    if (userAuth.rol === 'tutor' || userAuth.id.includes('tutor')) {
      userAuth.nombre = 'Prof. Lic. Valeria Morales';
    }
    setUsuario(userAuth);
    // Asignar inmediatamente la vista correspondiente a su área asignada (RBAC)
    setVistaActiva(userAuth.area_asignada);
    if (userAuth.estudiante_id) {
      setEstudianteActualId(userAuth.estudiante_id);
    }
    if (userAuth.rol === 'admin' || userAuth.id === 'user-adm-direccion') {
      setToastNotif(
        'Sesión activa en Coordinación General IFTS N.º 12 · Supervisión y Acompañamiento de Trayectorias Estudiantiles.'
      );
    } else {
      setToastNotif(
        `Bienvenido/a, ${userAuth.nombre}. Sesión activa iniciada en el Área de ${
          userAuth.area_asignada === 'estudiante'
            ? 'Estudiantes'
            : userAuth.area_asignada === 'tutor'
            ? 'Tutoría Institucional'
            : userAuth.area_asignada === 'campana'
            ? 'Identidad & Campaña'
            : 'Laboratorio de IA'
        }.`
      );
    }
  };

  // Manejar Logout
  const handleLogout = async () => {
    await api.auth.logout();
    setUsuario(null);
    setToastNotif('Sesión cerrada correctamente.');
  };

  // Cambiar vista respetando RBAC
  const handleCambiarVista = (nuevaVista: AreaSistema) => {
    if (!usuario) return;
    const permitidas = usuario.areas_permitidas || [usuario.area_asignada];
    if (permitidas.includes(nuevaVista)) {
      setVistaActiva(nuevaVista);
    } else {
      setToastNotif(`Acceso denegado: Su rol (${usuario.rol}) no tiene permisos para el área solicitada.`);
    }
  };

  // Actualizar perfil socio-laboral del estudiante y sincronizar con backend
  const handleActualizarPerfil = async (nuevosDatos: {
    horas_trabajo_semanal: number;
    minutos_viaje: number;
    personas_a_cargo: number;
    nivel_estres_percibido: number;
    ritmo_estudio: RitmoEstudio;
  }) => {
    if (estudianteActual.perfilEstudio) {
      estudianteActual.perfilEstudio.actualizar_perfil(nuevosDatos);
    } else {
      estudianteActual.completar_onboarding(nuevosDatos);
    }

    // Reevaluación local inmediata de la red neuronal predictiva
    const vector = estudianteActual.obtener_vector_ia();
    const { prediccion, alerta } = redNeuronal.evaluar_riesgo(vector, estudianteActual.id_usuario);

    setPredicciones((prev) => {
      const filtered = prev.filter((p) => p.estudiante_id !== estudianteActual.id_usuario);
      return [prediccion, ...filtered];
    });

    if (alerta) {
      setAlertas((prev) => {
        const filtered = prev.filter(
          (a) => !(a.estudiante_id === estudianteActual.id_usuario && a.estado === 'Pendiente')
        );
        return [alerta, ...filtered];
      });
      setToastNotif(
        `[DOCE Alerta Automática] La Red Neuronal clasificó riesgo alto (${Math.round(
          prediccion.probabilidad_desercion * 100
        )}%) y generó una alerta preventiva para el equipo de tutoría.`
      );
    } else {
      setToastNotif('Diagnóstico socio-laboral actualizado y evaluado por la Red Neuronal.');
    }

    // Sincronizar en segundo plano con el Backend REST API
    try {
      await api.estudiante.updatePerfil({
        id_estudiante: estudianteActual.id_usuario,
        horas_trabajo_semanal: nuevosDatos.horas_trabajo_semanal,
        minutos_viaje: nuevosDatos.minutos_viaje,
        personas_a_cargo: nuevosDatos.personas_a_cargo,
        nivel_estres_percibido: nuevosDatos.nivel_estres_percibido,
        ritmo_estudio: nuevosDatos.ritmo_estudio,
      });
    } catch (err) {
      console.warn('Sincronización backend:', err);
    }

    setEstudiantes([...estudiantes]);
  };

  // Enviar mensaje al Agente DOC vía API backend
  const handleEnviarMensajeDOC = async (mensaje: string, modo: ModoDOC) => {
    setCargandoDOC(true);
    let respuestaTexto = '';
    let fueFallback = false;

    try {
      const data = await api.doc.chat(
        mensaje,
        modo,
        estudianteActual.perfilEstudio
          ? {
              horas_trabajo_semanal: estudianteActual.perfilEstudio.horas_trabajo_semanal,
              minutos_viaje: estudianteActual.perfilEstudio.minutos_viaje,
              personas_a_cargo: estudianteActual.perfilEstudio.personas_a_cargo,
              nivel_estres_percibido: estudianteActual.perfilEstudio.nivel_estres_percibido,
              ritmo_estudio: estudianteActual.perfilEstudio.ritmo_estudio,
            }
          : null,
        estudianteActual.id_usuario
      );
      respuestaTexto = data.respuesta;
      fueFallback = data.es_fallback;
    } catch (err) {
      console.warn('Fallback local para DOC:', err);
      respuestaTexto = agenteDOC.activar_fallback(mensaje, modo);
      fueFallback = true;
    } finally {
      setCargandoDOC(false);
    }

    const nuevaInteraccion = new InteraccionDOC(
      `intdoc-${Date.now()}`,
      estudianteActual.id_usuario,
      mensaje,
      respuestaTexto,
      modo,
      fueFallback
    );
    nuevaInteraccion.registrar_interaccion();

    setInteraccionesDOC((prev) => [...prev, nuevaInteraccion]);
  };

  // Desglosar texto con DOC vía API backend
  const handleDesglosarTextoDOC = async (texto: string, materia: string): Promise<string> => {
    try {
      const data = await api.doc.breakdown(texto, materia);
      if (data && data.desglose && data.desglose.trim()) {
        return data.desglose;
      }
      throw new Error('Respuesta de desglose vacía');
    } catch (err) {
      console.warn('Error en fetch breakdown, usando fallback estructurado:', err);
      return agenteDOC.activar_fallback(texto, 'desglose_lectura');
    }
  };

  // Registrar intervención pedagógica por el Tutor y sincronizar con backend
  const handleRegistrarIntervencion = async (
    alerta: Alerta,
    tipo: string,
    acuerdos: string,
    observaciones: string,
    fechaSeguimiento: string
  ) => {
    const intervencion = tutor.registrar_intervencion(
      alerta,
      tipo,
      acuerdos,
      observaciones,
      fechaSeguimiento
    );

    setIntervenciones((prev) => [intervencion, ...prev]);
    setAlertas([...alertas]); // Refrescar estado a "Atendida"
    setToastNotif(
      `Intervención pedagógica registrada exitosamente para ${alerta.estudiante_codigo_anonimizado}. Alerta marcada como Atendida.`
    );

    try {
      await api.tutor.registrarIntervencion({
        alerta_id: alerta.id_alerta,
        tipo_intervencion: tipo,
        acuerdos_alcanzados: acuerdos,
        observaciones: observaciones,
        fecha_seguimiento: fechaSeguimiento,
      });
    } catch (err) {
      console.warn('Sincronización de intervención en backend:', err);
    }
  };

  // Notificar tutoría institucional
  const handleNotificarTutoria = async (alerta: Alerta) => {
    const mensajeNotificacion = alerta.notificar_tutoria();
    setToastNotif(mensajeNotificacion);

    try {
      await api.tutor.notificar(alerta.id_alerta);
    } catch (err) {
      console.warn('Notificación backend:', err);
    }
  };

  // Auto-cerrar toast tras 5 segundos
  useEffect(() => {
    if (toastNotif) {
      const timer = setTimeout(() => setToastNotif(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotif]);

  // Si está comprobando la sesión inicial
  if (comprobandoSesion) {
    return (
      <div className="min-h-screen bg-[#FAF8F1] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif text-2xl font-bold mx-auto border border-[#263A50]">
            <span className="relative">
              D
              <span className="absolute -top-0.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#819783]" />
            </span>
          </div>
          <p className="text-xs text-[#586879] font-medium">Verificando sesión institucional...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de inicio de sesión institucional
  if (!usuario) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Asegurar que la vista activa pertenezca a las áreas permitidas del usuario
  const permitidas = usuario.areas_permitidas || [usuario.area_asignada];
  const vistaValida = permitidas.includes(vistaActiva) ? vistaActiva : usuario.area_asignada;

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-[#263A50] flex flex-col font-sans selection:bg-[#819783] selection:text-white">
      {/* Toast Notification */}
      {toastNotif && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-4 shadow-xl flex items-start space-x-3 animate-in slide-in-from-bottom-3 duration-300">
          <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="flex-1 text-xs text-[#263A50] leading-relaxed font-medium">
            {toastNotif}
          </div>
          <button
            onClick={() => setToastNotif(null)}
            className="text-[#586879] hover:text-[#263A50] p-1 rounded-lg hover:bg-[#FAF8F1] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header con RBAC activo */}
      <Header
        vistaActiva={vistaValida}
        onCambiarVista={handleCambiarVista}
        usuario={usuario}
        onCerrarSesion={handleLogout}
        estudiantes={estudiantes}
        estudianteActual={estudianteActual}
        onSeleccionarEstudiante={(est) => setEstudianteActualId(est.id_usuario)}
        tutor={tutor}
        totalAlertasPendientes={totalAlertasPendientes}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {vistaValida === 'estudiante' && (
          <StudentView
            usuario={usuario}
            estudiante={estudianteActual}
            prediccion={prediccionActual}
            alerta={alertaActual}
            interaccionesDOC={interaccionesDOC.filter((i) => i.estudiante_id === estudianteActual.id_usuario)}
            onActualizarPerfil={handleActualizarPerfil}
            onEnviarMensajeDOC={handleEnviarMensajeDOC}
            onDesglosarTextoDOC={handleDesglosarTextoDOC}
            cargandoDOC={cargandoDOC}
          />
        )}

        {vistaValida === 'tutor' && (
          <TutorView
            tutor={tutor}
            alertas={alertas}
            estudiantes={estudiantes}
            predicciones={predicciones}
            intervenciones={intervenciones}
            onRegistrarIntervencion={handleRegistrarIntervencion}
            onNotificarTutoria={handleNotificarTutoria}
          />
        )}

        {vistaValida === 'campana' && <CampaignStoryboardView />}

        {vistaValida === 'lab' && <LabUmlView redNeuronal={redNeuronal} />}
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-[#E5DFD3] py-6 bg-[#FAF8F1] text-xs text-[#586879]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#263A50]">DOCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
            <span className="font-medium text-[#263A50]">Tu acompañamiento a medida</span>
            <span>·</span>
            <span>IFTS N.º 12</span>
            <span>·</span>
            <span>Grupo 6</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span>Tecnicatura en Ciencia de Datos e Inteligencia Artificial</span>
            <span>·</span>
            <span className="text-[#819783] font-medium flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
              <span>Una identidad cercana y adulta</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
