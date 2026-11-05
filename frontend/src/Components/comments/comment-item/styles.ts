import styled from "styled-components";
import { Input as BaseInput } from "@/styles/inputs";

export const SmallInput = styled(BaseInput)`
  height: 32px;
`;

export const Wrap = styled.div<{ $level: number }>`
  margin-left: ${({ $level }) => Math.min($level, 2) * 20}px;
  margin-top: 12px;
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const Avatar = styled.img`
  height: 32px;
  width: 32px;
  border-radius: ${({ theme }) => theme.radius.full};
  object-fit: cover;
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex: 1;
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

export const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

export const Username = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const TimeAgo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
`;

export const EditRow = styled.div`
  margin-top: 4px;
  display: flex;
  gap: 8px;
`;

export const ActionsRow = styled.div`
  margin-top: 4px;
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const ActionLink = styled.button<{ $danger?: boolean }>`
  color: ${({ $danger }) => ($danger ? "#ef4444" : "inherit")};

  &:hover {
    color: ${({ $danger }) => ($danger ? "#b91c1c" : "#047857")};
  }
`;

export const ReplyRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;
