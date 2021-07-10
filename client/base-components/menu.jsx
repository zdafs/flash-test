import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu as MenuAntd } from "antd";
import styled from "styled-components";

const StyledMenu = styled(MenuAntd)`
  position: relative;
  z-index: 1;
`;

const keyToRoute = {
  'companies': '/companies',
  'create-company': '/create-company',
  'create-employee': '/create-employee',
};

export const Menu = ({ isOpen }) => {
  const history = useHistory();
  const [selectedKey, setSelectedKey] = useState('companies');

  const onMenuClick = (event) => {
    setSelectedKey(event.key);
    history.push(keyToRoute[event.key]);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <StyledMenu onClick={onMenuClick} mode="inline" selectedKeys={[selectedKey]}>
      <StyledMenu.Item key="companies">Empresas</StyledMenu.Item>
      <StyledMenu.Item key="create-company">Criar empresa</StyledMenu.Item>
      <StyledMenu.Item key="create-employee">Criar funcionário</StyledMenu.Item>
    </StyledMenu>
  );
};