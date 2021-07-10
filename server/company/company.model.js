import mongoose from "mongoose";
import { MODEL_NAME as EMPLOYEES_MODEL_NAME } from "../employee/employee.model.js";

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome da empresa é obrigatório"],
    maxlength: [100, "Nome deve possuir no máximo 100 caracteres"],
  },
  tradingName: {
    type: String,
    required: [true, "Nome fantasia é obrigatório"],
    maxlength: [100, "Nome fantasia deve possuir no máximo 100 caracteres"],
  },
  cnpj: {
    type: String,
    required: [true, "CNPJ é obrigatório"],
    match: [/^[0-9]{14}$/, "CNPJ deve possuir apenas números e 14 caracteres"], // [BUG] wrong regex
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Endereço é obrigatório"],
    maxlength: [100, "Endereço deve possuir no máximo 100 caracteres"],
  },
  chosenBenefits: {
    type: [{
      type: String,
      enum: ['vr', 'vt', 'gympass'],
      required: [true, 'Providencie um benefício de tipo valido'],
    }],
    required: [true, "Benefícios são obrigatórios"], // [BUG?] required field was not required
  },
  employees: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: EMPLOYEES_MODEL_NAME,
    }],
  },
});

export const MODEL_NAME = 'companies';

export default mongoose.models.companies ||
  mongoose.model(MODEL_NAME, CompanySchema);
