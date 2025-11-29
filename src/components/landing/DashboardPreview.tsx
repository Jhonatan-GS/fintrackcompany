import dashboardMockup from "@/assets/dashboard-mockup.jpg";

export const DashboardPreview = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Todo tu dinero, <span className="text-gradient">una sola vista</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dashboard completo con gráficas interactivas, análisis de gastos y
            reportes detallados de tus finanzas
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-3xl -z-10" />
          <div className="glass-card p-4 rounded-3xl">
            <img
              src={dashboardMockup}
              alt="Dashboard completo de FinTrack"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
