// Helper function to get site config from localStorage with fallback
export const getSiteConfig = (): SiteConfig => {
  if (typeof window === 'undefined') return defaultSiteConfig;
  try {
    const stored = localStorage.getItem('siteConfig');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure categories exist
      if (!parsed.categories) parsed.categories = defaultSiteConfig.categories;
      return parsed;
    }
  } catch (error) {
    console.error('Error loading site config:', error);
  }
  return defaultSiteConfig;
};

// Helper function to save site config
export const saveSiteConfig = (config: SiteConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('siteConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving site config:', error);
  }
};

// Helper to get categories
export const getCategories = (): string[] => {
  return getSiteConfig().categories;
};

// Helper to update categories
export const updateCategories = (categories: string[]): void => {
  const config = getSiteConfig();
  config.categories = categories;
  saveSiteConfig(config);
};
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  festivalTheme?: {
    name: string;
    active: boolean;
    colors: {
      primary: string;
      secondary: string;
    };
    bannerText?: string;
  };
}

export interface HeaderConfig {
  logo: string;
  companyName: string;
  navigation: {
    label: string;
    href: string;
  }[];
  ctaButton: {
    text: string;
    href: string;
  };
}

export interface FooterConfig {
  companyName: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
  };
  sections: {
    products: {
      title: string;
      links: { label: string; href: string; }[];
    };
    company: {
      title: string;
      links: { label: string; href: string; }[];
    };
  };
  bottomText: string;
}

export interface SiteConfig {
  theme: ThemeConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  categories: string[];
}

export const defaultSiteConfig: SiteConfig = {
  theme: {
    primaryColor: 'purple',
    secondaryColor: 'pink',
    accentColor: 'blue',
    festivalTheme: {
      name: 'none',
      active: false,
      colors: {
        primary: 'purple',
        secondary: 'pink',
      },
    },
  },
  header: {
    logo: '✨',
    companyName: 'HIPPARCHUS TECHNOLOGIES',
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Solutions', href: '/#features' },
      { label: 'Services', href: '/#how-it-works' },
      { label: 'About', href: '/#about' },
      { label: 'Store', href: '/store' },
    ],
    ctaButton: {
      text: 'Get Started',
      href: '/store',
    },
  },
  footer: {
    companyName: 'HIPPARCHUS TECHNOLOGIES',
    description: 'Transforming businesses with cutting-edge ready-made software solutions. Launch faster, scale better.',
    contact: {
      email: 'info@hipparchus.tech',
      phone: '+1 (555) 789-0123',
      address: 'Tech Hub Center, Silicon Valley, CA 94025',
    },
    socialLinks: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
    sections: {
      products: {
        title: 'Our Products',
        links: [
          { label: 'Taxi Booking Solution', href: '/store/TX8K9L2M4N6P8Q1R3S5T7V9W' },
          { label: 'Food Delivery App', href: '/store/FD7H2J4K6M8N1P3Q5R7S9T2V' },
          { label: 'E-Commerce Platform', href: '/store/EC3W5X7Y9Z1A3B5C7D9F2H4J' },
          { label: 'Vacation Rental System', href: '/store/VR6K8L1M3N5P7Q9R2S4T6V8W' },
        ],
      },
      company: {
        title: 'Company',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/#features' },
          { label: 'How It Works', href: '/#how-it-works' },
          { label: 'About Us', href: '/#about' },
          { label: 'Store', href: '/store' },
        ],
      },
    },
    bottomText: 'Built with excellence for businesses worldwide',
  },
  categories: ['All', 'Booking', 'Delivery', 'E-Commerce', 'Communication', 'Custom'],
};
