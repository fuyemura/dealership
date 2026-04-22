"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "../actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ArquivoVeiculo {
  id: string;
  url_arquivo: string;
  arquivo_principal: boolean;
  ordem_exibicao: number;
  tamanho_arquivo: number;
}

export interface VeiculoArquivosProps {
  fotos: ArquivoVeiculo[];
  laudo: ArquivoVeiculo | null;
  uploadFotoAction: (formData: FormData) => Promise<ActionResult>;
  uploadLaudoAction: (formData: FormData) => Promise<ActionResult>;
  excluirArquivoAction: (arquivoId: string) => Promise<ActionResult>;
  principalAction: (arquivoId: string) => Promise<ActionResult>;
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconUpload({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconStar({ size = 14, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconPdf({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
      <polyline points="9 9 10 9" />
    </svg>
  );
}

function IconImage({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconDownload({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Banner de novo cadastro ──────────────────────────────────────────────────

// ─── Zona de upload ───────────────────────────────────────────────────────────

interface UploadZoneProps {
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onFiles: (files: FileList) => void;
  children: React.ReactNode;
}

function UploadZone({ accept, multiple = false, disabled, ariaLabel = "Área de upload", onFiles, children }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files.length) return;
    onFiles(e.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click(); }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors cursor-pointer select-none
        ${disabled ? "opacity-50 cursor-not-allowed border-brand-gray-mid/40 bg-brand-gray-soft/50" : ""}
        ${isDragging && !disabled ? "border-brand-black bg-brand-gray-soft" : "border-brand-gray-mid/50 hover:border-brand-black/30 hover:bg-brand-gray-soft/60"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => e.target.files?.length && onFiles(e.target.files)}
      />
      {children}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function VeiculoArquivos({
  fotos,
  laudo,
  uploadFotoAction,
  uploadLaudoAction,
  excluirArquivoAction,
  principalAction,
}: VeiculoArquivosProps) {
  // Estados de loading/erro
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingLaudo, setUploadingLaudo] = useState(false);
  const [fotoUploadProgress, setFotoUploadProgress] = useState<{ atual: number; total: number } | null>(null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const [erroLaudo, setErroLaudo] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingPrincipalId, setSettingPrincipalId] = useState<string | null>(null);

  const [, startTransition] = useTransition();
  const router = useRouter();

  // ── Upload de fotos ─────────────────────────────────────────────────────────

  const handleFotos = async (files: FileList) => {
    setErroFoto(null);
    const lista = Array.from(files);
    const disponivel = 20 - fotos.length;

    if (disponivel <= 0) {
      setErroFoto("Limite de 20 fotos atingido.");
      return;
    }

    const selecionadas = lista.slice(0, disponivel);
    setUploadingFoto(true);
    setFotoUploadProgress({ atual: 0, total: selecionadas.length });

    for (let i = 0; i < selecionadas.length; i++) {
      setFotoUploadProgress({ atual: i + 1, total: selecionadas.length });
      const fd = new FormData();
      fd.append("arquivo", selecionadas[i]);
      const result = await uploadFotoAction(fd);
      if (result?.error) {
        setErroFoto(result.error);
        break;
      }
    }

    setUploadingFoto(false);
    setFotoUploadProgress(null);
    router.refresh();
  };

  // ── Upload de laudo ─────────────────────────────────────────────────────────

  const handleLaudo = async (files: FileList) => {
    setErroLaudo(null);
    const fd = new FormData();
    fd.append("arquivo", files[0]);
    setUploadingLaudo(true);
    const result = await uploadLaudoAction(fd);
    setUploadingLaudo(false);
    if (result?.error) setErroLaudo(result.error);
    else router.refresh();
  };

  // ── Excluir ─────────────────────────────────────────────────────────────────

  const handleExcluir = (arquivoId: string) => {
    setErroAcao(null);
    setDeletingId(arquivoId);
    startTransition(async () => {
      const result = await excluirArquivoAction(arquivoId);
      setDeletingId(null);
      if (result?.error) setErroAcao(result.error);
      else router.refresh();
    });
  };

  // ── Definir principal ───────────────────────────────────────────────────────

  const handlePrincipal = (arquivoId: string) => {
    setErroAcao(null);
    setSettingPrincipalId(arquivoId);
    startTransition(async () => {
      const result = await principalAction(arquivoId);
      setSettingPrincipalId(null);
      if (result?.error) setErroAcao(result.error);
      else router.refresh();
    });
  };

  return (
    <div className="w-full max-w-5xl space-y-6 mt-6">
      {/* Erro de ação (excluir / definir principal) */}
      {erroAcao && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erroAcao}
        </div>
      )}

      {/* ── Seção de Fotos ──────────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
        {/* Header */}
        <div className="pb-3 mb-6 border-b border-brand-gray-mid/30 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-black">Fotos do Veículo</h2>
          <span className="text-xs text-brand-gray-text/70 tabular-nums">
            {fotos.length} / 20
          </span>
        </div>

        {/* Erro */}
        {erroFoto && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {erroFoto}
          </div>
        )}

        {/* Zona de upload */}
        <UploadZone
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploadingFoto || fotos.length >= 20}
          ariaLabel="Área de upload de fotos"
          onFiles={handleFotos}
        >
          <span className="text-brand-gray-text/50">
            <IconUpload size={28} />
          </span>
          {uploadingFoto && fotoUploadProgress ? (
            <div className="space-y-1.5 w-full max-w-xs">
              <p className="text-sm font-medium text-brand-black">
                Enviando {fotoUploadProgress.atual} de {fotoUploadProgress.total}...
              </p>
              <div className="h-1.5 w-full bg-brand-gray-mid/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-black rounded-full transition-all duration-300"
                  style={{
                    width: `${(fotoUploadProgress.atual / fotoUploadProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-brand-black">
                  Arraste as fotos aqui ou <span className="underline underline-offset-2">clique para selecionar</span>
                </p>
                <p className="text-xs text-brand-gray-text/60 mt-1">
                  JPEG, PNG ou WebP &bull; Máx. 5 MB por foto &bull; Até 20 fotos
                </p>
              </div>
            </>
          )}
        </UploadZone>

        {/* Galeria de fotos */}
        {fotos.length > 0 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotos
              .slice()
              .sort((a, b) => (b.arquivo_principal ? 1 : 0) - (a.arquivo_principal ? 1 : 0) || a.ordem_exibicao - b.ordem_exibicao)
              .map((foto) => (
                <div
                  key={foto.id}
                  className={`relative group rounded-xl overflow-hidden border aspect-video bg-brand-gray-soft ${
                    foto.arquivo_principal
                      ? "border-brand-black ring-2 ring-brand-black/10"
                      : "border-brand-gray-mid/40"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.url_arquivo}
                    alt="Foto do veículo"
                    className="w-full h-full object-cover"
                  />

                  {/* Badge principal */}
                  {foto.arquivo_principal && (
                    <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-brand-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      <IconStar size={9} filled />
                      Principal
                    </div>
                  )}

                  {/* Overlay de ações */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-end p-2 gap-1.5 opacity-0 group-hover:opacity-100">
                    {/* Definir como principal */}
                    {!foto.arquivo_principal && (
                      <button
                        type="button"
                        title="Definir como foto principal"
                        onClick={() => handlePrincipal(foto.id)}
                        disabled={settingPrincipalId === foto.id || deletingId === foto.id}
                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 text-brand-black hover:bg-white transition-colors disabled:opacity-50"
                      >
                        {settingPrincipalId === foto.id ? (
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-brand-black border-t-transparent rounded-full" />
                        ) : (
                          <IconStar size={13} />
                        )}
                      </button>
                    )}

                    {/* Excluir */}
                    <button
                      type="button"
                      title="Excluir foto"
                      onClick={() => handleExcluir(foto.id)}
                      disabled={deletingId === foto.id || settingPrincipalId === foto.id}
                      className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 text-red-600 hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {deletingId === foto.id ? (
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full" />
                      ) : (
                        <IconTrash size={13} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Empty state */}
        {fotos.length === 0 && !uploadingFoto && (
          <div className="mt-4 flex items-center gap-2 text-xs text-brand-gray-text/60">
            <IconImage size={14} />
            Nenhuma foto adicionada.
          </div>
        )}
      </section>

      {/* ── Seção de Laudo ──────────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
        {/* Header */}
        <div className="pb-3 mb-6 border-b border-brand-gray-mid/30">
          <h2 className="text-sm font-semibold text-brand-black">Laudo Técnico</h2>
        </div>

        {/* Erro */}
        {erroLaudo && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {erroLaudo}
          </div>
        )}

        {/* Laudo existente */}
        {laudo ? (
          <div className="flex items-center gap-4 rounded-xl border border-brand-gray-mid/40 bg-brand-gray-soft/50 px-4 py-3.5">
            <span className="text-brand-gray-text flex-shrink-0">
              <IconPdf size={32} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-black truncate">
                Laudo técnico do veículo
              </p>
              <p className="text-xs text-brand-gray-text/70 mt-0.5">
                {formatarTamanho(laudo.tamanho_arquivo)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={laudo.url_arquivo}
                target="_blank"
                rel="noopener noreferrer"
                title="Baixar laudo"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-gray-mid text-brand-black text-xs font-medium px-3 py-1.5 hover:bg-white transition-colors"
              >
                <IconDownload size={12} />
                Baixar
              </a>
              <button
                type="button"
                title="Excluir laudo"
                onClick={() => handleExcluir(laudo.id)}
                disabled={deletingId === laudo.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-600 text-xs font-medium px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deletingId === laudo.id ? (
                  <span className="animate-spin inline-block w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full" />
                ) : (
                  <IconTrash size={12} />
                )}
                Excluir
              </button>
            </div>
          </div>
        ) : null}

        {/* Zona de upload do laudo */}
        <div className={laudo ? "mt-4" : ""}>
          <UploadZone
            accept="application/pdf"
            disabled={uploadingLaudo}
            ariaLabel="Área de upload do laudo técnico"
            onFiles={handleLaudo}
          >
            <span className="text-brand-gray-text/50">
              <IconUpload size={28} />
            </span>
            {uploadingLaudo ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full" />
                <span className="text-sm text-brand-black">Enviando laudo...</span>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-brand-black">
                  {laudo
                    ? <>Arraste o novo laudo aqui ou <span className="underline underline-offset-2">clique para substituir</span></>
                    : <>Arraste o laudo aqui ou <span className="underline underline-offset-2">clique para selecionar</span></>
                  }
                </p>
                <p className="text-xs text-brand-gray-text/60 mt-1">
                  Somente PDF &bull; Máx. 10 MB
                </p>
              </div>
            )}
          </UploadZone>
        </div>
      </section>
    </div>
  );
}
