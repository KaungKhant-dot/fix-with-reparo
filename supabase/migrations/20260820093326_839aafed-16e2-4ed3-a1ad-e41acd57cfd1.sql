GRANT SELECT ON public.categories TO anon; GRANT SELECT ON public.categories TO authenticated; GRANT ALL ON public.categories TO service_role;
GRANT SELECT ON public.repair_shops TO anon; GRANT SELECT ON public.repair_shops TO authenticated; GRANT ALL ON public.repair_shops TO service_role;
GRANT SELECT ON public.services TO anon; GRANT SELECT ON public.services TO authenticated; GRANT ALL ON public.services TO service_role;
GRANT SELECT ON public.notifications TO anon; GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated; GRANT ALL ON public.notifications TO service_role;
GRANT SELECT, INSERT ON public.repair_requests TO anon; GRANT SELECT, INSERT, UPDATE, DELETE ON public.repair_requests TO authenticated; GRANT ALL ON public.repair_requests TO service_role;