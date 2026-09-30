import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

export const GlobalAdScriptInjector: React.FC = () => {
  const { ads, settings } = useAdmin();

  useEffect(() => {
    // 1. In-head / in-body global scripts from active ads (like Popunders, Social Bars, HilltopAds, Adcash)
    const injectedElements: HTMLElement[] = [];

    const globalAds = ads.filter(
      (a) => a.enabled && (a.slot === 'floating_corner' || (a.format as string) === 'popunder' || (a.format as string) === 'social_bar') && a.htmlScriptCode
    );

    globalAds.forEach((ad) => {
      const container = document.createElement('div');
      container.id = `ad-script-${ad.id}`;
      container.style.display = 'none';
      container.innerHTML = ad.htmlScriptCode;

      const scripts = Array.from(container.querySelectorAll('script'));
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.text = oldScript.text;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      document.body.appendChild(container);
      injectedElements.push(container);
    });

    // 2. Custom Header Script from settings
    if (settings.customHeaderScript?.trim()) {
      const headerContainer = document.createElement('div');
      headerContainer.id = 'streamora-custom-header-scripts';
      headerContainer.style.display = 'none';
      headerContainer.innerHTML = settings.customHeaderScript;

      const scripts = Array.from(headerContainer.querySelectorAll('script'));
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.text = oldScript.text;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      document.head.appendChild(headerContainer);
      injectedElements.push(headerContainer);
    }

    return () => {
      injectedElements.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [ads, settings.customHeaderScript]);

  return null;
};
