import { Link } from "react-router-dom";

export default function NirmalaLogo({ className = "h-16 w-16" }) {
  return (
   <Link
  to="/"
  className="flex items-center"
  onClick={() => setOpen(false)}
>
  <svg
    viewBox="0 0 320 320"
    className="h-16 w-16"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Nirmala Multi Trading Company"
  >
    {/* Outer circle */}
    <circle
      cx="160"
      cy="160"
      r="150"
      fill="white"
      stroke="black"
      strokeWidth="8"
    />

    {/* Inner circle */}
    <circle
      cx="160"
      cy="160"
      r="125"
      fill="white"
      stroke="black"
      strokeWidth="6"
    />

    {/* Globe */}
    <circle
      cx="160"
      cy="160"
      r="85"
      fill="white"
      stroke="black"
      strokeWidth="4"
    />

    {/* Globe vertical lines */}
    <ellipse
      cx="160"
      cy="160"
      rx="40"
      ry="85"
      fill="none"
      stroke="black"
      strokeWidth="3"
    />

    <ellipse
      cx="160"
      cy="160"
      rx="70"
      ry="85"
      fill="none"
      stroke="black"
      strokeWidth="2"
    />

    {/* Globe horizontal lines */}
    <ellipse
      cx="160"
      cy="160"
      rx="85"
      ry="30"
      fill="none"
      stroke="black"
      strokeWidth="3"
    />

    <ellipse
      cx="160"
      cy="160"
      rx="85"
      ry="55"
      fill="none"
      stroke="black"
      strokeWidth="2"
    />

    {/* Simple world land shapes */}
    <path
      d="M105 105
         C95 95 90 110 98 120
         L115 128
         L120 145
         L135 150
         L142 135
         L132 120
         L120 112 Z"
      fill="black"
    />

    <path
      d="M145 150
         L165 145
         L178 155
         L170 170
         L155 175
         L145 165 Z"
      fill="black"
    />

    <path
      d="M185 110
         L205 105
         L220 120
         L210 135
         L195 130
         L188 120 Z"
      fill="black"
    />

    <path
      d="M150 180
         L170 185
         L178 205
         L168 225
         L155 215
         L150 195 Z"
      fill="black"
    />

    {/* Company name */}
    <text
      x="160"
      y="55"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="25"
      fontWeight="800"
      letterSpacing="4"
      fill="black"
    >
      NIRMALA
    </text>

    {/* Year */}
    <text
      x="45"
      y="165"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="22"
      fontWeight="700"
      fill="black"
    >
      20
    </text>

    <text
      x="275"
      y="165"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="22"
      fontWeight="700"
      fill="black"
    >
      26
    </text>

    {/* Bottom text */}
    <text
      x="160"
      y="275"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="13"
      fontWeight="700"
      letterSpacing="2"
      fill="black"
    >
      MULTI TRADING COMPANY
    </text>
  </svg>
</Link>
  );
}