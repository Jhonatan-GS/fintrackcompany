import {
  RefreshCw,
  Building2,
  Bot,
  PieChart,
  Lock,
  Smartphone,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: RefreshCw,
      title: "Sincronización automática",
      description: "Sin ingresar datos manualmente",
    },
    {
      icon: Building2,
      title: "Multi-banco",
      description: "Todos tus bancos en un solo lugar",
    },
    {
      icon: Bot,
      title: "IA inteligente",
      description: "Categorización automática con IA",
    },
    {
      icon: PieChart,
      title: "Reportes visuales",
      description: "Entiende tus hábitos de gasto",
    },
    {
      icon: Lock,
      title: "Seguro y privado",
      description: "Solo lectura, nunca tocamos tu dinero",
    },
    {
      icon: Smartphone,
      title: "Notificaciones Telegram",
      description: "Confirma gastos al instante",
    },
  ];

  return (
    <section id="caracteristicas" className="py-12 sm:py-20 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Características</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            Todo lo que necesitas para controlar tu dinero
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-5 sm:p-6 rounded-2xl hover:bg-card/80 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
