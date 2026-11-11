/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  BrainCircuit,
  Palette,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { Estudiante, Tutor, AreaSistema } from '../domain/models.js';
import { AuthUserResponse } from '../services/api.js';

interface HeaderProps {
  vistaActiva: AreaSistema;
  onCambiarVista?: (vista: AreaSistema) => void;
  usuario: AuthUserResponse;
  onCerrarSesion: () => void;
  estudiantes: Estudiante[];
  estudianteActual: Estudiante;
  onSeleccionarEstudiante: (est: Estudiante) => void;
  tutor: Tutor;
  totalAlertasPendientes: number;
}

export const Header: React.FC<HeaderProps> = ({
  vistaActiva,
  usuario,
  onCerrarSesion,
  estudiantes,
  estudianteActual,
  onSeleccionarEstudiante,
  totalAlertasPendientes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F1]/95 backdrop-blur-md border-b border-[#E5DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Slogan con El Punto Verde como Firma */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif text-lg font-bold shadow-xs shrink-0 border border-[#263A50]/80">
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
                <span className="w-2 h-2 rounded-full bg-[#819783] inline-block" title="El punto verde como firma" />
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EEE7D7] text-[#263A50] border border-[#DDD4C0]">
                  IFTS N.º 12
                </span>
                <span className="hidden md:inline-block text-[11px] text-[#586879] font-medium">
                  Grupo 6
                </span>
              </div>
              <p className="text-xs text-[#586879] hidden sm:block">
                Tu acompañamiento a medida · Tecnicatura en Ciencia de Datos e IA
              </p>
            </div>
          </div>

          {/* Área Asignada Únicamente por Inicio de Sesión de Usuario (Sin cambio manual de roles) */}
          <nav className="flex items-center px-3.5 py-1.5 bg-[#EEE7D7]/70 rounded-xl border border-[#E2DBCF]">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#263A50]">
              {vistaActiva === 'estudiante' && (
                <>
                  <GraduationCap className="w-4 h-4 stroke-[1.75] text-[#819783]" />
                  <span>Área Estudiante</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  <span className="text-[11px] text-[#586879] font-normal hidden sm:inline">
                    Acceso asignado por inicio de sesión
                  </span>
                </>
              )}

              {vistaActiva === 'tutor' && (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[1.75] text-[#819783]" />
                  <span>Portal Tutoría</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  <span className="text-[11px] text-[#586879] font-normal hidden sm:inline">
                    Acceso asignado por inicio de sesión
                  </span>
                  {totalAlertasPendientes > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#819783] text-white">
                      {totalAlertasPendientes} {totalAlertasPendientes === 1 ? 'alerta' : 'alertas'}
                    </span>
                  )}
                </>
              )}

              {vistaActiva === 'campana' && (
                <>
                  <Palette className="w-4 h-4 stroke-[1.75] text-[#819783]" />
                  <span>Identidad & Campaña</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  <span className="text-[11px] text-[#586879] font-normal hidden sm:inline">
                    Acceso asignado por inicio de sesión
                  </span>
                </>
              )}

              {vistaActiva === 'lab' && (
                <>
                  <BrainCircuit className="w-4 h-4 stroke-[1.75] text-[#819783]" />
                  <span>Laboratorio IA & UML</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  <span className="text-[11px] text-[#586879] font-normal hidden sm:inline">
                    Acceso asignado por inicio de sesión
                  </span>
                </>
              )}
            </div>
          </nav>

          {/* User Profile & Logout Action */}
          <div className="flex items-center space-x-3">
            {/* Si es vista estudiante y hay selección disponible */}
            {vistaActiva === 'estudiante' && usuario.rol === 'admin' ? (
              <div className="relative group">
                <label htmlFor="student-selector" className="sr-only">
                  Seleccionar estudiante
                </label>
                <div className="flex items-center space-x-2 bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#E5DFD3] rounded-xl px-2.5 py-1.5 transition-colors shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#EEE7D7] text-[#263A50] flex items-center justify-center font-bold text-xs font-serif">
                    {estudianteActual.nombre.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-semibold text-[#263A50] flex items-center space-x-1">
                      <span>{estudianteActual.nombre}</span>
                      <span className="text-[10px] text-[#586879] font-mono">
                        ({estudianteActual.legajo})
                      </span>
                    </div>
                  </div>
                  <select
                    id="student-selector"
                    aria-label="Seleccionar estudiante activo"
                    value={estudianteActual.id_usuario}
                    onChange={(e) => {
                      const est = estudiantes.find((s) => s.id_usuario === e.target.value);
                      if (est) onSeleccionarEstudiante(est);
                    }}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  >
                    {estudiantes.map((e) => (
                      <option key={e.id_usuario} value={e.id_usuario} className="bg-white text-[#263A50]">
                        {e.nombre} - Legajo {e.legajo}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#586879]" />
                </div>
              </div>
            ) : null}

            {/* Perfil del Usuario Activo */}
            <div className="flex items-center space-x-2.5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl px-3 py-1.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif font-bold text-xs">
                {usuario.nombre.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-[#263A50] flex items-center space-x-1.5">
                  <span className="truncate max-w-[220px]">{usuario.nombre}</span>
                  <span className="text-[10px] text-[#819783] font-mono">
                    {usuario.legajo}
                  </span>
                </div>
                <div className="text-[10px] text-[#586879] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  <span className="truncate max-w-[130px]">{usuario.descripcion_cargo}</span>
                </div>
              </div>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={onCerrarSesion}
                title="Cerrar sesión institucional"
                aria-label="Cerrar sesión institucional"
                className="ml-1 p-1 rounded-lg text-[#586879] hover:text-[#922B21] hover:bg-[#FDEDEC] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
