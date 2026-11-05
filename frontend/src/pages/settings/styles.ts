import styled from "styled-components";
import { UserRound } from "lucide-react";
import { alpha, media } from "@/styles/theme";
import { Form as BaseForm } from "@/styles/layout";

export const Root = styled.div`
  margin: 0 auto;
  max-width: 672px;
`;

export const BackButton = styled.button`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mutedForeground};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h1`
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const Description = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Section = styled.section`
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.8)};
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;

  ${media.sm} {
    padding: 24px;
  }
`;

export const SubscriptionSection = styled(Section)`
  margin-bottom: 20px;
`;

export const SectionHeaderRow = styled.div<{ $mb?: number }>`
  margin-bottom: ${({ $mb = 20 }) => $mb}px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SectionHeading = styled.h2`
  margin: 0;
  font-weight: 800;
`;

export const SubscriptionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${media.sm} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const PlanName = styled.p`
  margin: 0;
  font-weight: 700;
`;

export const PlanStatus = styled.p`
  margin: 2px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Form = styled(BaseForm)`
  gap: 20px;
`;

export const AvatarRow = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AvatarWrap = styled.div`
  position: relative;
  height: 80px;
  width: 80px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  background: ${({ theme }) => theme.colors.muted};
`;

export const AvatarImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled(UserRound)`
  margin: 24px;
  height: 32px;
  width: 32px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CameraOverlay = styled.label`
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => alpha(theme.colors.primary, 0.85)};
  padding: 6px 0;
  color: #fff;
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
`;

export const AvatarHint = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const FieldsGrid = styled.div`
  display: grid;
  gap: 16px;

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FieldLabel = styled.label`
  display: grid;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
`;

export const PasswordHint = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
