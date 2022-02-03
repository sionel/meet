export interface userInfo {
  address_list: any[];
  birth_date: string;
  birth_type: number;
  contact_list: any[];
  email_list: any[];
  employee_list: any[];
  last_access_company_no: number;
  member_type: number;
  portal_id: string;
  profile_url: string | null;
  skill: string | null;
  user_address1: string | null;
  user_address2: string | null;
  user_contact: string;
  user_default_email: string;
  user_email: string;
  user_name: string;
  user_no: number;
  user_state: number;
  user_zipcode: string | null;
  nickname?: string;
}

export interface apiAuthInfo {
  // login api data
  AUTH_A_TOKEN: string;
  AUTH_R_TOKEN: string;
  HASH_KEY: string;
  cno: number;
  // check api data
  user_no: number;
  portal_id: string;
  user_name: string;
  user_default_email: string;
  user_email: string;
  profile_url: string | null;
  user_contact: string;
  employee_list: any[]; // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
  last_access_company_no: any;
  last_company: any;
  member_type: number; // 0: 일반회원; 1: 개인회원
  nickname: string | null;
  membership_code: string;
}



export interface companyInfo {
  company_code: number;
  company_name_kr: string;
  company_no: number;
  company_reg_no: string;
  company_state: number;
  email_list: any[];
  employee_address1: any;
  employee_address2: any;
  employee_contact: string;
  employee_fax: string;
  employee_id_number: string;
  employee_no: number;
  employee_status: number;
  employee_zipcode: any;
  full_path: string;
  is_nahago_admin: string;
  join_date: string;
  membership_code: string;
  membership_name: string;
  nahago_status: any;
  organization_no: number;
  position_name: string;
  rank_name: string;
  step: number;
  sub_full_path_list: any[];
  task: string;
}

export interface errorType {
    code: string;
    message: string;
    status?: string;
}

