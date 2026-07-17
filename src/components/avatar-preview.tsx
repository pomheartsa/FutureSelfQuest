"use client";

import { cx, getJobImage, type AvatarConfig } from "@/lib/app-core";

export function AvatarPreview({
  avatarConfig,
  className,
  altText = "ตัวละครผู้เล่น"
}: {
  avatarConfig: AvatarConfig;
  className?: string;
  altText?: string;
}) {
  const imageSrc = getJobImage(avatarConfig);

  return (
    <img
      src={imageSrc}
      alt={altText}
      className={cx(
        "h-full w-auto object-contain drop-shadow-[0_22px_24px_rgba(54,74,102,0.22)]",
        className
      )}
    />
  );
}
