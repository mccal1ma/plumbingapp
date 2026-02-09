import styled from 'styled-components'

const Wrapper = styled.article`
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--borderRadius);
  border: 1px solid var(--grey-200);
  border-left: 5px solid ${(props) => props.color};
  box-shadow: var(--shadow-2);
  transition: var(--transition);
  
  &:hover {
    box-shadow: var(--shadow-3);
    transform: translateY(-2px);
  }
  
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .count {
    display: block;
    font-weight: 700;
    font-size: 50px;
    color: ${(props) => props.color};
    line-height: 1;
  }
  .title {
    margin: 0;
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: left;
    margin-top: 0.5rem;
    font-size: 1rem;
    color: var(--grey-700);
  }
  .icon {
    width: 70px;
    height: 60px;
    background: ${(props) => props.bcg};
    border-radius: var(--borderRadius);
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 2rem;
      color: ${(props) => props.color};
    }
  }
`

export default Wrapper
