declare module "react-icons/fi" {
  import * as React from "react";

  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
  }

  export type IconType = (props: IconBaseProps) => React.ReactElement;

  export const FiMap: IconType;
  export const FiList: IconType;
  export const FiSearch: IconType;
  export const FiFilter: IconType;
  export const FiMapPin: IconType;
  export const FiRefreshCw: IconType;
  export const FiAlertTriangle: IconType;
  export const FiLoader: IconType;
  export const FiCalendar: IconType;
  export const FiClock: IconType;
  export const FiUsers: IconType;
  export const FiExternalLink: IconType;
  export const FiTag: IconType;
  export const FiX: IconType;
  export const FiInfo: IconType;
  export const FiDollarSign: IconType;
  export const FiMoreHorizontal: IconType;
  export const FiArrowLeft: IconType;
  export const FiShield: IconType;
  export const FiMusic: IconType;
  export const FiPlus: IconType;
  export const FiEdit2: IconType;
  export const FiUserX: IconType;
  export const FiTrash2: IconType;
  export const FiChevronLeft: IconType;
  export const FiChevronRight: IconType;
  export const FiToggleRight: IconType;
  export const FiToggleLeft: IconType;
}