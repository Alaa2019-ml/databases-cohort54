### 1. Columns that violate 1NF

- **dinner_date**: values use different formats, so the column does not have one consistent domain.
- **food_code**: contains multiple values in a single cell (not atomic).
- **food_description**: contains multiple values in a single cell (not atomic).

### 2. Entities that can be extracted

- Member
- Dinner
- Venue
- Food

### 3. 3NF-compliant tables and columns (no junction tables)

#### Member

- member_id (PK)
- member_name
- member_address

#### Dinner

- dinner_id (PK)
- dinner_date
- venue_code (FK → Venue.venue_code)

#### Venue

- venue_code (PK)
- venue_description

#### Food

- food_code (PK)
- food_description
