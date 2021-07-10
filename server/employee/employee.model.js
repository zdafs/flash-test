import mongoose from "mongoose";
// import { MODEL_NAME as COMPANIES_MODEL_NAME } from "../company/company.model";

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome do funcionário é obrigatório"],
    maxlength: [100, "Nome deve possuir no máximo 100 caracteres"],
  },
  phone: {
    type: String,
    required: [true, "Telefone do funcionário é obrigatório"],
    match: [/^[0-9]{11}$/, "Telefone deve possuir apenas números e 11 caracteres"],
  },
  cpf: {
    type: String,
    required: [true, "CPF é obrigatório"],
    match: [/^[0-9]{11}$/, "CPF deve possuir apenas números e 11 caracteres"],
    unique: true,
  },
  givenBenefits: {
    type: [{
      type: String,
      enum: ['vr', 'vt', 'gympass'],
      required: [true, 'Providencie um benefício de tipo valido'],
    }],
    required: [true, "Benefícios são obrigatórios"],
  },
  // companies: {
  //   type: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: COMPANIES_MODEL_NAME,
  //   }],
  //   requierd: [true, 'Empresas relacionadas ao funcionário são obrigatórias'],
  // },
});

export const MODEL_NAME = 'employees';

export default mongoose.models.employees ||
  mongoose.model(MODEL_NAME, EmployeeSchema);
