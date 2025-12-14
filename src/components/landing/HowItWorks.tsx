import { Mail, MessageCircle, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Mail,
      title: "Conecta tu Gmail",
      description:
        "Vincula tu cuenta de Google de forma segura. Solo leemos los correos de tus bancos.",
    },
    {
      icon: MessageCircle,
      title: "Confirma vía WhatsApp",
      description:
        "Recibe cada transacción en tu WhatsApp y confírmala con un mensaje.",
    },
    {
      icon: BarChart3,
      title: "Visualiza tus gastos",
      description:
        "Dashboard inteligente con gráficas y reportes de a dónde va tu dinero.",
    },
  ];

  return (
    <section id="como-funciona" className="py-12 sm:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Cómo funciona</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            Tres pasos simples para tomar control de tus finanzas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-6 sm:p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl sm:text-4xl font-bold text-muted-foreground/20">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
