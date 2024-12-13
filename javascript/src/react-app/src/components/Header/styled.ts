import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const ControlWrapper = styled.div`
  display: flex;
  position: absolute;

  span:nth-child(1) {
    margin-right: 1rem;
  }
`;

const Control = styled.span<{ active: boolean }>`
  font-family: "Poppins";
  font-weight: 500;
  width: 40px;
  height: 40px;
  background: ${({ active }) => (active ? "#1a1a1a" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#1a1a1a")};
  border-radius: 50%;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export { Container, Control, ControlWrapper };
