import styled from "styled-components";

export const Overlay = styled.div<{ top: string; left: string }>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  padding: 0;
  margin: 0;

  & input[type="checkbox"] {
    margin: 0;
    --checkbox-dimension: 20px;
    transform: translateX(-var(--checkbox-dimension)) translateY(-var(--checkbox-dimension));
    width: var(--checkbox-dimension);
    height: var(--checkbox-dimension);
  }
`;

export const ControlContainer = styled.div<{ show: boolean }>`
  /* border: 1px solid black; */
  border-radius: 8px;
  display: ${(p) => (p.show ? "flex" : "none")};
  flex-direction: column;
  padding: 30px;
	backdrop-filter: blur(20px);
	box-shadow: 0 0 10px 0 black;
`;