# Database Decisions

This document is the official technical contract for the Life Radar database conventions.

## 1. Official language
- All database objects and identifiers must be written in English.
- Snake_case is mandatory for all names.
- The project will use singular names for table names and plural-like names only when a collection concept is explicitly required by domain semantics.

## 2. Naming conventions
### Tables
- Use lowercase snake_case.
- Use singular names by default.
- Example: `user_profile`, `financial_entry`.

### Columns
- Use lowercase snake_case.
- Use descriptive names.
- Example: `created_at`, `is_active`, `account_balance`.

### Indexes
- Use the prefix `idx_`.
- Example: `idx_financial_entry_user_id`.

### Triggers
- Use the prefix `trg_`.
- Example: `trg_user_profile_updated_at`.

### Views
- Use the prefix `v_`.
- Example: `v_user_financial_summary`.

### Functions
- Use lowercase snake_case.
- Use the prefix `fn_` for clarity when needed.
- Example: `fn_calculate_balance`.

### Constraints
- Use descriptive names in lowercase snake_case.
- Example: `fk_financial_entry_user`, `chk_amount_positive`.

## 3. Required types
- Primary keys must use `uuid`.
- Dates and timestamps must use `timestamptz`.
- Boolean fields must use `boolean`.
- Decimal values must use `numeric`.
- Variable text must use `text`.
- Structured objects must use `jsonb`.

## 4. Standard fields
- `id`: primary key, UUID.
- `user_id`: UUID reference to the owning user.
- `created_at`: timestamp of creation, defaulting to the current timestamp.
- `updated_at`: timestamp of the last update.
- `deleted_at`: soft-delete timestamp. If null, the record is active.

## 5. Foreign key rules
- Foreign keys must always be explicit and named.
- Relationships must be documented in the migration comments or accompanying architecture notes.
- Cascade behavior must be chosen intentionally and documented.
- Avoid circular references when possible.

## 6. Index rules
- Indexes must be created for columns used in filtering, joining, sorting, and frequent lookups.
- Composite indexes must reflect real query patterns.
- Index names must be stable and predictable.
- Over-indexing must be avoided.

## 7. View rules
- Views must expose clear, business-friendly data structures.
- Views must not hide important business logic without documentation.
- Views must be named consistently and use the agreed prefix.

## 8. Function rules
- Functions must be deterministic when possible.
- Input and output parameters must be clearly named.
- Functions must be documented in terms of responsibility and side effects.
- Business logic should be centralized in functions when it is reused by multiple operations.

## 9. Trigger rules
- Triggers must be used only when they solve a clear data integrity or audit requirement.
- Trigger behavior must be documented and kept simple.
- Triggers must not introduce hidden side effects without explanation.

## 10. RLS conventions
- Row Level Security must be enabled for tables that contain user-owned data.
- Policies must be explicit, readable, and aligned with the ownership model.
- Prefer simple policies over overly complex ones.
- Policies must be documented with their intent.

## 11. Conventions for future migrations
- Migrations must be additive and reversible where possible.
- Each migration must have a clear and descriptive name.
- Migrations must not modify existing business logic without explicit documentation.
- Changes must preserve the integrity of the existing schema.

## 12. Mandatory best practices
- Keep naming consistent across all objects.
- Prefer clarity over cleverness.
- Document non-obvious decisions.
- Preserve data integrity and auditability.
- Keep the schema easy to understand for future contributors.
- Avoid implementation shortcuts that create ambiguity.
