import styled from "styled-components";
import { alpha, media } from "./theme";

export const Input = styled.input`
  display: block;
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.input};
  background: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  outline: none;
  transition: color 0.15s ease, box-shadow 0.15s ease;

  ${media.md} {
    font-size: 14px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.ring};
    box-shadow: 0 0 0 3px ${({ theme }) => alpha(theme.colors.ring, 0.5)};
  }

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Textarea = styled.textarea<{ $minHeight?: number }>`
  display: block;
  width: 100%;
  min-height: ${({ $minHeight = 64 }) => $minHeight}px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.input};
  background: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.foreground};
  outline: none;
  resize: vertical;
  transition: color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.ring};
    box-shadow: 0 0 0 3px ${({ theme }) => alpha(theme.colors.ring, 0.5)};
  }
`;

export const Select = styled.select`
  display: block;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.input};
  background: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.foreground};
  outline: none;

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.ring};
    box-shadow: 0 0 0 3px ${({ theme }) => alpha(theme.colors.ring, 0.5)};
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
  user-select: none;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
