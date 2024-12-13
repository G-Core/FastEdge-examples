import styled from "styled-components";

const SideBar = styled.div`
  width: 33%;
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.sideBar.background};
  padding: 4rem;

  @media (min-width: 1200px) {
    width: 25%;
  }

  @media (max-width: 980px) {
    padding: 1.5rem;
  }

  @media (max-width: 800px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    flex-basis: unset;
    padding: 2rem;
    position: unset;
    height: unset;
    width: 100%;
    margin: unset;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  width: 67%;
  flex: 1;
  margin-left: 33%;
  padding: 4rem;
  background: ${({ theme }) => theme.mainContent.background};

  @media (min-width: 1200px) {
    margin-left: 25%;
    padding: 4rem 8rem;
    width: 75%;
  }

  @media (max-width: 980px) {
    padding: 2rem;
  }

  @media (max-width: 800px) {
    padding: 1rem;
  }

  @media (max-width: 600px) {
    width: unset;
    flex: unset;
    padding: 2rem;
    background: #f6f6f8;
    margin: unset;
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
  }
`;

const SectionHeading = styled.h2`
  margin: 3rem 0;
`;

export { Container, MainContent, SectionHeading, SideBar };
