import type { ReactNode } from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { Footer } from "@/components/features/landing/footer";

interface TocItem {
  href: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  badgeColor?: string;
  updatedAt?: string;
  tocItems: TocItem[];
  children: ReactNode;
}

export function LegalLayout({
  title,
  badgeColor = "#4ade80",
  updatedAt = "13 de março de 2026",
  tocItems,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <Navbar />

      <div className="bg-[#0a0a0a] text-white min-h-screen pt-14 sm:pt-16">

        {/* Hero */}
        <div className="max-w-[900px] mx-auto px-6 sm:px-12 pt-16 pb-12 border-b border-white/5">
          <div
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-widest uppercase text-white/60 mb-6"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: badgeColor }}
            />
            Documento Legal
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-none text-white mb-5">
            {title}
          </h1>

          <p className="text-sm text-white/40">
            Última atualização: {updatedAt}&nbsp;&nbsp;·&nbsp;&nbsp;Versão 1.0
          </p>
        </div>

        {/* Content grid */}
        <div className="max-w-[900px] mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 md:gap-16 items-start">

          {/* Sidebar TOC */}
          <aside className="hidden md:block sticky top-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30 mb-4">
              Nesta página
            </p>
            <nav className="flex flex-col">
              {tocItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[13px] text-white/40 hover:text-white py-1.5 pl-3 border-l-2 border-white/10 hover:border-white transition-all duration-200 leading-snug"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="legal-content">
            {children}
          </main>

        </div>
      </div>

      <Footer />

      {/* Scoped styles for legal prose */}
      <style>{`
        .legal-content section { margin-bottom: 52px; }

        .legal-content h2 {
          font-family: var(--font-display, sans-serif);
          font-weight: 700;
          font-size: 1.25rem;
          color: #ffffff;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .legal-content p {
          color: rgba(255,255,255,0.65);
          font-size: 0.9rem;
          margin-bottom: 12px;
          line-height: 1.8;
        }

        .legal-content ul {
          margin: 10px 0 12px 0;
          padding: 0;
          list-style: none;
        }

        .legal-content ul li {
          color: rgba(255,255,255,0.65);
          font-size: 0.9rem;
          padding: 5px 0 5px 18px;
          position: relative;
          line-height: 1.75;
        }

        .legal-content ul li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: rgba(255,255,255,0.25);
          font-size: 0.8rem;
        }

        .legal-content strong { color: #ffffff; font-weight: 500; }

        .legal-content a { color: #ffffff; }

        .highlight-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 3px solid rgba(255,255,255,0.5);
          padding: 16px 20px;
          border-radius: 4px;
          margin: 16px 0;
        }

        .highlight-box p {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
        }

        .warning-box {
          background: rgba(245,158,11,0.05);
          border: 1px solid rgba(245,158,11,0.15);
          border-left: 3px solid #f59e0b;
          padding: 16px 20px;
          border-radius: 4px;
          margin: 16px 0;
        }

        .warning-box p {
          margin: 0;
          font-size: 0.875rem;
          color: #fcd34d;
        }

        .rights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 20px 0;
        }

        @media (max-width: 600px) {
          .rights-grid { grid-template-columns: 1fr; }
        }

        .right-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 20px;
          transition: border-color 0.2s;
        }

        .right-card:hover { border-color: rgba(255,255,255,0.15); }

        .right-card .right-icon { font-size: 1.4rem; margin-bottom: 8px; }

        .right-card h3 {
          font-weight: 700;
          font-size: 0.9rem;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .right-card p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          margin: 0;
          line-height: 1.6;
        }

        .steps { margin: 18px 0; }

        .step {
          display: flex;
          gap: 18px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .step:last-child { border-bottom: none; }

        .step-num {
          width: 30px; height: 30px; min-width: 30px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
        }

        .step-content h4 {
          font-weight: 700;
          font-size: 0.875rem;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .step-content p {
          font-size: 0.825rem;
          color: rgba(255,255,255,0.4);
          margin: 0;
          line-height: 1.6;
        }
      `}</style>
    </>
  );
}
