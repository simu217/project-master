#!/bin/bash

HIVE_ID="67f39ececd593597ea43a781" # 👈 Replace with your actual Hive ID
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2YzNzkxZWJiZmY5MjQ5NmY2NThlYjciLCJ1c2VybmFtZSI6InJhdmFsaSIsImVtYWlsIjoicGFyaW1hbGFyYXZhbGkyMDE2QGdtYWlsLmNvbSIsImlhdCI6MTc0NDAxNzMzMywiZXhwIjoxNzQ0MDIwOTMzfQ.mrO2e533Y3i1gqNC09jmPLtQMlIBei7n97fAgy43OJQ"      # 👈 Replace with your actual Bearer token

declare -A travelSites=(
  ["Booking"]="https://www.booking.com"
  ["Airbnb"]="https://www.airbnb.com"
  ["Expedia"]="https://www.expedia.com"
  ["Kayak"]="https://www.kayak.com"
  ["Hotels"]="https://www.hotels.com"
  ["Agoda"]="https://www.agoda.com"
  ["Trivago"]="https://www.trivago.com"
  ["Skyscanner"]="https://www.skyscanner.com"
  ["Orbitz"]="https://www.orbitz.com"
  ["Priceline"]="https://www.priceline.com"
  ["TripAdvisor"]="https://www.tripadvisor.com"
  ["LonelyPlanet"]="https://www.lonelyplanet.com"
  ["Hopper"]="https://www.hopper.com"
  ["Turo"]="https://www.turo.com"
  ["Rome2Rio"]="https://www.rome2rio.com"
  ["Viator"]="https://www.viator.com"
  ["Travelocity"]="https://www.travelocity.com"
  ["GoogleTravel"]="https://www.google.com/travel"
  ["CheapOair"]="https://www.cheapoair.com"
  ["FlightAware"]="https://www.flightaware.com"
)

echo "🚀 Adding crystals to Hive: $HIVE_ID"

for name in "${!travelSites[@]}"; do
  url="${travelSites[$name]}"
  echo "🌀 Adding: $name ($url)"

  curl -s -X POST "http://localhost:5008/api/hive/$HIVE_ID/crystals" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"title\":\"$name\",\"url\":\"$url\"}"

  echo " ✅ Done"
done

echo "✨ All travel sites have been added to your Hive, Queen Ravali! 👑🐝"
