import { Mail, MessageSquare, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Mail,
      title: "Conecta tu Gmail",
      description:
        "Vincula tu cuenta de Google de forma segura. Solo leemos los correos de tus bancos.",
    },
    {
      icon: MessageSquare,
      title: "Confirma vía Telegram",
      description:
        "Recibe una notificación por cada movimiento. Categorízalo con un tap.",
    },
    {
      icon: BarChart3,
      title: "Visualiza tus gastos",
      description:
        "Dashboard inteligente con gráficas y reportes de a dónde va tu dinero.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Cómo funciona</h2>
          <p className="text-xl text-muted-foreground">
            Tres pasos simples para tomar control de tus finanzas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-2xl hover:bg-card/80 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-muted-foreground/20">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
