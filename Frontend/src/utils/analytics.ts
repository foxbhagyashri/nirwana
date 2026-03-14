// Google Analytics utility functions

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-3MD97DC8HQ";

/**
 * Track a page view
 */
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Track an event
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track button click
 */
export const trackButtonClick = (
  buttonName: string,
  location?: string,
  additionalData?: Record<string, any>
) => {
  trackEvent("click", "button", buttonName);
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "button_click", {
      button_name: buttonName,
      button_location: location || window.location.pathname,
      ...additionalData,
    });
  }
};

/**
 * Track accommodation view
 */
export const trackAccommodationView = (accommodationId: string, accommodationName: string) => {
  trackEvent("view_item", "accommodation", accommodationName);
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "view_item", {
      item_id: accommodationId,
      item_name: accommodationName,
      item_category: "accommodation",
    });
  }
};

/**
 * Track booking initiation
 */
export const trackBookingStart = (accommodationId: string, accommodationName: string) => {
  trackEvent("begin_checkout", "booking", accommodationName);
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", {
      item_id: accommodationId,
      item_name: accommodationName,
      item_category: "accommodation",
    });
  }
};

/**
 * Track form submission
 */
export const trackFormSubmit = (formName: string, formType: string) => {
  trackEvent("form_submit", "form", formName);
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "form_submit", {
      form_name: formName,
      form_type: formType,
    });
  }
};

/**
 * Track phone call click
 */
export const trackPhoneClick = () => {
  trackButtonClick("phone_call", window.location.pathname);
};

/**
 * Track WhatsApp click
 */
export const trackWhatsAppClick = () => {
  trackButtonClick("whatsapp", window.location.pathname);
};

/**
 * Track navigation click
 */
export const trackNavigation = (destination: string) => {
  trackEvent("navigation", "menu", destination);
};

