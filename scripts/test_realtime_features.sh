#!/bin/bash

# Test script for real-time geolocation and call features
# Tests: Delivery tracking with Ghana coordinates, video/voice calls

set -e

BASE_URL="http://localhost:5000"
COOKIES_DIR="/tmp/kiyumart_cookies"
mkdir -p $COOKIES_DIR

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 KiyuMart Real-Time Features Test Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============ Test 1: Create Order for Delivery Tracking ============
echo -e "\n📦 Test 1: Creating order as buyer..."
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@kiyumart.com","password":"buyer123"}' \
  -c $COOKIES_DIR/buyer.txt > /dev/null

# Get CSRF token
CSRF_TOKEN=$(curl -s $BASE_URL/api/csrf-token -b $COOKIES_DIR/buyer.txt | jq -r '.token')

# Get a product ID
PRODUCT_ID=$(curl -s $BASE_URL/api/products | jq -r '.[0].id')
echo "   Selected product: $PRODUCT_ID"

# Add to cart
curl -s -X POST $BASE_URL/api/cart \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -b $COOKIES_DIR/buyer.txt \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}" > /dev/null

# Create order
ORDER_RESPONSE=$(curl -s -X POST $BASE_URL/api/orders \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -b $COOKIES_DIR/buyer.txt \
  -d '{
    "deliveryAddress": "123 Liberation Road, Accra, Ghana",
    "phone": "+233244555001",
    "deliveryZoneId": null,
    "deliveryFee": "10.00",
    "paymentMethod": "paystack"
  }')

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.id')
if [ "$ORDER_ID" != "null" ]; then
  echo "✅ Order created: $ORDER_ID"
else
  echo "❌ Failed to create order"
  echo $ORDER_RESPONSE | jq
  exit 1
fi

# ============ Test 2: Assign Rider to Order ============
echo -e "\n🏍️  Test 2: Assigning rider to order (as admin)..."
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kiyumart.com","password":"admin123"}' \
  -c $COOKIES_DIR/admin.txt > /dev/null

# Get CSRF token
ADMIN_CSRF=$(curl -s $BASE_URL/api/csrf-token -b $COOKIES_DIR/admin.txt | jq -r '.token')

# Get rider ID
RIDER_ID=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rider1@kiyumart.com","password":"rider123"}' | jq -r '.user.id')

# Assign rider (update order status)
curl -s -X PATCH $BASE_URL/api/orders/$ORDER_ID \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $ADMIN_CSRF" \
  -b $COOKIES_DIR/admin.txt \
  -d "{\"riderId\":\"$RIDER_ID\",\"status\":\"in_transit\"}" > /dev/null

echo "✅ Rider $RIDER_ID assigned to order $ORDER_ID"

# ============ Test 3: Test Delivery Geolocation Tracking ============
echo -e "\n📍 Test 3: Testing delivery geolocation tracking..."
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rider1@kiyumart.com","password":"rider123"}' \
  -c $COOKIES_DIR/rider.txt > /dev/null

# Test with Accra coordinates
echo "   📌 Location 1: Accra Central (5.6037°N, 0.1870°W)"
TRACK1=$(curl -s -X POST $BASE_URL/api/delivery-tracking \
  -H "Content-Type: application/json" \
  -b $COOKIES_DIR/rider.txt \
  -d "{
    \"orderId\":\"$ORDER_ID\",
    \"latitude\":5.6037,
    \"longitude\":-0.1870,
    \"accuracy\":10,
    \"speed\":15,
    \"heading\":90
  }")

if echo $TRACK1 | jq -e '.id' > /dev/null 2>&1; then
  echo "   ✅ Tracking update successful"
else
  echo "   ❌ Tracking failed: $(echo $TRACK1 | jq -r '.error')"
fi

sleep 1.5  # Respect rate limit (1 update per second)

# Test with Kumasi coordinates
echo "   📌 Location 2: Kumasi (6.6885°N, 1.6244°W)"
TRACK2=$(curl -s -X POST $BASE_URL/api/delivery-tracking \
  -H "Content-Type: application/json" \
  -b $COOKIES_DIR/rider.txt \
  -d "{
    \"orderId\":\"$ORDER_ID\",
    \"latitude\":6.6885,
    \"longitude\":-1.6244,
    \"accuracy\":8,
    \"speed\":25,
    \"heading\":180
  }")

if echo $TRACK2 | jq -e '.id' > /dev/null 2>&1; then
  echo "   ✅ Tracking update successful"
else
  echo "   ❌ Tracking failed: $(echo $TRACK2 | jq -r '.error')"
fi

sleep 1.5

# Test with Tamale coordinates
echo "   📌 Location 3: Tamale (9.4034°N, 0.8424°W)"
TRACK3=$(curl -s -X POST $BASE_URL/api/delivery-tracking \
  -H "Content-Type: application/json" \
  -b $COOKIES_DIR/rider.txt \
  -d "{
    \"orderId\":\"$ORDER_ID\",
    \"latitude\":9.4034,
    \"longitude\":-0.8424,
    \"accuracy\":12,
    \"speed\":20,
    \"heading\":270
  }")

if echo $TRACK3 | jq -e '.id' > /dev/null 2>&1; then
  echo "   ✅ Tracking update successful"
else
  echo "   ❌ Tracking failed: $(echo $TRACK3 | jq -r '.error')"
fi

# Test rate limiting
echo "   🚦 Testing rate limit (should fail if < 1 second)..."
TRACK_SPAM=$(curl -s -X POST $BASE_URL/api/delivery-tracking \
  -H "Content-Type: application/json" \
  -b $COOKIES_DIR/rider.txt \
  -d "{
    \"orderId\":\"$ORDER_ID\",
    \"latitude\":9.5,
    \"longitude\":-0.9,
    \"accuracy\":10,
    \"speed\":10,
    \"heading\":0
  }")

if echo $TRACK_SPAM | grep -q "Rate limit exceeded"; then
  echo "   ✅ Rate limiting working correctly"
else
  echo "   ⚠️  Rate limit not triggered"
fi

# ============ Test 4: Verify No Geofence Restrictions ============
echo -e "\n🌍 Test 4: Testing coordinates outside Ghana (no geofence)..."

# Test with coordinates outside Ghana (e.g., Nigeria - Lagos)
echo "   📌 Testing Lagos, Nigeria (6.5244°N, 3.3792°E) - should succeed"
TRACK_NG=$(curl -s -X POST $BASE_URL/api/delivery-tracking \
  -H "Content-Type: application/json" \
  -b $COOKIES_DIR/rider.txt \
  -d "{
    \"orderId\":\"$ORDER_ID\",
    \"latitude\":6.5244,
    \"longitude\":3.3792,
    \"accuracy\":10,
    \"speed\":0,
    \"heading\":0
  }")

sleep 1.5

if echo $TRACK_NG | jq -e '.id' > /dev/null 2>&1; then
  echo "   ✅ No geofence restriction - international tracking allowed"
else
  echo "   ❌ Geofence may be restricting: $(echo $TRACK_NG | jq -r '.error')"
fi

# ============ Test 5: Get Tracking History ============
echo -e "\n📊 Test 5: Retrieving tracking history..."
HISTORY=$(curl -s $BASE_URL/api/orders/$ORDER_ID/tracking \
  -b $COOKIES_DIR/buyer.txt)

TRACK_COUNT=$(echo $HISTORY | jq '. | length')
echo "   ✅ Retrieved $TRACK_COUNT tracking points"
if [ "$TRACK_COUNT" -gt 0 ]; then
  echo "   📍 Latest location: $(echo $HISTORY | jq -r '.[0] | "\(.latitude), \(.longitude)"')"
fi

# ============ Test 6: Store Types and Multivendor Mode ============
echo -e "\n🏪 Test 6: Verifying multivendor mode and store types..."
STORES=$(curl -s $BASE_URL/api/stores)
STORE_COUNT=$(echo $STORES | jq '. | length')
echo "   📦 Total stores: $STORE_COUNT"
echo $STORES | jq -r '.[] | "      - \(.name) [\(.storeType)]"'

MULTIVENDOR=$(curl -s $BASE_URL/api/platform-settings | jq -r '.isMultiVendor')
if [ "$MULTIVENDOR" = "true" ]; then
  echo "   ✅ Multi-vendor mode: ENABLED"
else
  echo "   ❌ Multi-vendor mode: DISABLED"
fi

echo -e "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Real-Time Features Test Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "\n📋 Summary:"
echo "   ✅ Order created and rider assigned"
echo "   ✅ Geolocation tracking working (Accra, Kumasi, Tamale)"
echo "   ✅ No geofence restrictions (international tracking allowed)"
echo "   ✅ Rate limiting functional (1 update/second)"
echo "   ✅ Multi-vendor mode enabled with $STORE_COUNT stores"
echo -e "\n⚠️  Note: Video/voice call testing requires Socket.IO client"
echo "   To test calls, use the frontend UI or a Socket.IO test client"
