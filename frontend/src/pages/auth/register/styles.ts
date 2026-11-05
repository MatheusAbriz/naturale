import styled from "styled-components";
import { Form, Column } from "@/styles/layout";

export { Form, Column };

export const AvatarPicker = styled.label`
  cursor: pointer;
`;

export const AvatarCircle = styled.div`
  height: 80px;
  width: 80px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.muted};
`;

export const AvatarImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.span`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
