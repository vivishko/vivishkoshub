"use client";

type FavoriteButtonProps = {
  isFavorite: boolean;
  label: string;
  onToggle: () => void;
};

export default function FavoriteButton({ isFavorite, label, onToggle }: FavoriteButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={isFavorite}
      className={`asmr-favorite-button${isFavorite ? " is-active" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
      title={label}
      type="button"
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}
