export interface Institute {
  id: string;
  name: string;
  instituteUrl: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  instituteId: string;
}

export interface Photo {
  id: string;
  url: string;
}

export interface Worker {
  id: string;
  fullName: string;
  position: string;
  personalPageUrl: string;
  photo: Photo;
}