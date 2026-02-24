'use client'

import { useState } from 'react'
import { criarClienteSupabase } from '@/lib/supabase/client'
import { VeiculoInsercao } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function FormularioVeiculo() {
  const router = useRouter()
  const supabase = criarClienteSupabase()
  const [carregando, setCarregando] = useState(false)
  const [dados, setDados] = useState<VeiculoInsercao>({
    loja_id: '', // Você vai pegar isso da autenticação depois
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: '',
    cor: '',
    quilometragem: undefined,
    preco: undefined,
    descricao: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)

    try {
      const { data, error } = await supabase
        .from('veiculos')
        .insert([{
          ...dados,
          status: 'disponivel'
        }])
        .select()
        .single()

      if (error) throw error

      alert('Veículo cadastrado com sucesso!')
      router.push('/veiculos')
      router.refresh()

    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao cadastrar veículo')
    } finally {
      setCarregando(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDados(prev => ({
      ...prev,
      [name]: name === 'ano' || name === 'quilometragem' || name === 'preco' 
        ? value === '' ? undefined : Number(value)
        : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Cadastrar Novo Veículo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            name="marca"
            value={dados.marca}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Toyota"
          />
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo *
          </label>
          <input
            type="text"
            name="modelo"
            value={dados.modelo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Corolla"
          />
        </div>

        {/* Ano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ano *
          </label>
          <input
            type="number"
            name="ano"
            value={dados.ano}
            onChange={handleChange}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Placa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placa
          </label>
          <input
            type="text"
            name="placa"
            value={dados.placa}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ABC-1234"
          />
        </div>

        {/* Cor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor
          </label>
          <input
            type="text"
            name="cor"
            value={dados.cor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Prata"
          />
        </div>

        {/* Quilometragem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quilometragem (km)
          </label>
          <input
            type="number"
            name="quilometragem"
            value={dados.quilometragem || ''}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000"
          />
        </div>

        {/* Tipo de Combustível */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Combustível
          </label>
          <select
            name="tipo_combustivel"
            value={dados.tipo_combustivel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="flex">Flex</option>
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diesel</option>
            <option value="eletrico">Elétrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        {/* Câmbio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Câmbio
          </label>
          <select
            name="cambio"
            value={dados.cambio || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="manual">Manual</option>
            <option value="automatico">Automático</option>
            <option value="automatizado">Automatizado</option>
          </select>
        </div>

        {/* Preço */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$)
          </label>
          <input
            type="number"
            name="preco"
            value={dados.preco || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000.00"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={dados.descricao}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descreva os detalhes do veículo..."
          />
        </div>
      </div>

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={carregando}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {carregando ? 'Cadastrando...' : 'Cadastrar Veículo'}
      </button>
    </form>
  )
}