import type { FC } from "react";
type Props = JSX.IntrinsicElements["img"];
const MdImage: FC<Props> = ({ alt, src, className }) => {
  return (
    <a href={src} className={className}>
      {alt}
    </a>
  );
};
export default MdImage;
