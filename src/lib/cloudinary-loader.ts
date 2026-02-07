import type { ImageLoaderProps } from 'next/image';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality || 'auto';
  // If src is already a full URL, return as-is (for external fallback)
  if (src.startsWith('http')) return src;
  // Construct Cloudinary URL from publicId
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${q},w_${width},c_limit/${src}`;
}

export function cloudinaryUrl(
  publicId: string,
  opts?: { width?: number; height?: number; quality?: number },
): string {
  const transforms = ['f_auto', `q_${opts?.quality || 'auto'}`];
  if (opts?.width) transforms.push(`w_${opts.width}`);
  if (opts?.height) transforms.push(`h_${opts.height}`);
  transforms.push('c_limit');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}
