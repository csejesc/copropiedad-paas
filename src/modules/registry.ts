export interface CasoUsoModulo {
  id: string;
  codigo: string;
  nombre: string;
  dominio: string;
  descripcion: string;
  reglaClave: string;
  activo: boolean;
}

export const MODULOS_COPROPIEDAD: CasoUsoModulo[] = [
  {
    id: "padron",
    codigo: "CU-01",
    nombre: "Padrón de Unidades y Copropietarios",
    dominio: "padron",
    descripcion: "Registra unidades, alícuotas, representantes y estado hábil o moroso.",
    reglaClave: "Suma de alícuotas debe ser 100% para convocar o emitir.",
    activo: true,
  },
  {
    id: "gastos-comunes",
    codigo: "CU-02",
    nombre: "Emisión y Prorrateo de Gastos Comunes",
    dominio: "gastos-comunes",
    descripcion: "Calcula prorrateo por alícuota y bloquea emisión sin conciliación.",
    reglaClave: "Período emitido es inmutable; suma de cobros exacta.",
    activo: true,
  },
  {
    id: "fondo-reserva",
    codigo: "CU-03",
    nombre: "Fondo Común de Reserva",
    dominio: "fondo-reserva",
    descripcion: "Calcula recargo mínimo legal (5%, Art. 39 Ley 21.442) sin intereses.",
    reglaClave: "Base de cálculo excluye intereses por mora; mínimo 5%.",
    activo: true,
  },
  {
    id: "convenios",
    codigo: "CU-04",
    nombre: "Convenios de Pago y Cuotas",
    dominio: "convenios",
    descripcion: "Gestiona propuestas de pago en cuotas, morosidad y caducidad.",
    reglaClave: "Bloquea nueva propuesta si hubo incumplimiento en < 12 meses.",
    activo: true,
  },
  {
    id: "multas",
    codigo: "CU-05",
    nombre: "Multas por Infracción al Reglamento",
    dominio: "multas",
    descripcion: "Registra multas asociadas a acuerdo/expediente y conversión UTM.",
    reglaClave: "Multa es entidad propia; no se mezcla con gasto común ordinario.",
    activo: true,
  },
  {
    id: "asambleas",
    codigo: "CU-06",
    nombre: "Convocatoria, Quórum y Voto Ponderado",
    dominio: "asambleas",
    descripcion: "Valida citación (5 a 15 días), habilidad al ingresar y voto por alícuota.",
    reglaClave: "Moroso asiste solo con voz; habilidad se fija al ingresar.",
    activo: true,
  },
  {
    id: "actas",
    codigo: "CU-07",
    nombre: "Cierre de Asamblea, Firmas y Actas",
    dominio: "actas",
    descripcion: "Controla firmas requeridas, segunda citación o asamblea fracasada.",
    reglaClave: "Acta archivada y notificada solo con firmas requeridas.",
    activo: true,
  },
  {
    id: "auditoria",
    codigo: "CU-08",
    nombre: "Auditoría, Pagos y Trazabilidad",
    dominio: "auditoria",
    descripcion: "Consulta historial de eventos, saldos y verificaciones del sistema.",
    reglaClave: "Trazabilidad de acciones y estados por unidad.",
    activo: true,
  },
];
