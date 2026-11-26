"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { MODULOS_COPROPIEDAD } from "@/modules/registry";

interface Unidad {
  id: string;
  codigo: string;
  alicuota: number;
  estado_legal: string;
  saldo_pendiente: number;
}

export default function HomePage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [codigo, setCodigo] = useState("");
  const [alicuota, setAlicuota] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarUnidades() {
    const { data, error } = await supabase
      .from("unidades")
      .select("id, codigo, alicuota, estado_legal, saldo_pendiente")
      .order("codigo", { ascending: true });
    if (!error && data) {
      setUnidades(data);
    }
  }

  useEffect(() => {
    cargarUnidades();
  }, []);

  const sumaAlicuotas = unidades.reduce((acc, u) => acc + Number(u.alicuota), 0);

  async function agregarUnidad(e: React.FormEvent) {
    e.preventDefault();
    setMensaje("");
    const pct = Number(alicuota);
    if (!codigo.trim() || isNaN(pct) || pct <= 0) {
      setMensaje("Ingresa código de unidad y alícuota válida.");
      return;
    }
    if (sumaAlicuotas + pct > 100.001) {
      setMensaje(`Error: la suma superaría el 100% (actual: ${sumaAlicuotas.toFixed(2)}%).`);
      return;
    }
    const { error } = await supabase.from("unidades").insert({
      codigo: codigo.trim(),
      alicuota: pct,
      estado_legal: "HABIL",
      saldo_pendiente: 0,
    });
    if (error) {
      setMensaje(`Error al guardar: ${error.message}`);
      return;
    }
    await supabase.from("eventos_auditoria").insert({
      modulo: "CU-01 Padron",
      accion: "CREAR_UNIDAD",
      detalle: { codigo: codigo.trim(), alicuota: pct },
    });
    setCodigo("");
    setAlicuota("");
    setMensaje("Unidad registrada correctamente en Supabase.");
    cargarUnidades();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto space-y-8">
      <header className="border-b border-slate-800 pb-4 flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
          PaaS Modular · Ley 21.442 · Next.js + Supabase + Vercel
        </span>
        <h1 className="text-3xl font-bold">Administración de Copropiedad</h1>
        <p className="text-slate-400 text-sm">
          Suma actual de alícuotas:{" "}
          <strong className={Math.abs(sumaAlicuotas - 100) < 0.01 ? "text-emerald-400" : "text-amber-400"}>
            {sumaAlicuotas.toFixed(2)}%
          </strong>{" "}
          · Unidades registradas: <strong>{unidades.length}</strong>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODULOS_COPROPIEDAD.map((mod) => (
          <Link
            key={mod.id}
            href={`/modulos/${mod.id}`}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-emerald-500/60 transition-colors flex flex-col justify-between gap-2"
          >
            <div>
              <div className="text-xs font-mono text-emerald-400">{mod.codigo}</div>
              <h2 className="font-semibold text-base mt-1">{mod.nombre}</h2>
              <p className="text-xs text-slate-400 mt-1">{mod.descripcion}</p>
            </div>
            <div className="text-[11px] text-slate-300 bg-slate-800/80 rounded p-2 mt-2">
              {mod.reglaClave}
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={agregarUnidad} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h2 className="font-semibold text-lg">CU-01: Nueva Unidad</h2>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Código Unidad</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: 105"
              className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Alícuota (%)</label>
            <input
              type="number"
              step="0.001"
              value={alicuota}
              onChange={(e) => setAlicuota(e.target.value)}
              placeholder="Ej: 10"
              className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 text-sm"
          >
            Guardar Unidad
          </button>
          {mensaje && <p className="text-xs text-amber-300">{mensaje}</p>}
        </form>

        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5 overflow-x-auto">
          <h2 className="font-semibold text-lg mb-3">Padrón en Supabase</h2>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2">Unidad</th>
                <th className="py-2">Alícuota</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {unidades.map((u) => (
                <tr key={u.id}>
                  <td className="py-2 font-medium">{u.codigo}</td>
                  <td className="py-2">{Number(u.alicuota).toFixed(2)}%</td>
                  <td className="py-2">{u.estado_legal}</td>
                  <td className="py-2">${Number(u.saldo_pendiente).toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
