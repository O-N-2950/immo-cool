-- Security audit: additional indexes (#15)
-- Property: ownerId, surface, status+availableFrom, postalCode
CREATE INDEX IF NOT EXISTS "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX IF NOT EXISTS "Property_surface_idx" ON "Property"("surface");
CREATE INDEX IF NOT EXISTS "Property_status_availableFrom_idx" ON "Property"("status", "availableFrom");
CREATE INDEX IF NOT EXISTS "Property_postalCode_idx" ON "Property"("postalCode");

-- SearchRequest: createdAt
CREATE INDEX IF NOT EXISTS "SearchRequest_createdAt_idx" ON "SearchRequest"("createdAt");
