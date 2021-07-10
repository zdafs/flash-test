import React from 'react'; // [BUG] no react import
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Header } from "./base-components/header";
import { PageWrapper } from "./base-components/page-wrapper";
import { CompaniesPage } from "./pages/companies/companies.page";
import { CompanyPage } from './pages/company/company.page';
import { CreateCompanyPage } from "./pages/create-company/create-company.page";
import { CreateEmployeePage } from './pages/create-employee/create-employee.page';

export const App = () => (
  <BrowserRouter>
    <Header />
    <PageWrapper>
      <Switch>
        <Route path="/create-company" component={() => <CreateCompanyPage />} />
        <Route exact path="/companies" component={() => <CompaniesPage />} />
        <Route path="/companies/:companyId" component={() => <CompanyPage />} />
        <Route path="/create-employee" component={() => <CreateEmployeePage />} />

        <Redirect to="/companies" />
      </Switch>
    </PageWrapper>
  </BrowserRouter>
);
