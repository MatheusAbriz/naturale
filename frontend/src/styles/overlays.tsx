// Primitivos de overlay (Dialog, DropdownMenu): o comportamento/acessibilidade
// continua vindo do Radix (foco, portal, fechar no ESC/clique fora), só a
// aparência é estilizada aqui em vez de classes Tailwind.
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import styled, { keyframes } from "styled-components";
import { XIcon } from "lucide-react";
import { alpha } from "./theme";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const zoomIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const zoomOut = keyframes`
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
`;

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const DialogOverlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: ${({ theme }) => alpha(theme.colors.black, 0.5)};
  animation: ${fadeIn} 0.2s ease;

  &[data-state="closed"] {
    animation: ${fadeOut} 0.2s ease;
  }
`;

const StyledDialogContent = styled(DialogPrimitive.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  display: grid;
  gap: 16px;
  width: calc(100% - 2rem);
  max-width: 32rem;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.dialog};
  animation: ${zoomIn} 0.2s ease;
  outline: none;

  &[data-state="closed"] {
    animation: ${zoomOut} 0.2s ease;
  }
`;

const DialogCloseButton = styled(DialogPrimitive.Close)`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.foreground};
  border-radius: 2px;

  &:hover {
    opacity: 1;
  }
`;

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};

export function DialogContent({ children, showCloseButton = true, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <StyledDialogContent {...props}>
        {children}
        {showCloseButton && (
          <DialogCloseButton aria-label="Fechar">
            <XIcon size={16} />
          </DialogCloseButton>
        )}
      </StyledDialogContent>
    </DialogPrimitive.Portal>
  );
}

export const DialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

export const DialogFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

export const DialogTitle = styled(DialogPrimitive.Title)`
  margin: 0;
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
`;

export const DialogDescription = styled(DialogPrimitive.Description)`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

// --- Dropdown menu -----------------------------------------------------

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const dropdownFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const StyledDropdownContent = styled(DropdownMenuPrimitive.Content)`
  z-index: 50;
  min-width: 8rem;
  max-height: var(--radix-dropdown-menu-content-available-height);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4px;
  background: ${({ theme }) => theme.colors.popover};
  color: ${({ theme }) => theme.colors.popoverForeground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.dropdown};
  animation: ${dropdownFadeIn} 0.12s ease;
`;

export function DropdownMenuContent(props: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <StyledDropdownContent sideOffset={4} {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

export const DropdownMenuItem = styled(DropdownMenuPrimitive.Item)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  outline: none;
  user-select: none;
  cursor: default;

  &[data-highlighted] {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentForeground};
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  svg {
    pointer-events: none;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;
