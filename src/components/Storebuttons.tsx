import { AppStoreButton } from "@/components/AppStoreButton";
import { PlayStoreButton } from "@/components/PlayStoreButton";

type Props = {
  className?: string;
  size?: "md" | "lg";
  buttonClassName?: string;
};

/** Both store buttons side by side. Use this in the Navbar, StoreIntro and Footer. */
export function StoreButtons({
  className = "",
  size = "md",
  buttonClassName = "",
}: Props) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <AppStoreButton size={size} className={buttonClassName} />
      <PlayStoreButton size={size} className={buttonClassName} />
    </div>
  );
}