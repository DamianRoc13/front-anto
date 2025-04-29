import React from 'react'

export default function KPIPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de KPIs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Aquí puedes agregar tus tarjetas de KPIs */}
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold">KPI 1</h2>
          {/* Contenido del KPI */}
        </div>
      </div>
    </div>
  )
}