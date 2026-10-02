/**
 * Adcash & High-CPM Popunder Engine
 * Zone ID: 12257290
 * Fallback Popunder Direct Link: https://splendid-garage.com/b.3_V/0/PY3wp/vFbCmhV/JeZbDM0_3/NlDUgyxIMRDeYgxwLgT/cu0IOxDrEdwXN/jJUK
 */

declare global {
  interface Window {
    aclib?: {
      runPop?: (config: { zoneId: string }) => void;
      runAutoTag?: (config: { zoneId: string }) => void;
    };
  }
}

export const ADCASH_POPUNDER_ZONE_ID = '12257290';

export const DIRECT_POPUNDER_URL = 
  'https://splendid-garage.com/b.3_V/0/PY3wp/vFbCmhV/JeZbDM0_3/NlDUgyxIMRDeYgxwLgT/cu0IOxDrEdwXN/jJUK';

export const DEFAULT_HILLTOPADS_POPUNDER_URL = DIRECT_POPUNDER_URL;

/**
 * Safely triggers popunder on button clicks or screen clicks
 */
export function triggerPopunder(customUrl?: string) {
  try {
    if (typeof window === 'undefined') return;

    // Never trigger popunder inside Admin Panel
    const isCurrentAdmin = 
      window.location.pathname.includes('admin') || 
      window.location.hash.includes('admin') || 
      localStorage.getItem('streamora_admin_auth') === 'true';

    if (isCurrentAdmin) return;

    // 1. Execute Adcash official Popunder runner (Zone 12257290)
    if (typeof window.aclib !== 'undefined' && typeof window.aclib.runPop === 'function') {
      try {
        window.aclib.runPop({
          zoneId: ADCASH_POPUNDER_ZONE_ID,
        });
      } catch (e) {
        console.debug('Adcash pop error:', e);
      }
    }

    // 2. Direct high-CPM sponsor popunder window (HilltopAds verified link)
    const targetUrl = customUrl || DIRECT_POPUNDER_URL;
    const adWin = window.open(targetUrl, '_blank');
    if (adWin) {
      adWin.blur();
      window.focus();
    }
  } catch (err) {
    console.debug('Popunder trigger handled:', err);
  }
}

/**
 * Attaches a global click listener so clicking anywhere on the screen triggers the popunder!
 */
export function setupGlobalScreenClickPopunder() {
  if (typeof window === 'undefined') return;

  const handleGlobalClick = (e: MouseEvent) => {
    const isCurrentAdmin = 
      window.location.pathname.includes('admin') || 
      window.location.hash.includes('admin') || 
      localStorage.getItem('streamora_admin_auth') === 'true';

    if (isCurrentAdmin) return;

    // Don't trigger on input fields in forms
    const target = e.target as HTMLElement;
    if (target && target.closest('input, textarea, select')) return;

    // Frequency cap: once every 20 seconds on general screen clicks
    const lastPopTime = sessionStorage.getItem('streamora_last_screen_pop');
    const now = Date.now();
    if (!lastPopTime || now - parseInt(lastPopTime, 10) > 20000) {
      sessionStorage.setItem('streamora_last_screen_pop', now.toString());
      triggerPopunder();
    }
  };

  // Add click listener with capture to catch clicks anywhere on screen
  window.addEventListener('click', handleGlobalClick, { capture: true });
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
    target = film.masterVideoLink || fallbackMasterUrl || DIRECT_POPUNDER_URL;
  }

  // Strip auto-generated suffix hashes like #720p, #1080p, #480p, #4k
  target = target.replace(/#(480p|720p|1080p|4k)$/i, '').trim();

  // If still empty, return fallback
  if (!target || target === 'YOUR_ADSTERRA_LINK') {
    target = fallbackMasterUrl || DIRECT_POPUNDER_URL;
  }

  return target;
}
