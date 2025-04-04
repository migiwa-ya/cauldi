import { useState } from "react";

type ImageModalProps = {
  imageUrl: string; // 画像URLを props で受け取る
  altText?: string; // オプション: 画像の alt テキスト
  className?: string;
};

export default function ImageModal({
  imageUrl,
  altText = "画像",
  className = "",
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* サムネイル画像 */}
      <img
        src={imageUrl}
        alt={altText}
        className={className}
        onClick={openModal}
      />

      {/* モーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-30"
          onClick={closeModal}
        >
          <div className="relative">
            <img src={imageUrl} />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-3xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
