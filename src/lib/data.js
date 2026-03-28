import { supabase } from './supabase'

// Fetch all weight entries, newest first
export async function fetchEntries() {
  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

// Add a single weight entry
export async function addEntry({ date, weight_lbs, note }) {
  const { data, error } = await supabase
    .from('weight_entries')
    .upsert({ date, weight_lbs, note }, { onConflict: 'date' })
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete a weight entry by id
export async function deleteEntry(id) {
  const { error } = await supabase
    .from('weight_entries')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Bulk insert historical entries (used for import)
export async function bulkInsertEntries(entries) {
  const { data, error } = await supabase
    .from('weight_entries')
    .upsert(entries, { onConflict: 'date' })
    .select()

  if (error) throw error
  return data
}
