export interface Member {
  id: number;
  member_number: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  school?: string;
  profession?: string;
  city?: string;
  filiere?: string;
  photo_url?: string;
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
  profession?: string;
  city?: string;
  filiere?: string;
  status: string;
  photo_url?: string;
}
