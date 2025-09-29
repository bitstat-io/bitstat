"use client";

import * as React from "react";
import type { IconProps } from "@tabler/icons-react";

export const IconLogo = React.forwardRef<SVGSVGElement, IconProps>(
  (
    { size = 24, stroke = 2, color = "currentColor", className, ...props },
    ref
  ) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 197.99 252.11"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke=""
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g data-name="Layer_1">
        <g>
          <rect fill={color} x="19.89" width="42.33" height="43.29" />
          <path
            fill={color}
            d="M176.89,121.13c-.22-42.96-35.35-77.84-78.49-77.84h-36.18v42.19h36.18c19.94,0,36.17,16.17,36.17,36.06s-16.23,36.06-36.17,36.06-36.18-16.18-36.18-36.06v-36.06H19.89v36.06c0,43.15,35.22,78.25,78.51,78.25s78.27-34.88,78.49-77.84v-.82Z"
          />
        </g>
      </g>
    </svg>
  )
);
IconLogo.displayName = "IconLogo";
