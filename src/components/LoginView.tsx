/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vista de Inicio de Sesión Institucional - Ecosistema DOCE (IFTS N.º 12)
 * Arquitectura Separada con Control de Acceso Basado en Roles (RBAC).
 * Estética Editorial Adulta: Domine Serif, Public Sans, #FAF8F1, #263A50, #819783.
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Palette,
  BrainCircuit,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Building2,
  KeyRound,
} from 'lucide-react';
import { api, AuthUserResponse } from '../services/api.js';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUserResponse) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [identificador, setIdentificador] = useState('alex.martinez@alumnos.ifts12.edu.ar');
  const [password, setPassword] = useState('ifts12');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const resp = await api.auth.login(identificador, password);
      onLoginSuccess(resp.user);
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  const handleQuickLogin = async (emailQuick: string) => {
    setError(null);
    setCargando(true);
    setIdentificador(emailQuick);

    try {
      const resp = await api.auth.login(emailQuick, 'ifts12');
      onLoginSuccess(resp.user);
    } catch (err: any) {
      setError(err?.message || 'Error en acceso rápido.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col justify-between selection:bg-[#819783] selection:text-white">
      {/* Top Banner Editorial */}
      <header className="border-b border-[#E5DFD3] bg-[#FAF8F1]/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif text-lg font-bold shadow-xs border border-[#263A50]">
              <span className="relative">
                D
                <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-[#819783]" />
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-[#263A50] text-xl font-bold tracking-tight">
                  DOCE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#819783] inline-block" />
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EEE7D7] text-[#263A50] border border-[#DDD4C0]">
                  IFTS N.º 12
                </span>
              </div>
              <p className="text-xs text-[#586879] hidden sm:block">
                Tu acompañamiento a medida · Sistema Integral de Permanencia Estudiantil
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#586879] font-medium">
            <Building2 className="w-4 h-4 stroke-[1.75] text-[#819783]" />
            <span className="hidden md:inline">Gobierno de la Ciudad de Buenos Aires</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contexto Institucional & Identidad */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#263A50] text-xs font-medium border border-[#D0DEC7]">
                <span className="w-2 h-2 rounded-full bg-[#819783]" />
                <span>Autenticación Institucional Segura</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#263A50] font-bold leading-tight">
                Una identidad cercana y adulta al servicio de la permanencia.
              </h1>
              <p className="text-sm text-[#586879] leading-relaxed">
                El ecosistema digital <strong className="text-[#263A50]">DOCE</strong> articula un modelo dual de inteligencia artificial
                (Red Neuronal de alerta temprana y Agente Conversacional) para acompañar la trayectoria de los estudiantes de la Tecnicatura en Ciencia de Datos e IA.
              </p>
            </div>

            {/* Tarjeta de Seguridad y Roles */}
            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#263A50] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#819783] stroke-[2]" />
                <span>Control de Acceso por Roles (RBAC)</span>
              </div>
              <p className="text-xs text-[#586879] leading-relaxed">
                Al identificarse, el sistema inicializa la sesión en el servidor y abre <strong>únicamente el área funcional asignada</strong> a su rol profesional o académico:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#263A50] pt-1">
                <div className="bg-[#FAF8F1] p-2.5 rounded-xl border border-[#EEE7D7] flex items-center space-x-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#263A50] shrink-0" />
                  <span>Área Estudiante</span>
                </div>
                <div className="bg-[#FAF8F1] p-2.5 rounded-xl border border-[#EEE7D7] flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#819783] shrink-0" />
                  <span>Área Tutoría</span>
                </div>
                <div className="bg-[#FAF8F1] p-2.5 rounded-xl border border-[#EEE7D7] flex items-center space-x-2">
                  <Palette className="w-3.5 h-3.5 text-[#263A50] shrink-0" />
                  <span>Área Identidad</span>
                </div>
                <div className="bg-[#FAF8F1] p-2.5 rounded-xl border border-[#EEE7D7] flex items-center space-x-2">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#819783] shrink-0" />
                  <span>Área Laboratorio</span>
                </div>
              </div>
            </div>


          </div>

          {/* Right Column: Formulario & Botones de Acceso Rápido */}
          <div className="lg:col-span-7 space-y-6">
            {/* Formulario Estándar */}
            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE0] mb-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#263A50] flex items-center space-x-2">
                    <span>Ingreso al Sistema</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  </h2>
                  <p className="text-xs text-[#586879] mt-0.5">
                    Ingrese su correo institucional o número de legajo
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#EEE7D7] text-[#263A50] flex items-center justify-center">
                  <KeyRound className="w-4 h-4 stroke-[1.75]" />
                </div>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-[#FDEDEC] text-[#922B21] border border-[#FADBD8] text-xs font-medium flex items-center justify-between space-x-2 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-[#922B21] hover:text-[#263A50] font-bold p-1 cursor-pointer"
                    title="Cerrar aviso"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#263A50] mb-1.5">
                    Correo electrónico institucional / Legajo
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#819783] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={identificador}
                      onChange={(e) => setIdentificador(e.target.value)}
                      placeholder="usuario@alumnos.ifts12.edu.ar o L-25012"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783] focus:ring-1 focus:ring-[#819783] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#263A50] mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#819783] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783] focus:ring-1 focus:ring-[#819783] transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-[#8C98A4] mt-1 block">
                    (Clave de demostración para todas las cuentas: <code className="font-mono text-[#263A50]">ifts12</code>)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#263A50] hover:bg-[#1E2E40] text-[#FAF8F1] text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {cargando ? (
                    <span>Iniciando sesión segura...</span>
                  ) : (
                    <>
                      <span>Iniciar Sesión en DOCE</span>
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </>
                  )}
                </button>
              </form>

              {/* Acceso Rápido por Perfil (1-click para evaluar el sistema según rol) */}
              <div className="mt-8 pt-6 border-t border-[#F0EBE0]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#819783]" />
                    <span className="text-xs font-bold text-[#263A50] uppercase tracking-wider">
                      Acceso Rápido por Perfil (Demostración)
                    </span>
                  </div>
                  <span className="text-[11px] text-[#586879]">Un clic por rol</span>
                </div>
                <p className="text-xs text-[#586879] mb-4">
                  Seleccione un perfil institucional para iniciar sesión de inmediato y abrir exclusivamente su área asignada:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Botón 1: Estudiante Álex Martínez */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('alex.martinez@alumnos.ifts12.edu.ar')}
                    disabled={cargando}
                    className="text-left p-3 rounded-2xl bg-[#FAF8F1] hover:bg-[#F2ECE0] border border-[#E5DFD3] hover:border-[#819783] transition-all flex items-start space-x-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#263A50] text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#263A50] flex items-center justify-between">
                        <span>Álex Martínez</span>
                        <span className="text-[10px] text-[#819783] font-mono">L-25012</span>
                      </div>
                      <div className="text-[11px] text-[#586879] truncate">Estudiante (2º Año)</div>
                      <div className="text-[10px] text-[#263A50] font-semibold mt-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Abre: Solo Área Estudiante</span>
                      </div>
                    </div>
                  </button>

                  {/* Botón: Estudiante Camila Gómez L-94192 */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('camila.gomez@alumnos.ifts12.edu.ar')}
                    disabled={cargando}
                    className="text-left p-3 rounded-2xl bg-[#FAF8F1] hover:bg-[#F2ECE0] border border-[#E5DFD3] hover:border-[#819783] transition-all flex items-start space-x-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#819783] text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#263A50] flex items-center justify-between">
                        <span>Camila Gómez</span>
                        <span className="text-[10px] text-[#819783] font-mono">L-94192</span>
                      </div>
                      <div className="text-[11px] text-[#586879] truncate">Estudiante (1º Año)</div>
                      <div className="text-[10px] text-[#263A50] font-semibold mt-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Abre: Solo Área Estudiante</span>
                      </div>
                    </div>
                  </button>

                  {/* Botón: Estudiante Juan Manuel Pérez L-24155 */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('juan.perez@alumnos.ifts12.edu.ar')}
                    disabled={cargando}
                    className="text-left p-3 rounded-2xl bg-[#FAF8F1] hover:bg-[#F2ECE0] border border-[#E5DFD3] hover:border-[#819783] transition-all flex items-start space-x-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#263A50] text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#263A50] flex items-center justify-between">
                        <span>Juan Manuel Pérez</span>
                        <span className="text-[10px] text-[#819783] font-mono">L-24155</span>
                      </div>
                      <div className="text-[11px] text-[#586879] truncate">Estudiante (2º Año)</div>
                      <div className="text-[10px] text-[#263A50] font-semibold mt-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Abre: Solo Área Estudiante</span>
                      </div>
                    </div>
                  </button>

                  {/* Botón 2: Tutoría y Cátedra de IA */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('vmorales@ifts12.edu.ar')}
                    disabled={cargando}
                    className="text-left p-3 rounded-2xl bg-[#FAF8F1] hover:bg-[#F2ECE0] border border-[#E5DFD3] hover:border-[#819783] transition-all flex items-start space-x-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#819783] text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#263A50] flex items-center justify-between">
                        <span>Prof. Lic. Valeria Morales</span>
                        <span className="text-[10px] text-[#819783] font-mono">DOC-1240</span>
                      </div>
                      <div className="text-[11px] text-[#586879] truncate">Cátedra IA & Tutoría</div>
                      <div className="text-[10px] text-[#263A50] font-semibold mt-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Abre: Solo Portal Tutoría</span>
                      </div>
                    </div>
                  </button>

                  {/* Botón 3: Comunicación (Ocultado según selección del usuario) */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('lramos@ifts12.edu.ar')}
                    disabled={cargando}
                    className="hidden"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#EEE7D7] text-[#263A50] border border-[#DDD4C0] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Palette className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#263A50] flex items-center justify-between">
                        <span>Lic. Lucía Ramos</span>
                        <span className="text-[10px] text-[#819783] font-mono">COM-1206</span>
                      </div>
                      <div className="text-[11px] text-[#586879] truncate">Identidad & Medios</div>
                      <div className="text-[10px] text-[#263A50] font-semibold mt-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Abre: Identidad & Campaña</span>
                      </div>
                    </div>
                  </button>

                  {/* Botón 4: Investigación IA & UML (Ocultado según selección del usuario) */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('rsanchez@ifts12.edu.ar')}
                    disabled={cargando}
                    className="hidden"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#263A50]/90 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <BrainCircuit className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#263A50] flex items-center justify-between">
                        <span>Ing. Roberto Sánchez</span>
                        <span className="text-[10px] text-[#819783] font-mono">IA-1204</span>
                      </div>
                      <div className="text-[11px] text-[#586879] truncate">Cátedra de IA / UML</div>
                      <div className="text-[10px] text-[#263A50] font-semibold mt-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Abre: Lab IA & Arquitectura</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Acceso Administrador Institucional */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('direccion@ifts12.edu.ar')}
                    disabled={cargando}
                    className="w-full text-left p-2.5 rounded-2xl bg-[#EEE7D7]/60 hover:bg-[#EEE7D7] border border-[#DDD4C0] hover:border-[#819783] transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#263A50] text-[#FAF8F1] flex items-center justify-center text-xs font-serif font-bold">
                        D
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#263A50]">
                          Dirección / Coordinación General IFTS N.º 12
                        </div>
                        <div className="text-[10px] text-[#586879]">
                          Rol Administrador institucional (Acceso irrestricto a todas las áreas)
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[#263A50] font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Ingresar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5DFD3] py-4 bg-[#FAF8F1] text-xs text-[#586879]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#263A50]">DOCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
            <span>Instituto de Formación Técnica Superior N.º 12 · CABA</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span>Grupo 6 · Medios de Comunicación</span>
            <span>·</span>
            <span className="text-[#819783] font-medium">Tecnicatura en Ciencia de Datos e IA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
