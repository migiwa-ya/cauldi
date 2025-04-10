import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ImageModal from "./ImageModal";

export default function ModalActivator() {
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLImageElement;
      if (
        target?.tagName === "IMG" &&
        target.dataset.modal === "true" &&
        target.dataset.img
      ) {
        setModalImg(target.dataset.img);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  if (!modalImg) return null;

  return modalImg ? (
    <ImageModal imageUrl={modalImg} onClose={() => setModalImg(null)} />
  ) : null;
}
