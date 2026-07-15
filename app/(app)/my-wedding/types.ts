export interface Person {
  name: string;
  role: string; // e.g. "Trưởng Nam"
}

export interface Parents {
  side: string;
  father: string;
  mother: string;
  address: string;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  wide?: boolean;
}

export interface TimelineItem {
  time: string;
  label: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  avatar: string;
  createdAt: string;
}

export interface WeddingData {
  couple: {
    groom: Person;
    bride: Person;
    combined: string;
  };
  parents: {
    groom: Parents;
    bride: Parents;
  };
  cover: {
    date: string;
    invite: string;
  };
  event: {
    datetime: string;
    timeLabel: string;
    dateBlock: {
      weekday: string;
      day: string;
      month: string;
      year: string;
      lunar: string;
    };
    ceremonyVenue: string;
  };
  reception: {
    venueName: string;
    address: string;
    mapQuery: string;
  };
  hero: {
    src: string;
    alt: string;
  };
  portraits: {
    groom: { src: string; alt: string };
    bride: { src: string; alt: string };
  };
  gallery: GalleryPhoto[];
  dressCode: {
    note: string;
    swatches: string[];
  };
  timeline: TimelineItem[];
  wishes: Wish[];
}
