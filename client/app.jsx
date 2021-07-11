import React, { Suspense, lazy } from 'react'; // [BUG] no react import
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Header } from "./base-components/header";
import { PageWrapper } from "./base-components/page-wrapper";
import ROUTES from './routes';

const CompaniesPage = lazy(() => import('./pages/companies/companies.page'));
const CompanyPage = lazy(() => import('./pages/company/company.page'));
const CreateCompanyPage = lazy(() => import('./pages/create-company/create-company.page'));
const CreateEmployeePage = lazy(() => import('./pages/create-employee/create-employee.page'));

export const App = () => (
  <BrowserRouter>
    <Header />
    <PageWrapper>
      <Suspense fallback={<div>Carregando...</div>}>
        <Switch>
          <Route exact path={ROUTES.CREATE_COMPANY} component={CreateCompanyPage} />
          <Route exact path={ROUTES.COMPANIES} component={CompaniesPage} />
          <Route exact path={ROUTES.COMPANY} component={CompanyPage} />
          <Route exact path={ROUTES.CREATE_EMPLOYEE} component={CreateEmployeePage} />

          <Redirect to={ROUTES.COMPANIES} />
        </Switch>
      </Suspense>
    </PageWrapper>
  </BrowserRouter>
);
