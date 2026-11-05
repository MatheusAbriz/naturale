import { Wrap, Spinner } from "./styles";

type LoaderProps = {
  size?: "sm" | "md";
  padY?: number;
};

const DIMENSIONS = {
  sm: { size: 20, border: 2, padY: 16 },
  md: { size: 32, border: 4, padY: 32 },
};

export function Loader({ size = "md", padY }: LoaderProps) {
  const { size: s, border, padY: defaultPadY } = DIMENSIONS[size];
  return (
    <Wrap $padY={padY ?? defaultPadY}>
      <Spinner $size={s} $border={border} />
    </Wrap>
  );
}
