import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Employees } from "./company.styles";
import { PageTitle } from "../../base-components/page-title";
import { Row, Col, message } from "antd";
import { FIND_EMPLOYEES_BY_COMPANY_ID } from "../../graphql/queries";
import { formatCPF } from "../../common";

const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => b.name.localeCompare(a.name),
    sortDirections: ["ascend", "descend", "ascend"],
  },
  {
    title: "Telefone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "CPF",
    dataIndex: "cpf",
    key: "cpf",
  },
  {
    title: "Endereço",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Benefícios",
    dataIndex: "givenBenefits",
    key: "givenBenefits",
    render: (benefits) => <>{benefits.join(", ")}</>,
  },
];

export const CompanyPage = () => {
  const { companyId } = useParams();

  const { loading: companyLoading, data: companyData } = useQuery(
    FIND_EMPLOYEES_BY_COMPANY_ID,
    {
      variables: { id: companyId },
      fetchPolicy: "cache-and-network",
      onError: (err) => message.error(err.message),
    }
  );

  const companyTitle = companyData?.findCompanyById.tradingName ?? '...';
  const dataSource = companyData?.findCompanyById.employees
    .map((employee) => ({ ...employee, cpf: formatCPF(employee.cpf) }))
  ?? [];

  return (
    <>
      <Row align="middle" gutter={[0, 24]}>
        <Col>
          <PageTitle>Empresa {companyTitle}</PageTitle>
        </Col>
        <Col span={24}>
          <Employees
            loading={companyLoading}
            pagination={{ pageSize: 6 }}
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataSource}
          />
        </Col>
      </Row>
    </>
  );
};

export default CompanyPage;
