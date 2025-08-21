// MLS Configuration for Ricky Villalobos - 12:45 Team
// Update these settings when connecting to real MLS providers

const MLS_CONFIG = {
    // MLS Provider Settings
    provider: 'MLS_GRID', // Options: MLS_GRID, REALTYFEED, CUSTOM
    
    // API Configuration
    apiKey: 'YOUR_MLS_API_KEY_HERE',
    baseUrl: 'https://api.mlsgrid.com',
    
    // MLS System Settings
    mlsSystems: [
        'MRIS', // Metropolitan Regional Information Systems (DC/MD/VA)
        'BRIGHT', // Bright MLS (PA/MD/DE/NJ)
        'NVAR' // Northern Virginia Association of Realtors
    ],
    
    // Search Settings
    defaultLimit: 50,
    maxResults: 200,
    
    // Property Types
    propertyTypes: [
        'Residential',
        'Single Family',
        'Townhouse',
        'Condo',
        'Multi-Family',
        'Land',
        'Commercial'
    ],
    
    // Price Ranges (in thousands)
    priceRanges: [
        { min: 0, max: 200, label: 'Under $200k' },
        { min: 200, max: 400, label: '$200k - $400k' },
        { min: 400, max: 600, label: '$400k - $600k' },
        { min: 600, max: 800, label: '$600k - $800k' },
        { min: 800, max: 1000, label: '$800k - $1M' },
        { min: 1000, max: 1500, label: '$1M - $1.5M' },
        { min: 1500, max: 2000, label: '$1.5M - $2M' },
        { min: 2000, max: 9999, label: '$2M+' }
    ],
    
    // Bedroom Options
    bedroomOptions: [
        { value: 0, label: 'Any' },
        { value: 1, label: '1+' },
        { value: 2, label: '2+' },
        { value: 3, label: '3+' },
        { value: 4, label: '4+' },
        { value: 5, label: '5+' }
    ],
    
    // Bathroom Options
    bathroomOptions: [
        { value: 0, label: 'Any' },
        { value: 1, label: '1+' },
        { value: 2, label: '2+' },
        { value: 3, label: '3+' },
        { value: 4, label: '4+' },
        { value: 5, label: '5+' }
    ],
    
    // Northern Virginia Cities
    cities: [
        'Arlington',
        'Alexandria',
        'Fairfax',
        'Vienna',
        'Reston',
        'McLean',
        'Great Falls',
        'Falls Church',
        'Annandale',
        'Springfield',
        'Burke',
        'Centreville',
        'Chantilly',
        'Herndon',
        'Sterling',
        'Ashburn',
        'Leesburg'
    ],
    
    // Lead Capture Settings
    leadCapture: {
        enabled: true,
        autoFill: true,
        followUp: true,
        crmIntegration: false // Set to true when CRM is connected
    },
    
    // Notification Settings
    notifications: {
        enabled: true,
        duration: 5000, // 5 seconds
        position: 'top-right'
    },
    
    // Fallback Settings
    fallback: {
        enabled: true,
        useMockData: true,
        showErrorMessages: true
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MLS_CONFIG;
} else {
    window.MLS_CONFIG = MLS_CONFIG;
}
