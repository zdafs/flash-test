import { Row, Col } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Menu as OriginalMenuIcon } from "../assets/icons/menu";
import { Menu } from './menu';

export const HeaderWrapper = styled(Row)`
  && {
    background: ${(props) => props.theme.palette.primary.dark};
    height: 190px;
    padding: 16px;
  }
`;
export const MenuIcon = styled(OriginalMenuIcon)`
  && {
    :hover {
      cursor: pointer;
    }
  }
`;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <HeaderWrapper>
      <Col>
        <MenuIcon onClick={toggleMenu} />
        <Menu isOpen={isMenuOpen} />
      </Col>
    </HeaderWrapper>
  )
};
