import type { ReactNode } from "react";
import { Leaf } from "lucide-react";
import {
  Root,
  Main,
  Inner,
  LogoLink,
  LogoIcon,
  Eyebrow,
  Title,
  Description,
  ChildrenWrap,
  Aside,
  HeroImage,
  HeroOverlay,
} from "./styles";

type AuthLayoutProps = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthLayout({ image, imageAlt, eyebrow, title, description, children }: AuthLayoutProps) {
  return (
    <Root>
      <Main>
        <Inner>
          <LogoLink to="/login">
            <LogoIcon><Leaf size={16} /></LogoIcon>
            naturale
          </LogoLink>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <ChildrenWrap>{children}</ChildrenWrap>
        </Inner>
      </Main>
      <Aside>
        <HeroImage src={image} alt={imageAlt} />
        <HeroOverlay />
      </Aside>
    </Root>
  );
}
