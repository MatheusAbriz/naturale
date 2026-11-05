import styled, { css } from "styled-components";
import { alpha } from "./theme";

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  default: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: ${({ theme }) => alpha(theme.colors.primary, 0.9)};
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }
  `,
  destructive: css`
    background: ${({ theme }) => theme.colors.destructive};
    color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: ${({ theme }) => alpha(theme.colors.destructive, 0.9)};
    }
  `,
  outline: css`
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.secondaryForeground};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondaryForeground};
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: ${({ theme }) => alpha(theme.colors.secondary, 0.8)};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.foreground};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.secondaryForeground};
    }
  `,
  link: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    text-underline-offset: 4px;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  default: css`
    height: 40px;
    padding: 0 16px;
    border-radius: ${({ theme }) => theme.radius.xl};

    &:has(> svg) {
      padding: 0 12px;
    }
  `,
  sm: css`
    height: 32px;
    padding: 0 12px;
    gap: 6px;
    border-radius: ${({ theme }) => theme.radius.lg};

    &:has(> svg) {
      padding: 0 10px;
    }
  `,
  lg: css`
    height: 44px;
    padding: 0 24px;
    border-radius: ${({ theme }) => theme.radius.xl};

    &:has(> svg) {
      padding: 0 16px;
    }
  `,
  icon: css`
    height: 36px;
    width: 36px;
    padding: 0;
    border-radius: ${({ theme }) => theme.radius.xl};
  `,
};

export const Button = styled.button<{
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  outline: none;
  flex-shrink: 0;

  ${({ $variant = "default" }) => variantStyles[$variant]}
  ${({ $size = "default" }) => sizeStyles[$size]}

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  svg {
    pointer-events: none;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;
