import { cloudinaryUrl } from '@/lib/cloudinary-loader';

describe('cloudinaryUrl', () => {
  it('generates URL with default quality', () => {
    const url = cloudinaryUrl('bestapp/logos/test');
    expect(url).toContain('/f_auto,q_auto');
    expect(url).toContain('/bestapp/logos/test');
  });

  it('includes width parameter', () => {
    const url = cloudinaryUrl('bestapp/logos/test', { width: 400 });
    expect(url).toContain('w_400');
  });

  it('includes height parameter', () => {
    const url = cloudinaryUrl('bestapp/logos/test', { height: 300 });
    expect(url).toContain('h_300');
  });

  it('respects custom quality', () => {
    const url = cloudinaryUrl('bestapp/logos/test', { quality: 80 });
    expect(url).toContain('q_80');
  });
});
