// RentSpree MLS Integration for 12:45 Team
// Handles property search and listing display via RentSpree API

class RentSpreeIntegration {
    constructor() {
        this.apiEndpoint = 'https://api.rentspree.com/v1';
        this.agentId = 'ricky-villalobos-12-45-team'; // Update with actual agent ID
        this.isProduction = false; // Set to true when ready for production
        this.listings = [];
        this.currentFilters = {};
    }

    // Initialize RentSpree integration
    async init() {
        try {
            await this.loadRentSpreeSDK();
            this.setupSearchForm();
            console.log('RentSpree integration initialized successfully');
        } catch (error) {
            console.error('RentSpree initialization error:', error);
            // Fallback to existing MLS integration
            this.initializeFallback();
        }
    }

    // Load RentSpree SDK dynamically
    async loadRentSpreeSDK() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof RentSpree !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.rentspree.com/sdk/v2/rentspree.min.js';
            script.async = true;
            script.onload = () => {
                console.log('RentSpree SDK loaded');
                resolve();
            };
            script.onerror = () => {
                console.warn('RentSpree SDK failed to load, using fallback');
                reject(new Error('Failed to load RentSpree SDK'));
            };
            document.head.appendChild(script);

            // Timeout after 10 seconds
            setTimeout(() => {
                if (typeof RentSpree === 'undefined') {
                    reject(new Error('RentSpree SDK load timeout'));
                }
            }, 10000);
        });
    }

    // Setup search form integration
    setupSearchForm() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            // Update button text
            searchBtn.textContent = 'Search RentSpree MLS';
            
            // Remove existing event listeners
            const newSearchBtn = searchBtn.cloneNode(true);
            searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
            
            // Add new event listener
            newSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performRentSpreeSearch();
            });
        }
    }

    // Perform search using RentSpree API
    async performRentSpreeSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const originalText = searchBtn.textContent;
        
        try {
            searchBtn.textContent = 'Searching RentSpree...';
            searchBtn.disabled = true;

            const filters = this.getSearchFilters();
            console.log('Searching with filters:', filters);

            // Try RentSpree API first
            let results = [];
            try {
                results = await this.searchRentSpreeAPI(filters);
            } catch (apiError) {
                console.warn('RentSpree API search failed, using mock data:', apiError);
                results = this.filterMockData(filters);
            }

            if (results.length > 0) {
                this.displaySearchResults(results);
                this.showSuccessNotification(`Found ${results.length} properties via RentSpree`);
            } else {
                this.showNoResults();
            }

        } catch (error) {
            console.error('Search error:', error);
            this.showErrorNotification('Search failed. Please try again.');
        } finally {
            searchBtn.textContent = originalText;
            searchBtn.disabled = false;
        }
    }

    // Get search filters from form
    getSearchFilters() {
        return {
            location: document.getElementById('location-select')?.value || '',
            propertyType: document.getElementById('property-type-select')?.value || '',
            minBedrooms: parseInt(document.getElementById('beds-select')?.value) || 0,
            minBathrooms: parseInt(document.getElementById('baths-select')?.value) || 0,
            minPrice: parseInt(document.getElementById('min-price-select')?.value) || 0,
            maxPrice: parseInt(document.getElementById('max-price-select')?.value) || 999999999,
            minSquareFeet: parseInt(document.getElementById('sqft-select')?.value) || 0,
            daysOnMarket: parseInt(document.getElementById('dom-select')?.value) || 0,
            status: document.getElementById('status-select')?.value || 'Active'
        };
    }

    // Search via RentSpree API
    async searchRentSpreeAPI(filters) {
        const apiUrl = this.isProduction ? 
            'https://api.rentspree.com/v1/listings/search' : 
            'https://sandbox-api.rentspree.com/v1/listings/search';

        const searchPayload = {
            agent_id: this.agentId,
            filters: {
                location: filters.location,
                property_type: filters.propertyType,
                min_bedrooms: filters.minBedrooms,
                min_bathrooms: filters.minBathrooms,
                min_price: filters.minPrice,
                max_price: filters.maxPrice,
                min_square_feet: filters.minSquareFeet,
                status: filters.status,
                days_on_market: filters.daysOnMarket
            },
            limit: 50,
            offset: 0
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getApiToken()}`,
                'X-Agent-ID': this.agentId
            },
            body: JSON.stringify(searchPayload)
        });

        if (!response.ok) {
            throw new Error(`RentSpree API error: ${response.status}`);
        }

        const data = await response.json();
        return this.formatRentSpreeResults(data.listings || []);
    }

    // Get API token (implement based on RentSpree auth flow)
    getApiToken() {
        // In production, this would be obtained through OAuth or API key
        return 'YOUR_RENTSPREE_API_TOKEN'; // Replace with actual token
    }

    // Format RentSpree results to match our display format
    formatRentSpreeResults(rentspreeListings) {
        return rentspreeListings.map(listing => ({
            id: listing.id,
            address: listing.address.street,
            city: listing.address.city,
            state: listing.address.state,
            zip: listing.address.zip_code,
            price: listing.rent || listing.price,
            beds: listing.bedrooms,
            baths: listing.bathrooms,
            sqft: listing.square_feet,
            type: listing.property_type,
            status: listing.status,
            image: listing.photos?.[0]?.url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            mlsNumber: listing.mls_number || `RS${listing.id}`,
            description: listing.description || `Beautiful ${listing.bedrooms} bed, ${listing.bathrooms} bath property in ${listing.address.city}, ${listing.address.state}`,
            source: 'RentSpree'
        }));
    }

    // Fallback mock data filtering (same as existing MLS integration)
    filterMockData(filters) {
        const mockListings = [
            {
                id: 'RS001',
                address: '822 Gallatin St NW',
                city: 'Washington',
                state: 'DC',
                zip: '20011',
                price: 1350000,
                beds: 5,
                baths: 4,
                sqft: 2450,
                type: 'Single Family',
                status: 'Active',
                image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                mlsNumber: 'RS001',
                description: 'Stunning 5-bedroom home in desirable Washington DC location with modern amenities via RentSpree.',
                source: 'RentSpree (Demo)'
            },
            {
                id: 'RS002',
                address: '2307 Waterside Dr',
                city: 'Bumpass',
                state: 'VA',
                zip: '23024',
                price: 1249000,
                beds: 5,
                baths: 4,
                sqft: 2890,
                type: 'Single Family',
                status: 'Active',
                image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                mlsNumber: 'RS002',
                description: 'Luxurious waterfront home with 5 bedrooms via RentSpree platform.',
                source: 'RentSpree (Demo)'
            }
        ];

        return mockListings.filter(listing => {
            if (filters.location && listing.city !== filters.location) return false;
            if (filters.propertyType && listing.type !== filters.propertyType) return false;
            if (filters.minBedrooms && listing.beds < filters.minBedrooms) return false;
            if (filters.minBathrooms && listing.baths < filters.minBathrooms) return false;
            if (filters.minPrice && listing.price < filters.minPrice) return false;
            if (filters.maxPrice && listing.price > filters.maxPrice) return false;
            if (filters.minSquareFeet && listing.sqft < filters.minSquareFeet) return false;
            return true;
        });
    }

    // Display search results (reuse existing display logic)
    displaySearchResults(listings) {
        const resultsGrid = document.getElementById('results-grid');
        const resultsSection = document.getElementById('search-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        
        if (!resultsGrid || !resultsSection) return;

        resultsGrid.innerHTML = '';
        resultsTitle.textContent = 'RentSpree Search Results';
        resultsCount.innerHTML = `<i class="fas fa-home"></i> Found ${listings.length} properties via RentSpree MLS Network`;
        resultsSection.style.display = 'block';

        listings.forEach(listing => {
            const listingCard = this.createListingCard(listing);
            resultsGrid.appendChild(listingCard);
        });

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Create listing card (enhanced for RentSpree)
    createListingCard(listing) {
        const card = document.createElement('div');
        card.className = 'property-card rentspree-listing';
        card.innerHTML = `
            <div class="property-image">
                <img src="${listing.image}" alt="${listing.address}" onerror="this.src='https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'">
                <div class="property-badge rentspree-badge">${listing.status}</div>
                <div class="property-price-overlay">$${this.formatPrice(listing.price)}</div>
                <div class="property-source-badge">RentSpree</div>
            </div>
            <div class="property-content">
                <h3>${listing.address}</h3>
                <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${listing.city}, ${listing.state} ${listing.zip}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${listing.beds} Beds</span>
                    <span><i class="fas fa-bath"></i> ${listing.baths} Baths</span>
                    ${listing.sqft ? `<span><i class="fas fa-ruler-combined"></i> ${this.formatSqft(listing.sqft)}</span>` : ''}
                    <span><i class="fas fa-building"></i> ${listing.type}</span>
                </div>
                <p class="property-description">${listing.description}</p>
                <div class="property-mls">
                    <small><i class="fas fa-database"></i> MLS# ${listing.mlsNumber} • ${listing.source}</small>
                </div>
                <div class="property-actions">
                    <a href="tel:571-454-3438" class="btn btn-primary">Contact Agent</a>
                    <button onclick="window.rentspreeIntegration.requestTour('${listing.id}')" class="btn btn-outline">Schedule Tour</button>
                </div>
            </div>
        `;
        return card;
    }

    // Request tour functionality
    requestTour(listingId) {
        const listing = this.listings.find(l => l.id === listingId);
        if (listing) {
            const message = `I'm interested in scheduling a tour of ${listing.address}, ${listing.city}, ${listing.state} (MLS# ${listing.mlsNumber}). Please contact me to arrange a viewing.`;
            
            // Pre-fill contact form
            const contactForm = document.querySelector('.contact-form form');
            if (contactForm) {
                const messageField = contactForm.querySelector('textarea');
                if (messageField) {
                    messageField.value = message;
                }
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            } else {
                // Fallback to phone call
                window.location.href = `tel:571-454-3438`;
            }
        }
    }

    // Show no results
    showNoResults() {
        const resultsGrid = document.getElementById('results-grid');
        const resultsSection = document.getElementById('search-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        
        if (resultsGrid && resultsSection) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                    <h3>No Properties Found</h3>
                    <p>No properties found matching your criteria in the RentSpree network. Try adjusting your search filters or contact us directly.</p>
                    <div class="no-results-actions">
                        <a href="tel:571-454-3438" class="btn btn-primary">Call (571) 454-3438</a>
                        <button onclick="document.getElementById('search-results').style.display='none'" class="btn btn-outline">Try New Search</button>
                    </div>
                </div>
            `;
            resultsTitle.textContent = 'RentSpree Search Results';
            resultsCount.textContent = 'No properties found matching your search criteria';
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Initialize fallback to existing MLS integration
    initializeFallback() {
        console.log('Using fallback MLS integration');
        if (window.mlsIntegration) {
            window.mlsIntegration.init();
        }
    }

    // Notification methods
    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }

    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mls-notification mls-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span><i class="fas fa-home"></i> ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Utility functions
    formatPrice(price) {
        return new Intl.NumberFormat('en-US').format(price);
    }

    formatSqft(sqft) {
        return new Intl.NumberFormat('en-US').format(sqft) + ' sqft';
    }
}

// Initialize RentSpree integration when DOM is loaded
let rentspreeIntegration;
document.addEventListener('DOMContentLoaded', () => {
    rentspreeIntegration = new RentSpreeIntegration();
    rentspreeIntegration.init();
    
    // Make it globally available
    window.rentspreeIntegration = rentspreeIntegration;
});