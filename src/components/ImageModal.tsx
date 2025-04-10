export default function ImageModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative">
        <img src={imageUrl} className="max-h-[80vh] max-w-[90vw]" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-3xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
