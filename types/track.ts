export interface Track {
  href: string;
  limit: number;
  next: string;
  cursors: {
    after: string;
    before: string;
  };
  total: number;
  items: {
    track: {
      album: {
        album_type: string;
        total_tracks: number;
        available_markets: string[];
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        images: {
          url: string;
          height: number;
          width: number;
        }[];
        name: string;
        release_date: string;
        release_date_precision: string;
        restrictions?: {
          reason: string;
        };
        type: string;
        uri: string;
        artists: {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }[];
      };
      artists: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_ids: {
        isrc: string;
        ean: string;
        upc: string;
      };
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      is_playable: boolean;
      linked_from?: {};
      restrictions?: {
        reason: string;
      };
      name: string;
      popularity: number;
      preview_url: string;
      track_number: number;
      type: string;
      uri: string;
      is_local: boolean;
    };
    played_at: string;
    context: {
      type: string;
      href: string;
      external_urls: {
        spotify: string;
      };
      uri: string;
    };
  }[];
}

export interface Tracks {
  tracks: [
    {
      album: {
        album_type: "compilation";
        total_tracks: 9;
        available_markets: ["CA", "BR", "IT"];
        external_urls: {
          spotify: "string";
        };
        href: "string";
        id: "2up3OPMp9Tb4dAKM2erWXQ";
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228";
            height: 300;
            width: 300;
          }
        ];
        name: "string";
        release_date: "1981-12";
        release_date_precision: "year";
        restrictions: {
          reason: "market";
        };
        type: "album";
        uri: "spotify:album:2up3OPMp9Tb4dAKM2erWXQ";
        artists: [
          {
            external_urls: {
              spotify: "string";
            };
            href: "string";
            id: "string";
            name: "string";
            type: "artist";
            uri: "string";
          }
        ];
      };
      artists: [
        {
          external_urls: {
            spotify: "string";
          };
          href: "string";
          id: "string";
          name: "string";
          type: "artist";
          uri: "string";
        }
      ];
      available_markets: ["string"];
      disc_number: 0;
      duration_ms: 0;
      explicit: false;
      external_ids: {
        isrc: "string";
        ean: "string";
        upc: "string";
      };
      external_urls: {
        spotify: "string";
      };
      href: "string";
      id: "string";
      is_playable: false;
      linked_from: {};
      restrictions: {
        reason: "string";
      };
      name: "string";
      popularity: 0;
      preview_url: "string";
      track_number: 0;
      type: "track";
      uri: "string";
      is_local: false;
    }
  ];
}
