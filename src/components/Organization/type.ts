export interface Organization {
  employee_count: number;
  organization_state: number;
  organization_level: number;
  collapsed: boolean;
  organization_order: number;
  organization_name: string;
  leaf: boolean;
  is_deleted: 'T' | 'F';
  children?: Organization[];
  sao_organization_code: any;
  company_no: number;
  full_path: string;
  organization_no: number;
  organization_parent_no: number;
}

export interface Employee {
  auth_level: string;
  company_no: number;
  employee_contact: any;
  employee_fax: any;
  employee_id_number: any;
  employee_no: number;
  employee_status: number;
  employee_status_kor: string;
  full_path: string;
  is_primary: string;
  join_date: string;
  membership_code: string;
  organization_name: string;
  organization_no: number;
  portal_id: string;
  position_group_no: number;
  position_name: string;
  position_no: number;
  profile_url: any;
  rank_group_no: number;
  rank_name: string;
  rank_no: number;
  rank_order: number | string;
  retire_date: any;
  short_full_path: any;
  task: any;
  user_contact: string;
  user_default_email: string;
  user_email: string;
  user_name: string;
  user_no: number;
}
