export interface Artist {
  external_urls: {
    spotify: "string";
  };
  followers: {
    href: "string";
    total: number;
  };
  genres: ["Prog rock", "Grunge"];
  href: "string";
  id: "string";
  images: [
    {
      url: string;
      height: number;
      width: number;
    }
  ];
  name: "string";
  popularity: number;
  type: "artist";
  uri: "string";
}

