-- SPDX-License-Identifier: MPL-2.0

BEGIN;

CREATE TYPE bug_category AS ENUM (
    'map',
    'account',
    'gameplay',
    'UI_design',
    'performance',
    'other'
);

CREATE TYPE bug_severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE bug_status AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);

CREATE TABLE bugs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    username TEXT,

    title VARCHAR(200) NOT NULL,
    category bug_category NOT NULL,
    severity bug_severity NOT NULL,
    description TEXT NOT NULL,
    reproduction_steps TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    can_produce_consistently BOOLEAN NOT NULL DEFAULT FALSE,

    -- Browser/client context. Treat client-provided values as untrusted.
    ip_address INET,    
    user_agent TEXT,
    page_url TEXT,
    viewport_width INTEGER,
    viewport_height INTEGER,
    locale VARCHAR(35),
    timezone VARCHAR(100),

    app_version VARCHAR(100) NOT NULL,
    git_commit VARCHAR(100) NOT NULL,

    -- Bug lifecycle is distinct from Discord ticket lifecycle.
    status bug_status NOT NULL DEFAULT 'open',
    discord_ticket_status VARCHAR(30),
    discord_thread_id VARCHAR(30) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,

    CONSTRAINT bugs_viewport_width_nonnegative
        CHECK (viewport_width IS NULL OR viewport_width >= 0),
    CONSTRAINT bugs_viewport_height_nonnegative
        CHECK (viewport_height IS NULL OR viewport_height >= 0),
    CONSTRAINT bugs_app_version_not_blank
        CHECK (length(trim(app_version)) > 0),
    CONSTRAINT bugs_git_commit_not_blank
        CHECK (length(trim(git_commit)) > 0),
    CONSTRAINT bugs_title_not_blank
        CHECK (length(trim(title)) > 0),
    CONSTRAINT bugs_description_not_blank
        CHECK (length(trim(description)) > 0)
);

-- Maintain updated_at for updates from the API or direct SQL.
CREATE FUNCTION bugs_set_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;

    IF NEW.status = 'resolved'
       AND OLD.status IS DISTINCT FROM NEW.status
       AND NEW.resolved_at IS NULL THEN
        NEW.resolved_at := CURRENT_TIMESTAMP;
    END IF;

    IF NEW.status = 'closed'
       AND OLD.status IS DISTINCT FROM NEW.status
       AND NEW.closed_at IS NULL THEN
        NEW.closed_at := CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bugs_set_timestamps
BEFORE UPDATE ON bugs
FOR EACH ROW
EXECUTE FUNCTION bugs_set_timestamps();

COMMIT;
