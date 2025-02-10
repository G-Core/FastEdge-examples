import styled from "styled-components";

const Container = styled.div`
  position: relative;
`;

const InputWrapper = styled.div<{ cityError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  margin: 2rem 0;

  border-radius: 6px;
  border: ${({ cityError }) => (cityError ? "1px solid red" : "none")};

  i {
    position: absolute;
    left: 10px;
    color: #909090;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const InputCrossHairs = styled.span`
  width: 35px;
  position: absolute;
  right: 10px;
  height: 35px;
  border-radius: 50%;
  background: ${({ theme }) => theme.input.crossHairsBgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  i {
    position: relative;
    left: 0;
    font-size: 2rem;
    color: ${({ theme }) => theme.input.crossHairsColor};
  }
`;

const StyledInput = styled.input`
  padding: 1.3rem 4rem;
  font-size: 15px;
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.text};
  text-transform: capitalize;
  border-radius: 6px;
  width: 100%;
  outline: none;
  border: none;

  ::placeholder {
    font-weight: 500;
    font-family: "Poppins";
    color: ${({ theme }) => theme.input.placeholderColor};
  }
`;

const ErrorMsg = styled.span`
  color: red;
  font-size: 12px;
  bottom: -15px;
  right: 10px;
  position: absolute;
`;

export { Container, ErrorMsg, InputCrossHairs, InputWrapper, StyledInput };
