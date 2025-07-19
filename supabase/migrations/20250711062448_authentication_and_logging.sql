-- Location: supabase/migrations/20250711062448_authentication_and_logging.sql

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'security_analyst', 'analyst', 'member');
CREATE TYPE public.log_type AS ENUM ('login', 'logout', 'failed_login', 'password_reset');
CREATE TYPE public.file_status AS ENUM ('uploading', 'uploaded', 'processing', 'completed', 'error');
CREATE TYPE public.scan_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- 2. User Profiles Table (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    department TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Login Logs Table
CREATE TABLE public.login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    log_type public.log_type NOT NULL,
    ip_address INET,
    user_agent TEXT,
    location TEXT,
    success BOOLEAN DEFAULT true,
    failure_reason TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. File Upload Logs Table
CREATE TABLE public.file_upload_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    upload_status public.file_status DEFAULT 'uploading'::public.file_status,
    file_path TEXT,
    scan_id UUID,
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Scan Results Table
CREATE TABLE public.scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_upload_id UUID REFERENCES public.file_upload_logs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    scan_status public.scan_status DEFAULT 'pending'::public.scan_status,
    vulnerabilities_found INTEGER DEFAULT 0,
    high_risk_count INTEGER DEFAULT 0,
    medium_risk_count INTEGER DEFAULT 0,
    low_risk_count INTEGER DEFAULT 0,
    scan_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX idx_login_logs_created_at ON public.login_logs(created_at);
CREATE INDEX idx_file_upload_logs_user_id ON public.file_upload_logs(user_id);
CREATE INDEX idx_file_upload_logs_created_at ON public.file_upload_logs(created_at);
CREATE INDEX idx_scan_results_user_id ON public.scan_results(user_id);
CREATE INDEX idx_scan_results_created_at ON public.scan_results(created_at);

-- 7. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_upload_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- 8. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT (
    auth.uid() = target_user_id OR 
    public.is_admin()
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.user_profiles
    SET last_login_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

-- Trigger for login tracking
CREATE TRIGGER on_successful_login
    AFTER INSERT ON public.login_logs
    FOR EACH ROW
    WHEN (NEW.success = true AND NEW.log_type = 'login')
    EXECUTE FUNCTION public.update_last_login();

-- 9. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_view_all_profiles" ON public.user_profiles
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "users_own_login_logs" ON public.login_logs
FOR ALL TO authenticated
USING (public.can_access_user_data(user_id))
WITH CHECK (public.can_access_user_data(user_id));

CREATE POLICY "users_own_file_logs" ON public.file_upload_logs
FOR ALL TO authenticated
USING (public.can_access_user_data(user_id))
WITH CHECK (public.can_access_user_data(user_id));

CREATE POLICY "users_own_scan_results" ON public.scan_results
FOR ALL TO authenticated
USING (public.can_access_user_data(user_id))
WITH CHECK (public.can_access_user_data(user_id));

-- 10. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    security_uuid UUID := gen_random_uuid();
    analyst_uuid UUID := gen_random_uuid();
    file_upload_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@patchmate.ai', crypt('Admin@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (security_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'security@patchmate.ai', crypt('Security@456', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Security Analyst", "role": "security_analyst"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (analyst_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'analyst@patchmate.ai', crypt('Analyst@789', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Analyst", "role": "analyst"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);
        (analyst_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'analyst@patchnova.com', crypt('Analyst@0988', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Analyst", "role": "analyst"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Sample login logs    
    INSERT INTO public.login_logs (user_id, log_type, ip_address, user_agent, location, success, session_id)
    VALUES
        (admin_uuid, 'login', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'San Francisco, CA', true, 'sess_admin_001'),
        (security_uuid, 'login', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'New York, NY', true, 'sess_security_001'),
        (analyst_uuid, 'failed_login', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 'Austin, TX', false, null);

    -- Sample file upload logs
    INSERT INTO public.file_upload_logs (id, user_id, file_name, file_size, file_type, upload_status, file_path, processing_time_ms)
    VALUES
        (file_upload_uuid, admin_uuid, 'network_scan_results.xml', 2048576, 'application/xml', 'completed', '/uploads/network_scan_results.xml', 15000),
        (gen_random_uuid(), security_uuid, 'vulnerability_scan.xml', 1024000, 'application/xml', 'processing', '/uploads/vulnerability_scan.xml', null),
        (gen_random_uuid(), analyst_uuid, 'system_audit.xml', 512000, 'application/xml', 'error', '/uploads/system_audit.xml', null);

    -- Sample scan results
    INSERT INTO public.scan_results (file_upload_id, user_id, scan_status, vulnerabilities_found, high_risk_count, medium_risk_count, low_risk_count)
    VALUES
        (file_upload_uuid, admin_uuid, 'completed', 23, 5, 12, 6),
        (file_upload_uuid, security_uuid, 'processing', 0, 0, 0, 0);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 11. Cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@patchmate.ai';

    -- Delete in dependency order (children first)
    DELETE FROM public.scan_results WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.file_upload_logs WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.login_logs WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;