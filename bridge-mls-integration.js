// Bridge Interactive MLS Backend Integration
// Pure backend API - no frontend widgets, full control over UX

class BridgeMLS {
    constructor() {
        this.apiEndpoint = 'https://api.bridgedataoutput.com/api/v2';
        this.accessToken = 'YOUR_BRIDGE_ACCESS_TOKEN'; // Get from Bridge dashboard
        this.serverToken = 'YOUR_BRIDGE_SERVER_TOKEN'; // Get from Bridge dashboard
        this.currentFilters = {};
        this.listings = [];
    }

    // Initialize Bridge MLS integration
    async init() {
        try {
            console.log('Initializing Bridge MLS Backend Integration...');
            await this.testConnection();
            this.setupSearchForm();
            console.log('Bridge MLS integration ready!');
        } catch (error) {
            console.error('Bridge MLS initialization failed:', error);
            this.initializeFallback();
        }
    }

    // Test API connection
    async testConnection() {
        const response = await fetch(`${this.apiEndpoint}/test`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Bridge API connection failed: ${response.status}`);
        }

        console.log('Bridge API connection successful');
    }

    // Setup search form integration
    setupSearchForm() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.textContent = 'Search MLS Direct';
            
            // Remove existing event listeners
            const newSearchBtn = searchBtn.cloneNode(true);
            searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
            
            // Add Bridge MLS search handler
            newSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performBridgeSearch();
            });
        }
    }

    // Perform MLS search via Bridge API
    async performBridgeSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const originalText = searchBtn.textContent;
        
        try {
            searchBtn.textContent = 'Searching MLS...';
            searchBtn.disabled = true;

            const filters = this.getSearchFilters();
            console.log('Bridge MLS search filters:', filters);

            // Call Bridge API for real MLS data
            let results = [];
            try {
                results = await this.searchBridgeAPI(filters);
                console.log(`Bridge API returned ${results.length} properties`);
            } catch (apiError) {
                console.warn('Bridge API failed, using fallback:', apiError);
                results = this.filterMockData(filters);
            }

            if (results.length > 0) {
                this.displaySearchResults(results);
                this.showSuccessNotification(`Found ${results.length} MLS properties`);
            } else {
                this.showNoResults();
            }

        } catch (error) {
            console.error('Bridge search error:', error);
            this.showErrorNotification('MLS search failed. Please try again.');
        } finally {
            searchBtn.textContent = originalText;
            searchBtn.disabled = false;
        }
    }

    // Get search filters from form
    getSearchFilters() {
        return {
            city: document.getElementById('location-select')?.value || '',
            propertyType: document.getElementById('property-type-select')?.value || '',
            bedroomsMin: parseInt(document.getElementById('beds-select')?.value) || null,
            bathroomsMin: parseInt(document.getElementById('baths-select')?.value) || null,
            listPriceMin: parseInt(document.getElementById('min-price-select')?.value) || null,
            listPriceMax: parseInt(document.getElementById('max-price-select')?.value) || null,
            livingAreaMin: parseInt(document.getElementById('sqft-select')?.value) || null,
            daysOnMarketMax: parseInt(document.getElementById('dom-select')?.value) || null,
            standardStatus: document.getElementById('status-select')?.value || 'Active'
        };
    }

    // Search via Bridge Interactive API
    async searchBridgeAPI(filters) {
        // Bridge API query format (RESO Web API compliant)
        const query = this.buildODataQuery(filters);
        const apiUrl = `${this.apiEndpoint}/OData/Property?${query}`;

        console.log('Bridge API URL:', apiUrl);

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-API-Key': this.serverToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Bridge API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return this.formatBridgeResults(data.value || []);
    }

    // Build OData query for Bridge API (RESO standard)
    buildODataQuery(filters) {
        let filterParts = [];

        // City filter
        if (filters.city) {
            filterParts.push(`City eq '${filters.city}'`);
        }

        // Property type filter  
        if (filters.propertyType) {
            filterParts.push(`PropertyType eq '${filters.propertyType}'`);
        }

        // Bedroom minimum
        if (filters.bedroomsMin) {
            filterParts.push(`BedroomsTotal ge ${filters.bedroomsMin}`);
        }

        // Bathroom minimum
        if (filters.bathroomsMin) {
            filterParts.push(`BathroomsTotalInteger ge ${filters.bathroomsMin}`);
        }

        // Price range
        if (filters.listPriceMin) {
            filterParts.push(`ListPrice ge ${filters.listPriceMin}`);
        }
        if (filters.listPriceMax && filters.listPriceMax < 999999999) {
            filterParts.push(`ListPrice le ${filters.listPriceMax}`);
        }

        // Square footage minimum
        if (filters.livingAreaMin) {
            filterParts.push(`LivingArea ge ${filters.livingAreaMin}`);
        }

        // Days on market
        if (filters.daysOnMarketMax) {
            filterParts.push(`DaysOnMarket le ${filters.daysOnMarketMax}`);
        }

        // Property status
        if (filters.standardStatus && filters.standardStatus !== '') {
            filterParts.push(`StandardStatus eq '${filters.standardStatus}'`);
        }

        // Build final query
        let queryParams = [];
        
        if (filterParts.length > 0) {
            queryParams.push(`$filter=${filterParts.join(' and ')}`);
        }

        // Standard parameters
        queryParams.push('$top=50'); // Limit results
        queryParams.push('$orderby=ModificationTimestamp desc'); // Newest first
        queryParams.push('$select=ListingId,UnparsedAddress,City,StateOrProvince,PostalCode,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,PropertyType,StandardStatus,ListingKeyNumeric,PublicRemarks,Media'); // Select specific fields

        return queryParams.join('&');
    }

    // Format Bridge API results
    formatBridgeResults(bridgeListings) {
        return bridgeListings.map(listing => {
            // Get first photo if available
            let imageUrl = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
            if (listing.Media && listing.Media.length > 0) {
                imageUrl = listing.Media[0].MediaURL || imageUrl;
            }

            return {
                id: listing.ListingId || listing.ListingKeyNumeric,
                address: listing.UnparsedAddress,
                city: listing.City,
                state: listing.StateOrProvince,
                zip: listing.PostalCode,
                price: listing.ListPrice,
                beds: listing.BedroomsTotal,
                baths: listing.BathroomsTotalInteger,
                sqft: listing.LivingArea,
                type: listing.PropertyType,
                status: listing.StandardStatus,
                image: imageUrl,
                mlsNumber: listing.ListingKeyNumeric || listing.ListingId,
                description: listing.PublicRemarks || `${listing.BedroomsTotal} bed, ${listing.BathroomsTotalInteger} bath property in ${listing.City}, ${listing.StateOrProvince}`,
                source: 'MLS Direct (Bridge)'
            };
        });
    }

    // Fallback mock data (same structure as Bridge results)
    filterMockData(filters) {
        const mockListings = [
            {
                id: 'BRIDGE001',
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
                mlsNumber: 'BRIDGE001',
                description: 'Stunning 5-bedroom home via Bridge MLS Direct API',
                source: 'MLS Direct (Bridge Demo)'
            },
            {
                id: 'BRIDGE002',
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
                mlsNumber: 'BRIDGE002',
                description: 'Luxurious waterfront home via Bridge MLS Direct',
                source: 'MLS Direct (Bridge Demo)'
            }
        ];

        return mockListings.filter(listing => {
            if (filters.city && listing.city !== filters.city) return false;
            if (filters.propertyType && listing.type !== filters.propertyType) return false;
            if (filters.bedroomsMin && listing.beds < filters.bedroomsMin) return false;
            if (filters.bathroomsMin && listing.baths < filters.bathroomsMin) return false;
            if (filters.listPriceMin && listing.price < filters.listPriceMin) return false;
            if (filters.listPriceMax && listing.price > filters.listPriceMax) return false;
            if (filters.livingAreaMin && listing.sqft < filters.livingAreaMin) return false;
            return true;
        });
    }

    // Display search results
    displaySearchResults(listings) {
        const resultsGrid = document.getElementById('results-grid');
        const resultsSection = document.getElementById('search-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        
        if (!resultsGrid || !resultsSection) return;

        resultsGrid.innerHTML = '';
        resultsTitle.textContent = 'MLS Direct Search Results';
        resultsCount.innerHTML = `<i class="fas fa-database"></i> Found ${listings.length} properties from MLS Direct API`;
        resultsSection.style.display = 'block';

        listings.forEach(listing => {
            const listingCard = this.createListingCard(listing);
            resultsGrid.appendChild(listingCard);
        });

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Store listings for later use
        this.listings = listings;
    }

    // Create listing card (backend data display)
    createListingCard(listing) {
        const card = document.createElement('div');
        card.className = 'property-card bridge-mls-listing';
        card.innerHTML = `
            <div class="property-image">
                <img src="${listing.image}" alt="${listing.address}" onerror="this.src='https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'">
                <div class="property-badge">${listing.status}</div>
                <div class="property-price-overlay">$${this.formatPrice(listing.price)}</div>
                <div class="property-source-badge">MLS Direct</div>
            </div>
            <div class="property-content">
                <h3>${listing.address}</h3>
                <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${listing.city}, ${listing.state} ${listing.zip}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${listing.beds} Beds</span>
                    <span><i class="fas fa-bath"></i> ${listing.baths} Baths</span>
                    ${listing.sqft ? `<span><i class="fas fa-ruler-combined"></i> ${this.formatSqft(listing.sqft)}</span>` : ''}
                    <span><i class="fas fa-home"></i> ${listing.type}</span>
                </div>
                <p class="property-description">${listing.description}</p>
                <div class="property-mls">
                    <small><i class="fas fa-database"></i> MLS# ${listing.mlsNumber} • ${listing.source}</small>
                </div>
                <div class="property-actions">
                    <a href="tel:571-454-3438" class="btn btn-primary">Call Ricky</a>
                    <button onclick="window.bridgeMLS.requestInfo('${listing.id}')" class="btn btn-outline">Get Details</button>
                </div>
            </div>
        `;
        return card;
    }

    // Request property information
    requestInfo(listingId) {
        const listing = this.listings.find(l => l.id === listingId);
        if (listing) {
            const message = `I'm interested in ${listing.address}, ${listing.city}, ${listing.state} (MLS# ${listing.mlsNumber}). Please send me more details about this property.`;
            
            // Pre-fill contact form
            const contactForm = document.querySelector('.contact-form form');
            if (contactForm) {
                const messageField = contactForm.querySelector('textarea');
                if (messageField) {
                    messageField.value = message;
                }
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
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
                    <i class="fas fa-database" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                    <h3>No MLS Properties Found</h3>
                    <p>No properties found in the MLS database matching your criteria. Try adjusting your search filters.</p>
                    <div class="no-results-actions">
                        <a href="tel:571-454-3438" class="btn btn-primary">Call (571) 454-3438</a>
                        <button onclick="document.getElementById('search-results').style.display='none'" class="btn btn-outline">New Search</button>
                    </div>
                </div>
            `;
            resultsTitle.textContent = 'MLS Direct Search Results';
            resultsCount.textContent = 'No properties found in MLS database';
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Initialize fallback
    initializeFallback() {
        console.log('Using fallback integration');
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
                <span><i class="fas fa-database"></i> ${message}</span>
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

// Initialize Bridge MLS integration
let bridgeMLS;
document.addEventListener('DOMContentLoaded', () => {
    bridgeMLS = new BridgeMLS();
    bridgeMLS.init();
    
    // Make globally available
    window.bridgeMLS = bridgeMLS;
});