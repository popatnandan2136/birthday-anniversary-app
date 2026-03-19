# API Testing Guide - Curl Commands

## Setup

```bash
# Base URL
BASE_URL="http://localhost:3001"

# Export for easier usage
export BASE_URL="http://localhost:3001"
```

## Authentication Tests

### 1. Login as Admin
```bash
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpass123"
  }'

# Save token
# export TOKEN="<token_from_response>"
```

### 2. Login as Master Admin
```bash
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "master@example.com",
    "password": "masterpass123"
  }'
```

### 3. Get Current User
```bash
curl -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Logout
```bash
curl -X POST "$BASE_URL/api/auth/logout" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Master Admin Tests

### 5. Create New Admin
```bash
curl -X POST "$BASE_URL/api/master/admin/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "securepass123",
    "name": "New Admin",
    "phoneNumber": "9876543210"
  }'
```

### 6. Update Admin
```bash
curl -X PUT "$BASE_URL/api/master/admin/update/{adminId}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phoneNumber": "9876543210",
    "status": "active"
  }'
```

### 7. Get All Admins
```bash
curl -X GET "$BASE_URL/api/master/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Delete Admin
```bash
curl -X DELETE "$BASE_URL/api/master/admin/delete/{adminId}" \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Create License Key
```bash
curl -X POST "$BASE_URL/api/master/key/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxWebsites": 5,
    "assignedAdminId": "admin_id_here",
    "expiresAt": "2025-12-31",
    "notes": "Premium plan - 5 websites"
  }'
```

### 10. Update License Key
```bash
curl -X PUT "$BASE_URL/api/master/key/update/{keyId}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxWebsites": 10,
    "expiresAt": "2026-12-31"
  }'
```

### 11. Assign License Key to Admin
```bash
curl -X POST "$BASE_URL/api/master/key/assign" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "key_id_here",
    "adminId": "admin_id_here"
  }'
```

### 12. Get All License Keys
```bash
curl -X GET "$BASE_URL/api/master/key/all?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 13. Delete License Key
```bash
curl -X DELETE "$BASE_URL/api/master/key/delete/{keyId}" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Admin Tests

### 14. Get License Key Status
```bash
curl -X GET "$BASE_URL/api/admin/key/status" \
  -H "Authorization: Bearer $TOKEN"
```

### 15. Create Website
```bash
curl -X POST "$BASE_URL/api/admin/website/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "birthday",
    "title": "John'\''s 21st Birthday",
    "personName": "John Smith",
    "relation": "brother",
    "ageCategory": "little",
    "ageGroup": "0-5",
    "date": "2024-12-15",
    "message": "Happy 21st birthday to my amazing brother! Have an awesome day!",
    "template": "brother-adventure-1",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg"
  }'

# Response includes:
# - slug (unique URL identifier)
# - publicUrl (shareable link)
# - qrCode (base64 PNG)
```

### 16. Create Website - Anniversary
```bash
curl -X POST "$BASE_URL/api/admin/website/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "anniversary",
    "title": "John & Sarah Anniversary",
    "personName": "John & Sarah",
    "relation": "wife",
    "ageCategory": "adult",
    "date": "2024-06-15",
    "message": "25 years of love and memories together!",
    "template": "wife-romantic-1",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/v1234/couple.jpg"
  }'
```

### 17. Get Admin's Websites
```bash
curl -X GET "$BASE_URL/api/admin/website/list?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 18. Get Admin's Websites (Filtered by Status)
```bash
curl -X GET "$BASE_URL/api/admin/website/list?page=1&limit=10&status=active" \
  -H "Authorization: Bearer $TOKEN"
```

### 19. Get Website Details
```bash
curl -X GET "$BASE_URL/api/admin/website/{websiteId}" \
  -H "Authorization: Bearer $TOKEN"
```

### 20. Update Website
```bash
curl -X PUT "$BASE_URL/api/admin/website/{websiteId}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Birthday Title",
    "message": "New message for the celebration!",
    "template": "brother-rocket-2",
    "expiresAt": "2025-01-15"
  }'
```

### 21. Toggle Website (Active/Inactive)
```bash
curl -X PUT "$BASE_URL/api/admin/website/toggle/{websiteId}" \
  -H "Authorization: Bearer $TOKEN"
```

### 22. Delete Website
```bash
curl -X DELETE "$BASE_URL/api/admin/website/{websiteId}" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Public Tests (No Authentication Required)

### 23. Get Public Website by Slug
```bash
curl -X GET "$BASE_URL/api/public/website/john-smith-a1b2c3d4"
```

### 24. Get Popular Websites
```bash
curl -X GET "$BASE_URL/api/public/popular?limit=10"
```

### 25. Get Websites by Type - Birthday
```bash
curl -X GET "$BASE_URL/api/public/websites/birthday?page=1&limit=10"
```

### 26. Get Websites by Type - Anniversary
```bash
curl -X GET "$BASE_URL/api/public/websites/anniversary?page=1&limit=10"
```

---

## Error Testing

### 401 - Unauthorized (No Token)
```bash
curl -X GET "$BASE_URL/api/admin/website/list"
# Expected: {"success": false, "message": "No token provided..."}
```

### 401 - Invalid Token
```bash
curl -X GET "$BASE_URL/api/admin/website/list" \
  -H "Authorization: Bearer invalid-token"
# Expected: {"success": false, "message": "Invalid or expired token..."}
```

### 403 - Forbidden (Wrong Role)
```bash
# Try to create license key with ADMIN role (requires MASTER_ADMIN)
curl -X POST "$BASE_URL/api/master/key/create" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maxWebsites": 5, "assignedAdminId": "id"}'
# Expected: {"success": false, "message": "Access denied..."}
```

### 403 - License Limit Exceeded
```bash
# Try to create website when usedCount >= maxWebsites
curl -X POST "$BASE_URL/api/admin/website/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "birthday",
    "title": "Over Limit",
    "personName": "John",
    "relation": "brother",
    "ageCategory": "child",
    "date": "2024-12-15",
    "message": "Test"
  }'
# Expected: {"success": false, "message": "Website limit reached..."}
```

### 404 - Not Found
```bash
curl -X GET "$BASE_URL/api/public/website/nonexistent-slug"
# Expected: {"success": false, "message": "Website not found..."}
```

### 409 - Conflict (Duplicate Email)
```bash
# Try to create admin with existing email
curl -X POST "$BASE_URL/api/master/admin/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "password": "pass123",
    "name": "Someone"
  }'
# Expected: {"success": false, "message": "User with this email already exists..."}
```

---

## Batch Testing Script

Save as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Starting API Tests...\n"

# Health check
echo -e "${GREEN}✓ Health Check${NC}"
curl -s "$BASE_URL/api/health" | jq '.'

# Login
echo -e "\n${GREEN}✓ Admin Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpass123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# Get current user
echo -e "\n${GREEN}✓ Get Current User${NC}"
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get license status
echo -e "\n${GREEN}✓ License Status${NC}"
curl -s -X GET "$BASE_URL/api/admin/key/status" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Create website
echo -e "\n${GREEN}✓ Create Website${NC}"
curl -s -X POST "$BASE_URL/api/admin/website/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "birthday",
    "title": "Test Birthday",
    "personName": "Test Person",
    "relation": "sister",
    "ageCategory": "little",
    "ageGroup": "0-5",
    "date": "2024-12-15",
    "message": "Happy Birthday!"
  }' | jq '.'

echo -e "\n${GREEN}✅ All tests completed!${NC}"
```

Run tests:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test public endpoint (no auth)
ab -n 100 -c 10 http://localhost:3001/api/public/popular

# Test authenticated endpoint (with token)
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/website/list
```

### Response Time Testing
```bash
# Measure round-trip time
time curl -s -X GET "$BASE_URL/api/public/popular" > /dev/null
```

---

## Common Testing Patterns

### Pattern 1: Full Admin Workflow
```bash
# 1. Login
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpass123"}' \
  | jq -r '.data.token')

# 2. Check license
curl -s -X GET "$BASE_URL/api/admin/key/status" \
  -H "Authorization: Bearer $TOKEN" | jq '.data'

# 3. Create website
WEBSITE=$(curl -s -X POST "$BASE_URL/api/admin/website/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}' | jq '.data')

SLUG=$(echo $WEBSITE | jq -r '.slug')

# 4. Access publicly
curl -s "$BASE_URL/api/public/website/$SLUG" | jq '.data'
```

### Pattern 2: Master Admin Setup
```bash
# Create admin
ADMIN=$(curl -s -X POST "$BASE_URL/api/master/admin/create" \
  -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}' | jq '.data')

ADMIN_ID=$(echo $ADMIN | jq -r '.id')

# Create license key
KEY=$(curl -s -X POST "$BASE_URL/api/master/key/create" \
  -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"maxWebsites\":5,\"assignedAdminId\":\"$ADMIN_ID\"}" \
  | jq '.data')

KEY_ID=$(echo $KEY | jq -r '.id')

# Verify assignment
curl -s -X GET "$BASE_URL/api/master/key/all" \
  -H "Authorization: Bearer $MASTER_TOKEN" | jq '.data[] | select(.id=="'$KEY_ID'")'
```
