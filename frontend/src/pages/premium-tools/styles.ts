import styled from "styled-components";

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h1`
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 800;
`;

export const Description = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Section = styled.section`
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
`;

export const SearchSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldLabel = styled.label`
  display: grid;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
`;

export const RawInput = styled.input`
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.input};
  padding: 0 12px;
  font-weight: 400;
  outline: none;
`;

export const RawSelect = styled.select`
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.input};
  background: ${({ theme }) => theme.colors.white};
  padding: 0 12px;
  font-weight: 400;
  outline: none;
`;

export const FieldsGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const SectionTitle = styled.h2`
  margin: 12px 0 0;
  font-weight: 800;
`;

export const SectionText = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
