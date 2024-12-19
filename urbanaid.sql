--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

-- Started on 2024-12-14 04:14:27

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 40978)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admins_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'superadmin'::character varying])::text[])))
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 40977)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 222 (class 1259 OID 40991)
-- Name: laporan_masuk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laporan_masuk (
    id integer NOT NULL,
    judul character varying(255) NOT NULL,
    jenis_infrastruktur character varying(100) NOT NULL,
    tanggal_kejadian timestamp without time zone NOT NULL,
    deskripsi text NOT NULL,
    alamat text NOT NULL,
    bukti_lampiran text NOT NULL,
    user_id integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.laporan_masuk OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 40990)
-- Name: laporan_masuk_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.laporan_masuk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.laporan_masuk_id_seq OWNER TO postgres;

--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 221
-- Name: laporan_masuk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.laporan_masuk_id_seq OWNED BY public.laporan_masuk.id;


--
-- TOC entry 226 (class 1259 OID 41023)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    laporan_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    review_text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41022)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 225
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 224 (class 1259 OID 41007)
-- Name: riwayat_laporan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.riwayat_laporan (
    id integer NOT NULL,
    judul character varying(255) NOT NULL,
    jenis_infrastruktur character varying(100) NOT NULL,
    deskripsi text NOT NULL,
    tanggal_kejadian timestamp without time zone NOT NULL,
    tanggal_selesai timestamp without time zone NOT NULL,
    alamat text NOT NULL,
    status character varying(50) NOT NULL,
    keterangan_laporan text NOT NULL,
    bukti_lampiran text NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT riwayat_laporan_status_check CHECK (((status)::text = ANY ((ARRAY['diterima'::character varying, 'ditolak'::character varying])::text[])))
);


ALTER TABLE public.riwayat_laporan OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41006)
-- Name: riwayat_laporan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.riwayat_laporan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_laporan_id_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 223
-- Name: riwayat_laporan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.riwayat_laporan_id_seq OWNED BY public.riwayat_laporan.id;


--
-- TOC entry 218 (class 1259 OID 40965)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 40964)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4765 (class 2604 OID 40981)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 40994)
-- Name: laporan_masuk id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laporan_masuk ALTER COLUMN id SET DEFAULT nextval('public.laporan_masuk_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 41026)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 41010)
-- Name: riwayat_laporan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat_laporan ALTER COLUMN id SET DEFAULT nextval('public.riwayat_laporan_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 40968)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4943 (class 0 OID 40978)
-- Dependencies: 220
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4945 (class 0 OID 40991)
-- Dependencies: 222
-- Data for Name: laporan_masuk; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.laporan_masuk VALUES (1, 'Jalan Rusak', 'Jalan', '2024-03-14 00:00:00', 'Jalan berlubang', 'Jl. Test', 'foto.jpg', 1, 'pending', '2024-12-14 02:30:34.011716');
INSERT INTO public.laporan_masuk VALUES (2, 'Lampu Mati', 'PJU', '2024-03-14 00:00:00', 'Lampu jalan mati', 'Jl. Test 2', 'foto2.jpg', 1, 'pending', '2024-12-14 02:30:34.011716');


--
-- TOC entry 4949 (class 0 OID 41023)
-- Dependencies: 226
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews VALUES (5, 1, 1, 5, 'Senang laporan saya ditindaklanjuti dengan cepat', '2024-12-14 02:37:33.340374');
INSERT INTO public.reviews VALUES (6, 2, 2, 4, 'Responnya cepat dan bagus', '2024-12-14 02:37:33.340374');


--
-- TOC entry 4947 (class 0 OID 41007)
-- Dependencies: 224
-- Data for Name: riwayat_laporan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.riwayat_laporan VALUES (1, 'Jalan Rusak', 'Jalan', 'Jalan berlubang', '2024-03-10 00:00:00', '2024-03-14 00:00:00', 'Jl. Test 3', 'diterima', 'Sudah diperbaiki', 'foto3.jpg', 1, '2024-12-14 02:30:42.938994');
INSERT INTO public.riwayat_laporan VALUES (2, 'Jalan Besar', 'Jalan', 'Jalan berlubang', '2024-03-10 00:00:00', '2024-03-14 00:00:00', 'Jl. Test 3', 'diterima', 'Sudah diperbaiki', 'foto3.jpg', 1, '2024-12-14 02:35:35.084985');


--
-- TOC entry 4941 (class 0 OID 40965)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Test User', 'test@example.com', '$2b$10$.INN/NI090YMVn.4WJybxuOhY5OBRMu6FAtrd11mYwDmx9FHUp5dy', 'user', '2024-12-13 16:17:54.940978');
INSERT INTO public.users VALUES (2, 'test', 'test@gmail.com', '$2b$10$yZ.b.wAW.TWzg1mcebn6XeGTDLn41SqeAjIM2WKlaA61TBBEJqlP.', 'user', '2024-12-13 16:34:04.057382');
INSERT INTO public.users VALUES (3, 'tenxi', 'tenxi@gmail.com', '$2b$10$aqcm7Wdtv0BcSmxgo7Cqv.n6WSQI0MoUgcelereNNZlzdaPAvpWHu', 'user', '2024-12-13 16:37:26.66889');


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, false);


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 221
-- Name: laporan_masuk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.laporan_masuk_id_seq', 4, true);


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 225
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 6, true);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 223
-- Name: riwayat_laporan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.riwayat_laporan_id_seq', 3, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4782 (class 2606 OID 40989)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 4784 (class 2606 OID 40987)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 41000)
-- Name: laporan_masuk laporan_masuk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laporan_masuk
    ADD CONSTRAINT laporan_masuk_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 41032)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 41016)
-- Name: riwayat_laporan riwayat_laporan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat_laporan
    ADD CONSTRAINT riwayat_laporan_pkey PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 40976)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4780 (class 2606 OID 40974)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 41001)
-- Name: laporan_masuk laporan_masuk_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laporan_masuk
    ADD CONSTRAINT laporan_masuk_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4793 (class 2606 OID 41033)
-- Name: reviews reviews_laporan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_laporan_id_fkey FOREIGN KEY (laporan_id) REFERENCES public.riwayat_laporan(id) ON DELETE CASCADE;


--
-- TOC entry 4794 (class 2606 OID 41038)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4792 (class 2606 OID 41017)
-- Name: riwayat_laporan riwayat_laporan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat_laporan
    ADD CONSTRAINT riwayat_laporan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2024-12-14 04:14:31

--
-- PostgreSQL database dump complete
--

