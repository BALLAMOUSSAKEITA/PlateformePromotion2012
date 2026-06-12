export interface Member {
  id: number;
  member_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  contact_email?: string;
  school?: string;
  option?: string;
  profession?: string;
  current_activity?: string;
  country?: string;
  city?: string;
  photo_url?: string;
  cv_url?: string;
  status: "actif" | "inactif" | "en_attente";
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  member: Member;
}

export interface VerifyMemberOut {
  member_number: string;
  first_name: string;
  last_name: string;
  school?: string;
  option?: string;
  profession?: string;
  current_activity?: string;
  country?: string;
  city?: string;
  status: string;
  photo_url?: string;
}
