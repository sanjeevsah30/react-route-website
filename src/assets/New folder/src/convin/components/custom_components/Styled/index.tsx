import { Avatar, styled } from "@mui/material";

export const StyledAvatar = styled(Avatar)`
    ${({ theme }) => `
  cursor: pointer;
  transition: ${theme.transitions.create(["transform"], {
      duration: 100,
  })};
  &:hover {
    transform: translateY(-3px);
  }
  `}
`;
