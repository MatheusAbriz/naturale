import styled from "styled-components";
import { Upload, Clock, ChefHat } from "lucide-react";
import { theme } from "../../assets/css/variaveis";

export const StyledCard = styled.div`
  background-color: ${theme.corBranco};
  border: 1px solid ${theme.corFundoBotao};
  border-radius: 8px;
  overflow: hidden;
  max-width: 800px;
  margin: 5rem auto;
`;

export const StyledCardHeader = styled.div`
  background-color: ${theme.corFundo};
  color: ${theme.corBranco};
  padding: ${theme.espacamentoPadrao};
`;

export const StyledCardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
`;

export const StyledCardContent = styled.div`
  padding: ${theme.espacamentoPadrao};
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledLabel = styled.label`
  color: ${theme.corPreto};
  font-weight: 500;
  font-size: 0.875rem;
`;

export const LabelWithIcon = styled(StyledLabel)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const inputBaseStyles = `
  width: 100%;
  border: 1px solid \${theme.corFundoBotao};
  background: \${theme.corBranco};
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: \${theme.corPreto};
  transition: \${theme.animacaoOutlineInput || 'all 0.2s'};

  &::placeholder {
    color: \${theme.corPreto}80;
  }

  &:focus {
    outline: none;
    border-color: \${theme.corFundo};
  }
`;

export const StyledInput = styled.input`
  ${inputBaseStyles}
`;

export const StyledTextarea = styled.textarea`
  ${inputBaseStyles}
  resize: none;
`;

export const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
`;

export const StyledButton = styled.button`
  width: 100%;
  background-color: ${theme.corFundo};
  color: ${theme.corBranco};
  font-weight: 600;
  padding: 1.5rem 0;
  font-size: 1.125rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: ${theme.animacaoBotao || "all 0.5s ease-in-out"};

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    opacity: 0.8;
  }
`;

export const FileInput = styled.input.attrs({ type: "file" })`
  ${inputBaseStyles}
  cursor: pointer;

  &::file-selector-button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: 0;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: ${theme.corFundo};
    color: ${theme.corBranco};
    transition: all 0.3s;
    cursor: pointer;
  }

  &:hover::file-selector-button {
    opacity: 0.9;
  }
`;

export const ImagePreviewContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${theme.corFundoBotao};
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 16rem;
  object-fit: cover;
`;

export const UploadPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12rem;
  border: 2px dashed ${theme.corFundoBotao};
  border-radius: 8px;
  background-color: ${theme.corFundoBotao};
  text-align: center;
`;

export const UploadPlaceholderText = styled.p`
  font-size: 0.875rem;
  color: ${theme.corPreto};
`;

export const StyledChefHat = styled(ChefHat)`
  width: 1.5rem;
  height: 1.5rem;
`;

export const StyledClock = styled(Clock)`
  width: 1rem;
  height: 1rem;
`;

export const StyledUploadIcon = styled(Upload)`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.5rem auto;
  color: ${theme.corPreto};
`;
