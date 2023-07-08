import sharp from 'sharp';

export function resizePhoto(photo: Buffer): Promise<Buffer> {
  return sharp(photo.buffer)
    .resize(300, 180, {
      fit: 'contain',
    })
    .toBuffer();
}
