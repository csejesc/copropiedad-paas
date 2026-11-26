"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { MODULOS_COPROPIEDAD } from "@/modules/registry";
import { supabase } from "@/lib/supabase/client";

function ModuloDetalleContenido() {
  const params = useParams<{ slug: string }>();
  const modulo = MODULOS_COPROPIEDAD.find((m) => m.id === params.slug);
  const [montoBase, setMontoBase] = useState("1000000");
  const [tasaFondo, setTasaFondo] = useState("5");
  const [resultado, setResultado] = useState("");

  if (!modulo) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <p>Módulo no encontrado.</p>
        <Link href="/" className="text-emerald-400 underline">Volver al panel</Link>
      </main>
    );
  }

  async function ejecutarSimulacion() {
    const base = Number(montoBase) || 0;
    const tasa = Number(tasaFondo) || 0;
    if (modulo?.id === "fondo-reserva" && tasa < 5) {
      setResultado("Rechazado: el aporte al Fondo Común de Reserva no puede ser menor al 5% (Art. 39 Ley 21.442).");
      return;
    }
    const aporte = (base * tasa) / 100;
    const texto = `${modulo?.codigo} verificado · Base: $${base.toLocaleString("es-CL")} · Tasa/Peso: ${tasa}% · Cálculo: $${aporte.toLocaleString("es-CL")}`;
    setResultado(texto);
    await supabase.from("eventos_auditoria").insert({
      modulo: modulo?.codigo,
      accion: "VERIFICACION_MODULO",
      detalle: { base, tasa, aporte },
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/" className="text-sm text-emerald-400 underline">← Volver al panel principal</Link>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-3">
        <span className="text-xs font-mono text-emerald-400">{modulo.codigo}</span>
        <h1 className="text-2xl font-bold">{modulo.nombre}</h1>
        <p className="text-slate-300 text-sm">{modulo.descripcion}</p>
        <div className="text-xs bg-slate-800/80 p-3 rounded text-slate-200">
          <strong>Regla de negocio:</strong> {modulo.reglaClave}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h2 className="font-semibold text-lg">Simulador y Registro en Bitácora</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Monto Base / Referencia ($)</label>
            <input
              type="number"
              value={montoBase}
              onChange={(e) => setMontoBase(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Porcentaje / Tasa (%)</label>
            <input
              type="number"
              value={tasaFondo}
              onChange={(e) => setTasaFondo(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={ejecutarSimulacion}
          className="rounded bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-medium"
        >
          Ejecutar y Registrar Evento
        </button>
        {resultado && <p className="text-sm text-emerald-300">{resultado}</p>}
      </div>
    </main>
  );
}

export default function ModuloDetallePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950 text-slate-100 p-8">Cargando módulo...</main>}>
      <ModuloDetalleContenido />
    </Suspense>
  );
}
