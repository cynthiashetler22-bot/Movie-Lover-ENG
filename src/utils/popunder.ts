/**
 * HilltopAds Popunder & Moviebaaz Download Gateway Utility
 * Verified HilltopAds Popunder Destination: https://splendid-garage.com/b.3_V/0/PY3wp/vFbCmhV/JeZbDM0_3/NlDUgyxIMRDeYgxwLgT/cu0IOxDrEdwXN/jJUK
 */

export const DEFAULT_HILLTOPADS_POPUNDER_URL = 
  'https://splendid-garage.com/b.3_V/0/PY3wp/vFbCmhV/JeZbDM0_3/NlDUgyxIMRDeYgxwLgT/cu0IOxDrEdwXN/jJUK';

/**
 * Safely triggers the HilltopAds popunder in a background/new window
 */
export function triggerPopunder(customUrl?: string) {
  try {
    // Never trigger in admin panel
    if (typeof window === 'undefined') return;
    const isCurrentAdmin = 
      window.location.pathname.includes('admin') || 
      window.location.hash.includes('admin') || 
      localStorage.getItem('streamora_admin_auth') === 'true';

    if (isCurrentAdmin) return;

    const url = customUrl || DEFAULT_HILLTOPADS_POPUNDER_URL;
    
    // Open in background window / tab
    const adWindow = window.open(url, '_blank');
    if (adWindow) {
      adWindow.blur();
      window.focus();
    }
  } catch (err) {
    console.debug('Popunder trigger handled:', err);
  }
}

/**
 * Resolves the genuine movie download destination configured by the admin
 */
export function getGenuineMovieDownloadUrl(
  film: {
    downloadLink480p?: string;
    downloadLink720p?: string;
    downloadLink1080p?: string;
    downloadLink4k?: string;
    masterVideoLink?: string;
  },
  quality: '480p' | '720p' | '1080p' | '4k',
  fallbackMasterUrl?: string
): string {
  let target = '';

  if (quality === '480p') {
    target = film.downloadLink480p || '';
  } else if (quality === '720p') {
    target = film.downloadLink720p || '';
  } else if (quality === '1080p') {
    target = film.downloadLink1080p || '';
  } else if (quality === '4k') {
    target = film.downloadLink4k || '';
  }

  // If specific quality is empty, check masterVideoLink or 1080p fallback
  if (!target || target === 'YOUR_ADSTERRA_LINK') {
    target = film.masterVideoLink || film.downloadLink1080p || film.downloadLink720p || '';
  }

  // Strip accidental html/script tags
  if (target.includes('<script') || target.includes('<div')) {
    target = film.masterVideoLink || fallbackMasterUrl || DEFAULT_HILLTOPADS_POPUNDER_URL;
  }

  // Strip auto-generated suffix hashes like #720p, #1080p, #480p, #4k
  target = target.replace(/#(480p|720p|1080p|4k)$/i, '').trim();

  // If still empty, return fallback
  if (!target || target === 'YOUR_ADSTERRA_LINK') {
    target = fallbackMasterUrl || DEFAULT_HILLTOPADS_POPUNDER_URL;
  }

  return target;
}
