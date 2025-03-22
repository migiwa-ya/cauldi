import React from 'react';

interface Image {
  url: string;
  caption: string;
}

interface HerbImagesProps {
  images: Image[];
}

const HerbImages: React.FC<HerbImagesProps> = ({ images }) => {
  return (
    <div className="herb-images">
      {images.map((image, index) => (
        <figure key={index}>
          <img src={image.url} alt={image.caption} />
          <figcaption>{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
};

export default HerbImages;
