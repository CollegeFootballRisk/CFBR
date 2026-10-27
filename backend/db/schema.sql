--
-- PostgreSQL database dump
--


-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: bug_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bug_category AS ENUM (
    'map',
    'account',
    'gameplay',
    'UI_design',
    'performance',
    'other'
);


--
-- Name: bug_severity; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bug_severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


--
-- Name: bug_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bug_status AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);


--
-- Name: bugs_set_timestamps(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bugs_set_timestamps() RETURNS trigger
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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bugs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bugs (
    id bigint NOT NULL,
    username text,
    title character varying(200) NOT NULL,
    category public.bug_category NOT NULL,
    severity public.bug_severity NOT NULL,
    description text NOT NULL,
    reproduction_steps text,
    expected_behavior text,
    actual_behavior text,
    can_produce_consistently boolean DEFAULT false NOT NULL,
    ip_address inet,
    user_agent text,
    page_url text,
    viewport_width integer,
    viewport_height integer,
    locale character varying(35),
    timezone character varying(100),
    app_version character varying(100) NOT NULL,
    git_commit character varying(100) NOT NULL,
    status public.bug_status DEFAULT 'open'::public.bug_status NOT NULL,
    discord_ticket_status character varying(30),
    discord_thread_id character varying(30),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at timestamp with time zone,
    closed_at timestamp with time zone,
    discord_message_id character varying(30),
    transcript_status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    discord_transcript_message_id character varying(30),
    closed_by_discord_id character varying(30),
    CONSTRAINT bugs_app_version_not_blank CHECK ((length(TRIM(BOTH FROM app_version)) > 0)),
    CONSTRAINT bugs_description_not_blank CHECK ((length(TRIM(BOTH FROM description)) > 0)),
    CONSTRAINT bugs_git_commit_not_blank CHECK ((length(TRIM(BOTH FROM git_commit)) > 0)),
    CONSTRAINT bugs_title_not_blank CHECK ((length(TRIM(BOTH FROM title)) > 0)),
    CONSTRAINT bugs_transcript_status_valid CHECK (((transcript_status)::text = ANY ((ARRAY['pending'::character varying, 'generating'::character varying, 'published'::character varying, 'failed'::character varying])::text[]))),
    CONSTRAINT bugs_viewport_height_nonnegative CHECK (((viewport_height IS NULL) OR (viewport_height >= 0))),
    CONSTRAINT bugs_viewport_width_nonnegative CHECK (((viewport_width IS NULL) OR (viewport_width >= 0)))
);


--
-- Name: bugs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bugs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bugs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    legacy_team_id integer,
    name public.citext NOT NULL,
    primary_color text NOT NULL,
    secondary_color text NOT NULL,
    logo text NOT NULL,
    seasons integer[] DEFAULT '{}'::integer[] NOT NULL,
    CONSTRAINT teams_logo_not_blank CHECK ((length(TRIM(BOTH FROM logo)) > 0)),
    CONSTRAINT teams_name_not_blank CHECK ((length(TRIM(BOTH FROM (name)::text)) > 0)),
    CONSTRAINT teams_primary_color_valid CHECK ((primary_color ~ '^#[0-9A-Fa-f]{6}$'::text)),
    CONSTRAINT teams_secondary_color_valid CHECK ((secondary_color ~ '^#[0-9A-Fa-f]{6}$'::text))
);


--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.teams ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bugs bugs_discord_thread_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bugs
    ADD CONSTRAINT bugs_discord_thread_id_key UNIQUE (discord_thread_id);


--
-- Name: bugs bugs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bugs
    ADD CONSTRAINT bugs_pkey PRIMARY KEY (id);


--
-- Name: teams teams_legacy_team_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_legacy_team_id_key UNIQUE (legacy_team_id);


--
-- Name: teams teams_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
