// Admin Panel Functionality
let currentTab = 'users';

// Tab switching
function switchTab(tabName) {
    currentTab = tabName;
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for the tab
    loadTabData(tabName);
}

// Load data for specific tab
async function loadTabData(tabName) {
    switch(tabName) {
        case 'users':
            await loadUsers();
            break;
        case 'jobs':
            await loadJobs();
            break;
        case 'funding':
            await loadFunding();
            break;
        case 'marketplace':
            await loadProducts();
            break;
        case 'opensource':
            await loadPackages();
            break;
    }
}

// Load Users
async function loadUsers() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const tbody = document.getElementById('usersTableBody');
        
        if (usersSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        usersSnapshot.forEach(doc => {
            const user = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.email}</td>
                <td>${user.fullName || 'N/A'}</td>
                <td><span class="status-badge status-${user.role === 'admin' ? 'approved' : 'pending'}">${user.role || 'user'}</span></td>
                <td>${user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
                <td><span class="status-badge ${user.verified ? 'status-approved' : 'status-pending'}">${user.verified ? 'Verified' : 'Unverified'}</span></td>
                <td class="action-buttons">
                    <button class="btn-secondary btn-small" onclick="editUser('${doc.id}')">Edit</button>
                    <button class="btn-secondary btn-small" onclick="deleteUser('${doc.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Update stats
        document.getElementById('totalUsers').textContent = usersSnapshot.size;
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading users', 'error');
    }
}

// Load Jobs
async function loadJobs() {
    try {
        const jobsSnapshot = await db.collection('jobs').orderBy('createdAt', 'desc').get();
        const tbody = document.getElementById('jobsTableBody');
        
        if (jobsSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No jobs found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        let activeCount = 0;
        
        jobsSnapshot.forEach(doc => {
            const job = doc.data();
            if (job.status === 'active') activeCount++;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${job.title}</td>
                <td>${job.category}</td>
                <td>$${job.budget}</td>
                <td>${job.postedBy || 'Anonymous'}</td>
                <td><span class="status-badge status-${job.status === 'active' ? 'approved' : 'pending'}">${job.status}</span></td>
                <td class="action-buttons">
                    <button class="btn-secondary btn-small" onclick="viewJob('${doc.id}')">View</button>
                    <button class="btn-secondary btn-small" onclick="deleteJob('${doc.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        document.getElementById('activeJobs').textContent = activeCount;
    } catch (error) {
        console.error('Error loading jobs:', error);
        showNotification('Error loading jobs', 'error');
    }
}

// Load Funding Applications
async function loadFunding() {
    try {
        const fundingSnapshot = await db.collection('funding_applications').orderBy('submittedAt', 'desc').get();
        const tbody = document.getElementById('fundingTableBody');
        
        if (fundingSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No applications found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        let pendingCount = 0;
        
        fundingSnapshot.forEach(doc => {
            const app = doc.data();
            if (app.status === 'pending') pendingCount++;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.projectName}</td>
                <td>${app.developerName}</td>
                <td>$${app.amountRequested.toLocaleString()}</td>
                <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                <td>${app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleDateString() : 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn-primary btn-small" onclick="reviewFunding('${doc.id}')">Review</button>
                    ${app.status === 'pending' ? `
                        <button class="btn-secondary btn-small" onclick="approveFunding('${doc.id}')">Approve</button>
                        <button class="btn-secondary btn-small" onclick="rejectFunding('${doc.id}')">Reject</button>
                    ` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        document.getElementById('pendingApps').textContent = pendingCount;
    } catch (error) {
        console.error('Error loading funding:', error);
        showNotification('Error loading funding applications', 'error');
    }
}

// Load Marketplace Products
async function loadProducts() {
    try {
        const productsSnapshot = await db.collection('products').get();
        const tbody = document.getElementById('productsTableBody');
        
        if (productsSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No products found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        let totalRevenue = 0;
        
        productsSnapshot.forEach(doc => {
            const product = doc.data();
            const revenue = (product.price * product.sales) || 0;
            totalRevenue += revenue;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.developer}</td>
                <td>$${product.price}</td>
                <td>${product.sales || 0}</td>
                <td>$${revenue.toLocaleString()}</td>
                <td class="action-buttons">
                    <button class="btn-secondary btn-small" onclick="editProduct('${doc.id}')">Edit</button>
                    <button class="btn-secondary btn-small" onclick="deleteProduct('${doc.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products', 'error');
    }
}

// Load Open Source Packages
async function loadPackages() {
    try {
        const packagesSnapshot = await db.collection('opensource_packages').orderBy('votes', 'desc').get();
        const tbody = document.getElementById('packagesTableBody');
        
        if (packagesSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No packages found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        // Calculate funding pool (10% of revenue)
        const settingsDoc = await db.collection('settings').doc('platform').get();
        const settings = settingsDoc.data() || {};
        const fundingPool = settings.totalRevenue * 0.1 || 0;
        document.getElementById('fundingPool').textContent = `$${fundingPool.toLocaleString()}`;
        
        packagesSnapshot.forEach(doc => {
            const pkg = doc.data();
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pkg.name}</td>
                <td><a href="${pkg.repository}" target="_blank" style="color: var(--primary-color);">${pkg.repository}</a></td>
                <td>${pkg.votes || 0}</td>
                <td>$${pkg.monthlyFunding || 0}</td>
                <td><span class="status-badge status-${pkg.official ? 'approved' : 'pending'}">${pkg.official ? 'Official' : 'Community'}</span></td>
                <td class="action-buttons">
                    <button class="btn-secondary btn-small" onclick="editPackage('${doc.id}')">Edit</button>
                    ${!pkg.official ? `<button class="btn-primary btn-small" onclick="makeOfficial('${doc.id}')">Make Official</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading packages:', error);
        showNotification('Error loading packages', 'error');
    }
}

// User Management Functions
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        await db.collection('users').doc(userId).delete();
        showNotification('User deleted successfully', 'success');
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user', 'error');
    }
}

async function editUser(userId) {
    // TODO: Implement user editing modal
    showNotification('User editing coming soon', 'info');
}

// Job Management Functions
async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
        await db.collection('jobs').doc(jobId).delete();
        showNotification('Job deleted successfully', 'success');
        loadJobs();
    } catch (error) {
        console.error('Error deleting job:', error);
        showNotification('Error deleting job', 'error');
    }
}

async function viewJob(jobId) {
    try {
        const jobDoc = await db.collection('jobs').doc(jobId).get();
        const job = jobDoc.data();
        
        alert(`Job Details:\n\nTitle: ${job.title}\nCategory: ${job.category}\nBudget: $${job.budget}\n\nDescription:\n${job.description}`);
    } catch (error) {
        console.error('Error viewing job:', error);
        showNotification('Error loading job details', 'error');
    }
}

// Funding Management Functions
async function approveFunding(appId) {
    if (!confirm('Approve this funding application?')) return;
    
    try {
        await db.collection('funding_applications').doc(appId).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            approvedBy: currentUser.uid
        });
        
        showNotification('Funding application approved', 'success');
        loadFunding();
    } catch (error) {
        console.error('Error approving funding:', error);
        showNotification('Error approving application', 'error');
    }
}

async function rejectFunding(appId) {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    
    try {
        await db.collection('funding_applications').doc(appId).update({
            status: 'rejected',
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
            rejectedBy: currentUser.uid,
            rejectionReason: reason
        });
        
        showNotification('Funding application rejected', 'success');
        loadFunding();
    } catch (error) {
        console.error('Error rejecting funding:', error);
        showNotification('Error rejecting application', 'error');
    }
}

async function reviewFunding(appId) {
    try {
        const appDoc = await db.collection('funding_applications').doc(appId).get();
        const app = appDoc.data();
        
        const details = `
Funding Application Review

Project: ${app.projectName}
Developer: ${app.developerName}
Amount: $${app.amountRequested}
Type: ${app.fundingType}

Description:
${app.description}

Team:
${app.teamInfo || 'Not provided'}

Previous Work:
${app.previousWork || 'Not provided'}
        `;
        
        alert(details);
    } catch (error) {
        console.error('Error reviewing funding:', error);
        showNotification('Error loading application details', 'error');
    }
}

// Settings Functions
async function saveSettings() {
    try {
        const freelanceFee = parseFloat(document.getElementById('freelanceFee').value);
        const productFee = parseFloat(document.getElementById('productFee').value);
        
        await db.collection('settings').doc('platform').set({
            freelanceFee,
            productFee,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.uid
        }, { merge: true });
        
        showNotification('Settings saved successfully', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings', 'error');
    }
}

async function grantAdmin() {
    const email = document.getElementById('adminEmail').value;
    if (!email) {
        showNotification('Please enter an email address', 'error');
        return;
    }
    
    try {
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();
        
        if (usersSnapshot.empty) {
            showNotification('User not found', 'error');
            return;
        }
        
        const userDoc = usersSnapshot.docs[0];
        await db.collection('users').doc(userDoc.id).update({
            role: 'admin',
            promotedAt: firebase.firestore.FieldValue.serverTimestamp(),
            promotedBy: currentUser.uid
        });
        
        showNotification(`Admin privileges granted to ${email}`, 'success');
        document.getElementById('adminEmail').value = '';
        loadUsers();
    } catch (error) {
        console.error('Error granting admin:', error);
        showNotification('Error granting admin privileges', 'error');
    }
}

async function revokeAdmin() {
    const email = document.getElementById('adminEmail').value;
    if (!email) {
        showNotification('Please enter an email address', 'error');
        return;
    }
    
    if (!confirm(`Revoke admin privileges from ${email}?`)) return;
    
    try {
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();
        
        if (usersSnapshot.empty) {
            showNotification('User not found', 'error');
            return;
        }
        
        const userDoc = usersSnapshot.docs[0];
        await db.collection('users').doc(userDoc.id).update({
            role: 'user',
            demotedAt: firebase.firestore.FieldValue.serverTimestamp(),
            demotedBy: currentUser.uid
        });
        
        showNotification(`Admin privileges revoked from ${email}`, 'success');
        document.getElementById('adminEmail').value = '';
        loadUsers();
    } catch (error) {
        console.error('Error revoking admin:', error);
        showNotification('Error revoking admin privileges', 'error');
    }
}

// Package Management
async function makeOfficial(packageId) {
    if (!confirm('Make this package official? It will receive priority funding.')) return;
    
    try {
        await db.collection('opensource_packages').doc(packageId).update({
            official: true,
            madeOfficialAt: firebase.firestore.FieldValue.serverTimestamp(),
            madeOfficialBy: currentUser.uid
        });
        
        showNotification('Package marked as official', 'success');
        loadPackages();
    } catch (error) {
        console.error('Error making package official:', error);
        showNotification('Error updating package', 'error');
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = '../index.html';
            return;
        }
        
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            if (!userData || userData.role !== 'admin') {
                alert('Access denied. Admin privileges required.');
                window.location.href = '../index.html';
                return;
            }
            
            // Load initial data
            loadUsers();
        } catch (error) {
            console.error('Error checking admin status:', error);
            window.location.href = '../index.html';
        }
    });
});
