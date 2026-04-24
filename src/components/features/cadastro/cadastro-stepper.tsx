interface CadastroStepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  "Plano",
  "Pagamento",
  "Empresa e Admin",
  "Revisao",
] as const;

export function CadastroStepper({ currentStep }: CadastroStepperProps) {
  return (
    <div
      className="mb-6 rounded-xl border border-brand-gray-mid/40 bg-brand-white px-4 py-3"
      aria-label="Progresso do cadastro"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-gray-text">
          Etapa {currentStep} de {STEPS.length}
        </p>
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={label}
              className={`rounded-lg border px-3 py-2 text-xs sm:text-sm ${
                isCurrent
                  ? "border-brand-black bg-brand-black/5 text-brand-black"
                  : isDone
                    ? "border-brand-accent/40 bg-brand-accent/10 text-brand-black"
                    : "border-brand-gray-mid/40 bg-brand-gray-soft text-brand-gray-text"
              }`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {stepNumber}. {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
