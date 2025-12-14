import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Es seguro conectar mi cuenta de Google?",
    answer:
      "Sí, usamos OAuth de Google que es el estándar de la industria. Solo leemos los correos de notificaciones bancarias, no tenemos acceso a tu contraseña ni a otros correos.",
  },
  {
    question: "¿Qué bancos colombianos son compatibles?",
    answer:
      "Actualmente soportamos Bancolombia, Nequi, Daviplata, Nu Colombia, Lulo Bank, Rappipay, BBVA, Davivienda, Banco de Bogotá y más.",
  },
  {
    question: "¿Cómo funciona la clasificación automática?",
    answer:
      "Nuestra IA analiza cada transacción y la clasifica automáticamente. Puedes confirmar o corregir la categoría directamente desde WhatsApp.",
  },
  {
    question: "¿FinTrack es gratis?",
    answer:
      "Sí, FinTrack es completamente gratis. No hay costos ocultos ni planes premium.",
  },
  {
    question: "¿Mis datos financieros están protegidos?",
    answer:
      "Absolutamente. Usamos encriptación de nivel bancario y nunca compartimos tu información con terceros.",
  },
  {
    question: "¿Puedo usar FinTrack sin WhatsApp?",
    answer:
      "WhatsApp es opcional pero recomendado. Puedes ver todas tus transacciones en el dashboard web sin necesidad de WhatsApp.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitas saber sobre FinTrack
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="glass-card rounded-xl px-6 border-none"
            >
              <AccordionTrigger className="text-foreground hover:text-primary py-5 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
