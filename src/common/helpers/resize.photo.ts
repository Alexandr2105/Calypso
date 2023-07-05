import sharp from 'sharp';

export const resizePhoto = (photo: Buffer) => {
  return sharp(photo.buffer)
    .resize(300, 180, {
      fit: 'contain',
    })
    .toBuffer();
};
