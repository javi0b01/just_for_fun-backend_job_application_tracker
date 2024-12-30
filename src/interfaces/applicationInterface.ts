interface IJob {
  source: string;
  uri: string;
}

interface ICompany {
  name: string;
  contact: string;
  url: string;
  email: string;
  phone: string;
}

interface IApp {
  dateApplied: Date;
  response: string;
  position: string;
  model: string;
  notes: string;
}

export interface IApplication {
  userId: string;
  job: IJob;
  company: ICompany;
  application: IApp;
}
