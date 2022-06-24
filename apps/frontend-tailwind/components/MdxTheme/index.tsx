import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import Link from 'next/link';
import { FC } from 'react';
const Image: FC<JSX.IntrinsicElements['img']> = ({ alt, src, className }) => {
  return (
    <a target="_blank" rel="noreferrer" href={src} className={className}>
      {alt}
    </a>
  );
};
const A: FC<JSX.IntrinsicElements['a']> = ({ children, ...props }) => {
  const isExternal = props.href && props.href.startsWith('https://');
  if (isExternal) {
    return (
      <a target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return props.href ? (
    <Link href={props.href}>
      <a {...props}>{children}</a>
    </Link>
  ) : (
    <></>
  );
};
export const MDXTheme: FC<MDXRemoteProps> = ({ ...props }) => {
  return <MDXRemote components={{ a: A, img: Image }} {...props} />;
};
