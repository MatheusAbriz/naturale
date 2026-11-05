import styled from "styled-components";
import { Form } from "@/styles/layout";

export const Page = styled.div`
  display: flex;
  height: calc(100vh - 8rem);
  flex-direction: column;
`;

export const HeaderRow = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const ExpandedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.secondary};
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const LimitBadge = styled.span`
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.muted};
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const WelcomeTitle = styled.p`
  margin: 0;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const WelcomeText = styled.p`
  margin: 0;
  font-size: 14px;
`;

export const MessageRow = styled.div<{ $own: boolean }>`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${({ $own }) => ($own ? "flex-end" : "flex-start")};
`;

export const Bubble = styled.div<{ $own: boolean }>`
  max-width: 75%;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 8px 12px;
  font-size: 14px;
  background: ${({ theme, $own }) => ($own ? theme.colors.primary : theme.colors.muted)};
  color: ${({ theme, $own }) => ($own ? theme.colors.primaryForeground : "inherit")};
`;

export const ComposerForm = styled(Form)`
  flex-direction: row;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 12px;
`;
