declare module "react-icons/fa" {
  import * as React from "react";
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
  }
  export type IconType = (props: IconBaseProps) => React.ReactElement;
  export const FaHeart: IconType;
  export const FaRegHeart: IconType;
}