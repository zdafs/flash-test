import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Input, Select, Divider, Row, Col, message } from "antd";
import { Body } from "./create-employee.styles";
import { Button } from "../../base-components/button";
import { PageTitle } from "../../base-components/page-title";
import { CREATE_EMPLOYEE } from "../../graphql/mutations";
import { GET_ALL_COMPANIES } from "../../graphql/queries";
import { BENEFITS } from "../../graphql/constants";

const benefitValueToLabel = {
  [BENEFITS.VR]: 'VR',
  [BENEFITS.VT]: 'VT',
  [BENEFITS.GYM_PASS]: 'GymPass',
};

export const CreateEmployeePage = () => {
  const [form] = Form.useForm();

  const { loading: companiesLoading, data: companiesData } = useQuery(
    GET_ALL_COMPANIES,
    {
      onError: (err) => message.error(err.message),
    }
  );
  const [createEmployee, { loading: creating }] = useMutation(CREATE_EMPLOYEE);
  const [availableBenefits, setAvailableBenefits] = useState([]);

  const handleSubmit = async (values) => {
    try {
      await createEmployee({ variables: values });
      form.resetFields();
      message.success("Funcionário criado com sucesso!");
    } catch (err) {
      message.error(err.message);
    }
  };

  if (companiesLoading) {
    return 'Loading...';
  }

  const companies = companiesData?.getAllCompanies
    .map((company) => ({ label: company.tradingName, value: company.id }))
  ?? [];

  const companiesIdToBenefits = companiesData?.getAllCompanies
    .reduce((idToBenefitMap, company) => idToBenefitMap.set(company.id, company.chosenBenefits), new Map())
  ?? new Map();

  const handleCompanyChange = (values) => {
    const newAvalilableBenefits = values
      .reduce((accBenefits, value) => [...new Set([...accBenefits, ...companiesIdToBenefits.get(value)])], []);
    setAvailableBenefits(newAvalilableBenefits);
  };

  const benefits = availableBenefits
    .map((availableBenefit) => ({ label: benefitValueToLabel[availableBenefit], value: availableBenefit }));

  return (
    <>
      <Row justify="flex-start" align="middle" gutter={[0, 24]}>
        <Col>
          <PageTitle>Novo funcionário</PageTitle>
        </Col>
        <Col span={24}>
          <Body>
            <Row justify="flex-start">
              <Col xs={24} sm={18} md={18} lg={12} xl={12}>
                <Form onFinish={handleSubmit} form={form} layout="vertical">
                  <Form.Item
                    label="Nome"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Campo obrigatório",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Telefone"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Campo obrigatório",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="CPF"
                    name="cpf"
                    rules={[
                      {
                        required: true,
                        message: "Campo obrigatório",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Endereço"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Campo obrigatório",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Empresas"
                    name="companies"
                    rules={[
                      {
                        required: true,
                        message: "Campo obrigatório",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Selecionar"
                      options={companies}
                      onChange={handleCompanyChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Benefícios"
                    name="givenBenefits"
                    rules={[
                      {
                        required: true,
                        message: "Campo obrigatório",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Selecionar"
                      options={benefits}
                    />
                  </Form.Item>
                  <Divider />
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      color="secondary"
                      loading={creating}
                    >
                      Criar funcionário
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Body>
        </Col>
      </Row>
    </>
  );
};
