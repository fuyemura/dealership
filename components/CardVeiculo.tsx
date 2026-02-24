'use client'

import { Veiculo } from '@/types/database'
import { Car, Calendar, Gauge } from 'lucide-react'

interface CardVeiculoProps {
  veiculo: Veiculo
}

export default function CardVeiculo({ veiculo }: CardVeiculoProps) {
  const formatarPreco = (preco?: number) => {
    if (!preco) return 'Preço sob consulta'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  const formatarQuilometragem = (km?: number) => {
    if (!km) return '-'
    return `${km.toLocaleString('pt-BR')} km`
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Placeholder para imagem */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <Car className="w-20 h-20 text-white opacity-50" />
      </div>

      <div className="p-5">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {veiculo.marca} {veiculo.modelo}
        </h3>

        {/* Informações */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{veiculo.ano}</span>
          </div>
          
          {veiculo.quilometragem && (
            <div className="flex items-center text-gray-600 text-sm">
              <Gauge className="w-4 h-4 mr-2" />
              <span>{formatarQuilometragem(veiculo.quilometragem)}</span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="text-2xl font-bold text-blue-600 mb-4">
          {formatarPreco(veiculo.preco)}
        </div>

        {/* Status */}
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          veiculo.status === 'disponivel' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {veiculo.status === 'disponivel' ? 'Disponível' : 'Vendido'}
        </span>
      </div>
    </div>
  )
}