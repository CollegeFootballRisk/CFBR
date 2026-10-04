import { cn } from "@/shared/utils/cn";

interface StarIconProps {
  className?: string;
}

export default function StarIcon({ className }: StarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="392 331 282 268"
      fill="currentColor"
      role="img"
      aria-label="Star"
      className={cn("inline-block size-10", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M568.3,430.5L535.4,337.7L533,331L497.7,430.5L502,432L533,344.5L533,479L568.3,430.5ZM568.3,430.5L568.1,435L661,437.4L533,479L590.1,497.5L673.8,433.3L568.3,430.5ZM392.2,433.3L475.9,497.5L478.7,494L405.1,437.4L533,479L497.7,430.5L399.4,433.1L392.2,433.3ZM533,539L530.5,535.3L453.9,587.8L533,479L475.9,497.5L446,598.7L533,539ZM614.1,594.7L620,598.7L590.1,497.5L585.8,498.8L612.1,587.8L533,479L533,539L614.1,594.7Z"
      />
    </svg>
  );
}
