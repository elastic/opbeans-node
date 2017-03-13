#!/usr/bin/env bash

if [ -z "$DATABASE_URL" ]; then
  psql -d opbeans -f db/setup.sql && psql -d opbeans -f db/products.sql && psql -d opbeans -f db/mock_customers.sql
else
  # DATABASE_URL is commonly set by Heroku
  psql $DATABASE_URL -f db/setup.sql && psql $DATABASE_URL -f db/products.sql && psql $DATABASE_URL -f db/mock_customers.sql
fi
