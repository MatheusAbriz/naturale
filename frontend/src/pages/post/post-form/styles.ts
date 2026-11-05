import styled from "styled-components";
import { alpha } from "@/styles/theme";
import { Form as BaseForm } from "@/styles/layout";

export const BackButton = styled.button`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Header = styled.div`
  margin-bottom: 20px;
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h1`
  margin: 4px 0 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const Form = styled(BaseForm)``;

export const ImagePicker = styled.label`
  position: relative;
  display: flex;
  height: 224px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px dashed ${({ theme }) => alpha(theme.colors.primary, 0.35)};
  background: ${({ theme }) => theme.colors.muted};
`;

export const PreviewImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const ImageBadge = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.white};
  padding: 10px;
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
