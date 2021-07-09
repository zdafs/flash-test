import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Companies } from "./companies.styles";
import { Button } from "../../base-components/button";
import { PageTitle } from "../../base-components/page-title";
import { Row, Col, message } from "antd";
import { GET_ALL_COMPANIES } from "../../graphql/queries";
import { formatCNPJ } from "../../common";

const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => b.name.localeCompare(a.name),
    sortDirections: ["ascend", "descend", "ascend"],
  },
  {
    title: "Nome fantasia",
    dataIndex: "tradingName",
    key: "tradingName",
  },
  {
    title: "CNPJ",
    dataIndex: "cnpj",
    key: "cnpj",
  },
  {
    title: "Endereço",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Benefícios",
    dataIndex: "chosenBenefits",
    key: "chosenBenefits",
    render: (benefits) => <>{benefits.join(", ")}</>,
  },
];

export const CompaniesPage = () => {
  const history = useHistory();

  const { loading: companiesLoading, data: companiesData } = useQuery(
    GET_ALL_COMPANIES,
    {
      fetchPolicy: "cache-and-network", // [BUG] never calls the server
      onError: (err) => message.error(err.message),
    }
  );

  const handleRowClick = (record) => (_event) => {
    history.push(`/companies/${record.id}`);
  };

  const handleRow = (record) => {
    return {
      onClick: handleRowClick(record),
    };
  };

  const handleCreateCompany = (_event) => {
    history.push(`/create-company`);
  };

  const dataSource = companiesData?.getAllCompanies
    .map((companyData) => ({ ...companyData, cnpj: formatCNPJ(companyData.cnpj) }))
  ?? [];

  return (
    <>
      <Row align="middle" gutter={[0, 24]}>
        <Col>
          <PageTitle>Empresas</PageTitle>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleCreateCompany} // [BUG] onCLick
            color="secondary"
          >
            Criar empresa
          </Button>
        </Col>
        <Col span={24}>
          <Companies
            loading={companiesLoading}
            pagination={{ pageSize: 6 }}
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataSource}
            onRow={handleRow}
          />
        </Col>
      </Row>
    </>
  );
};
