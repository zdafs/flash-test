const companiesFixtures = [
  {
    chosenBenefits: ["vr", "vt"],
    name: "International Business Machines Corporation",
    tradingName: "IBM",
    cnpj: "33372251012677", // [BUG?] breaks the model constraint
    address: "Rua Tutoia, 1157",
  },
  {
    chosenBenefits: ["vr", "vt", "gympass"],
    name: "Flash App Flash Tecnologia e Pagamentos Ltda.",
    tradingName: "Flash App",
    cnpj: "32223020000118", // [BUG?] breaks the model constraint
    address: "Eugenio de Medeiros, 242",
  },
];
db.companies.drop();
db.companies.insertMany(companiesFixtures);
