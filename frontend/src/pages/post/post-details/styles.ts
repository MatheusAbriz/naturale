import styled from "styled-components";
import { Link } from "react-router-dom";

export const BackButton = styled.button`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CoverImage = styled.img`
  margin-bottom: 16px;
  height: 320px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
  object-fit: cover;
`;

export const TitleRow = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const PostTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
`;

export const OwnerActions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 8px;
`;

export const AuthorLink = styled(Link)`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Avatar = styled.img`
  height: 32px;
  width: 32px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  object-fit: cover;
`;

export const AuthorName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

export const AuthorUsername = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const TimeRow = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const EngagementRow = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 0;
`;

export const EngagementGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const EngagementButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 4px;
  font-weight: 600;
`;

export const SectionText = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
`;

export const IngredientsList = styled.ul`
  margin: 0 0 16px;
  padding-left: 20px;
  font-size: 14px;
  list-style: disc;
`;
