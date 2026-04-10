export default function NaoEncontrado() {
  return (
    <div className="min-h-screen bg-brand-gray-soft flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-10 max-w-sm w-full text-center">
        <p className="text-4xl font-bold text-brand-black font-display mb-3">404</p>
        <h1 className="font-display text-lg font-bold text-brand-black mb-2">
          Veículo não encontrado
        </h1>
        <p className="text-sm text-brand-gray-text">
          Este QR Code pode ter sido removido ou o link está incorreto.
        </p>
      </div>
    </div>
  );
}
