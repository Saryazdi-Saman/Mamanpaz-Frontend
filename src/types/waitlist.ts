export type WaitlistFormData = {
  name: string;
  zip: string;
  phone: string;
};

export type ActionResponse = {
  inputs?: {
    [k in keyof WaitlistFormData]?: string;
  };
  success: boolean;
  message: string;
  errors?: {
    [k in keyof WaitlistFormData]?: string[];
  };
};
