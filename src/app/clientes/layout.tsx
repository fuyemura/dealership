import AppHeader from "@/components/layout/app-header";

export const dynamic = "force-dynamic";

export default async function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-soft">
      <AppHeader activeSection="clientes" />
      <main className="flex-1 page-container py-8 sm:py-12">{children}</main>
    </div>
  );
}