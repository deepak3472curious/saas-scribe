export interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecryptedNote extends Note {
  encryption_iv?: string;
}