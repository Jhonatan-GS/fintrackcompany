export const BankLogos = () => {
  const banks = [
    "Bancolombia",
    "Nequi",
    "Daviplata",
    "Nu Colombia",
    "Lulo Bank",
    "Rappipay",
    "BBVA",
    "Davivienda",
  ];

  return (
    <section className="py-16 px-4 border-y border-border">
      <div className="container mx-auto">
        <p className="text-center text-muted-foreground mb-8">
          Compatible con los principales bancos y billeteras de Colombia
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {banks.map((bank) => (
            <div
              key={bank}
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors font-medium text-lg"
            >
              {bank}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
