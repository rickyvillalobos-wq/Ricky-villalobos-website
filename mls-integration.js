// MLS Integration for Ricky Villalobos - 12:45 Team
// Replace mock data with real MLS API calls

class MLSIntegration {
    constructor() {
        this.apiKey = 'YOUR_MLS_API_KEY'; // Replace with actual API key
        this.baseUrl = 'https://api.mlsgrid.com'; // Replace with actual MLS API URL
        this.listings = [];
        this.currentFilters = {};
    }

    // Initialize MLS integration
    async init() {
        try {
            await this.loadFeaturedListings();
            this.setupSearchForm();
            this.setupPropertyCards();
        } catch (error) {
            console.error('MLS Integration Error:', error);
            this.loadFallbackData();
        }
    }

    // Load featured listings for the homepage
    async loadFeaturedListings() {
        // Real 12:45 Team Featured Properties
        const mockListings = [
            {
                id: 'MLS001',
                address: '822 Gallatin St NW',
                city: 'Washington',
                state: 'DC',
                zip: '20011',
                price: 1350000,
                beds: 5,
                baths: 4,
                sqft: 2450,
                type: 'Single Family',
                status: 'For Sale',
                image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                mlsNumber: 'KW001',
                description: 'Stunning 5-bedroom home in desirable Washington DC location with modern amenities and excellent connectivity.'
            },
            {
                id: 'MLS002',
                address: '2307 Waterside Dr',
                city: 'Bumpass',
                state: 'VA',
                zip: '23024',
                price: 1249000,
                beds: 5,
                baths: 4,
                sqft: 2890,
                type: 'Single Family',
                status: 'For Sale',
                image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                mlsNumber: 'KW002',
                description: 'Luxurious waterfront home with 5 bedrooms and 4 baths, offering serene water views and premium finishes.'
            },
            {
                id: 'MLS003',
                address: '407 16th St SE',
                city: 'Washington',
                state: 'DC',
                zip: '20003',
                price: 950000,
                beds: 4,
                baths: 3.5,
                sqft: 2180,
                type: 'Single Family',
                status: 'For Sale',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                mlsNumber: 'KW003',
                description: 'Beautiful 4-bedroom home in historic Capitol Hill neighborhood with classic architecture and modern updates.'
            },
            {
                id: 'MLS004',
                address: '187 Verbena Dr',
                city: 'Stafford',
                state: 'VA',
                zip: '22554',
                price: 935001,
                beds: 5,
                baths: 4.5,
                sqft: 3200,
                type: 'Single Family',
                status: 'For Sale',
                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                mlsNumber: 'KW004',
                description: 'Spacious 5-bedroom family home in Stafford with 4.5 baths, perfect for growing families seeking comfort and space.'
            }
        ];

        this.listings = mockListings;
        this.displayListings(mockListings);
    }

    // Real MLS API call (replace mock data above)
    async fetchMLSListings(filters = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/listings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Query: {
                        PropertyType: filters.propertyType || 'Residential',
                        ListPrice: {
                            Min: filters.minPrice || 0,
                            Max: filters.maxPrice || 999999999
                        },
                        BedroomsTotal: filters.beds || 0,
                        BathroomsTotalInteger: filters.baths || 0,
                        City: filters.city || '',
                        PostalCode: filters.zip || '',
                        LivingArea: filters.minSqft ? { Min: filters.minSqft } : undefined,
                        StandardStatus: filters.status || 'Active',
                        DaysOnMarket: filters.daysOnMarket ? { Max: filters.daysOnMarket } : undefined
                    },
                    Limit: 50,
                    Offset: 0
                })
            });

            if (!response.ok) {
                throw new Error(`MLS API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.value || [];
        } catch (error) {
            console.error('MLS API Error:', error);
            // Return filtered mock data for testing
            return this.filterMockData(filters);
        }
    }

    // Filter mock data based on search criteria
    filterMockData(filters = {}) {
        return this.listings.filter(listing => {
            // Filter by city
            if (filters.city && listing.city !== filters.city) {
                return false;
            }
            
            // Filter by property type
            if (filters.propertyType && listing.type !== filters.propertyType) {
                return false;
            }
            
            // Filter by bedrooms
            if (filters.beds && listing.beds < filters.beds) {
                return false;
            }
            
            // Filter by bathrooms
            if (filters.baths && listing.baths < filters.baths) {
                return false;
            }
            
            // Filter by price range
            if (filters.minPrice && listing.price < filters.minPrice) {
                return false;
            }
            
            if (filters.maxPrice && listing.price > filters.maxPrice) {
                return false;
            }
            
            // Filter by square footage
            if (filters.minSqft && listing.sqft && listing.sqft < filters.minSqft) {
                return false;
            }
            
            // Filter by status
            if (filters.status && listing.status !== filters.status) {
                return false;
            }
            
            // Filter by days on market (mock implementation)
            if (filters.daysOnMarket) {
                // For mock data, we'll simulate this based on listing ID
                const mockDays = (parseInt(listing.id.slice(-1)) * 7) + 3;
                if (mockDays > filters.daysOnMarket) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // Display listings in the properties section
    displayListings(listings) {
        const propertiesGrid = document.querySelector('.properties-grid');
        if (!propertiesGrid) return;

        propertiesGrid.innerHTML = '';

        listings.forEach(listing => {
            const listingCard = this.createListingCard(listing);
            propertiesGrid.appendChild(listingCard);
        });
    }

    // Display search results in dedicated search results section
    displaySearchResults(listings) {
        const resultsGrid = document.getElementById('results-grid');
        const resultsSection = document.getElementById('search-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        
        if (!resultsGrid || !resultsSection) return;

        // Clear previous results
        resultsGrid.innerHTML = '';
        
        // Update title and count
        resultsTitle.textContent = `MLS Search Results`;
        resultsCount.textContent = `Found ${listings.length} properties matching your criteria`;
        
        // Show results section
        resultsSection.style.display = 'block';
        
        // Add listings to results grid
        listings.forEach(listing => {
            const listingCard = this.createListingCard(listing);
            resultsGrid.appendChild(listingCard);
        });
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Create individual listing card
    createListingCard(listing) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="property-image">
                <img src="${listing.image}" alt="${listing.address}" onerror="this.src='https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'">
                <div class="property-badge">${listing.status}</div>
                <div class="property-price-overlay">$${this.formatPrice(listing.price)}</div>
            </div>
            <div class="property-content">
                <h3>${listing.address}</h3>
                <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${listing.city}, ${listing.state} ${listing.zip}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${listing.beds} Beds</span>
                    <span><i class="fas fa-bath"></i> ${listing.baths} Baths</span>
                    ${listing.sqft ? `<span><i class="fas fa-ruler-combined"></i> ${this.formatSqft(listing.sqft)}</span>` : ''}
                    <span><i class="fas fa-calendar-alt"></i> MLS# ${listing.mlsNumber}</span>
                </div>
                <p class="property-description">${listing.description}</p>
                <div class="property-mls">
                    <small>Listed with Keller Williams Capital Properties</small>
                </div>
                <a href="tel:571-454-3438" class="btn btn-outline">View Details</a>
            </div>
        `;

        return card;
    }

    // Setup search form with MLS integration
    setupSearchForm() {
        const searchForm = document.querySelector('.search-form');
        if (!searchForm) return;

        const searchBtn = searchForm.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performMLSSearch();
            });
        }
    }

    // Perform MLS search
    async performMLSSearch() {
        const searchForm = document.querySelector('.search-form');
        if (!searchForm) return;

        const filters = {
            city: document.getElementById('location-select')?.value || '',
            propertyType: document.getElementById('property-type-select')?.value || '',
            beds: parseInt(document.getElementById('beds-select')?.value) || 0,
            baths: parseInt(document.getElementById('baths-select')?.value) || 0,
            minPrice: this.parsePrice(document.getElementById('min-price-select')?.value) || 0,
            maxPrice: this.parsePrice(document.getElementById('max-price-select')?.value) || 999999999,
            minSqft: parseInt(document.getElementById('sqft-select')?.value) || 0,
            daysOnMarket: parseInt(document.getElementById('dom-select')?.value) || 0,
            status: document.getElementById('status-select')?.value || ''
        };

        const searchBtn = searchForm.querySelector('.search-btn');
        const originalText = searchBtn.textContent;
        searchBtn.textContent = 'Searching MLS...';
        searchBtn.disabled = true;

        try {
            // Use real MLS API call here
            const results = await this.fetchMLSListings(filters);
            
            if (results.length > 0) {
                this.displaySearchResults(results);
                this.showSearchResults(results.length);
            } else {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Search Error:', error);
            // Fallback to mock data filtering
            const results = this.filterMockData(filters);
            if (results.length > 0) {
                this.displaySearchResults(results);
                this.showSearchResults(results.length);
            } else {
                this.showNoResults();
            }
        } finally {
            searchBtn.textContent = originalText;
            searchBtn.disabled = false;
        }
    }

    // Setup property cards with MLS data
    setupPropertyCards() {
        // Add click handlers for property cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.property-card')) {
                const card = e.target.closest('.property-card');
                const listingId = card.dataset.listingId;
                if (listingId) {
                    this.showListingDetails(listingId);
                }
            }
        });
    }

    // Contact about specific listing
    contactAboutListing(listingId) {
        const listing = this.listings.find(l => l.id === listingId);
        if (listing) {
            // Pre-fill contact form with listing info
            const contactForm = document.querySelector('.contact-form form');
            if (contactForm) {
                const messageField = contactForm.querySelector('textarea');
                if (messageField) {
                    messageField.value = `I'm interested in ${listing.address}, ${listing.city}, VA (MLS# ${listing.mlsNumber}). Please contact me with more information.`;
                }
            }
            
            // Scroll to contact form
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Utility functions
    formatPrice(price) {
        return new Intl.NumberFormat('en-US').format(price);
    }

    formatSqft(sqft) {
        return new Intl.NumberFormat('en-US').format(sqft) + ' sqft';
    }

    parsePrice(priceString) {
        if (!priceString) return 0;
        return parseInt(priceString.replace(/[$,]/g, ''));
    }

    // Show search results
    showSearchResults(count) {
        const message = `Found ${count} properties matching your criteria.`;
        this.showNotification(message, 'success');
    }

    // Show no results
    showNoResults() {
        const resultsGrid = document.getElementById('results-grid');
        const resultsSection = document.getElementById('search-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        
        if (resultsGrid && resultsSection) {
            resultsGrid.innerHTML = '<div class="no-results"><i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i><h3>No Properties Found</h3><p>No properties found matching your criteria. Please try adjusting your search filters.</p></div>';
            resultsTitle.textContent = 'Search Results';
            resultsCount.textContent = 'No properties found matching your search criteria';
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        const message = 'No properties found matching your criteria. Please try adjusting your search filters.';
        this.showNotification(message, 'info');
    }

    // Show search error
    showSearchError() {
        const message = 'There was an error searching the MLS. Please try again or contact us for assistance.';
        this.showNotification(message, 'error');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mls-notification mls-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Load fallback data if MLS fails
    loadFallbackData() {
        console.log('Loading fallback data...');
        // Keep existing static property cards
    }
}

// Initialize MLS integration when DOM is loaded
let mlsIntegration;
document.addEventListener('DOMContentLoaded', () => {
    mlsIntegration = new MLSIntegration();
    mlsIntegration.init();
});

// Export for global access
window.mlsIntegration = mlsIntegration;
