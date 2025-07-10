import { createSupabaseServerClient } from '@/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createSupabaseServerClient();
  const { data: instruments } = await supabase.from("total_instruments").select('count');

  console.log(instruments)

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}