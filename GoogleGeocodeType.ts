type GeocodeRequestAddress = {
  globalCode?: string;
  compoundCode?: string;
}

export interface GeocoderRequest {
  address?: GeocodeRequestAddress | string;
  key: string;
  language?: "af" |
  "ja" |
  "sq" |
  "kn" |
  "am" |
  "kk" |
  "ar" |
  "km" |
  "hy" |
  "ko" |
  "az" |
  "ky" |
  "eu" |
  "lo" |
  "be" |
  "lv" |
  "bn" |
  "lt" |
  "bs" |
  "mk" |
  "bg" |
  "ms" |
  "my" |
  "ml" |
  "ca" |
  "mr" |
  "zh" |
  "mn" |
  "zhCN" |
  "ne" |
  "zhHK" |
  "no" |
  "zhTW" |
  "pl" |
  "hr" |
  "pt" |
  "cs" |
  "ptBR" |
  "da" |
  "ptPT" |
  "nl" |
  "pa" |
  "en" |
  "ro" |
  "enAU" |
  "ru" |
  "enGB" |
  "sr" |
  "et" |
  "si" |
  "fa" |
  "sk" |
  "fi" |
  "sl" |
  "fil" |
  "es" |
  "fr" |
  "es419" |
  "frCA" |
  "sw" |
  "gl" |
  "sv" |
  "ka" |
  "ta" |
  "de" |
  "te" |
  "el" |
  "th" |
  "gu" |
  "tr" |
  "iw" |
  "uk" |
  "hi" |
  "ur" |
  "hu" |
  "uz" |
  "is" |
  "vi" |
  "id" |
  "zu" |
  "it";

}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

type GeocoderResponseStatus =
  "OK" | "ZERO_RESULTS" | "OVER_DAILY_LIMIT" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "INVALID_REQUEST" | "UNKNOWN_ERROR"

export interface IGeocoderResponseProps {
  address_components?: AddressComponent[];
  formatted_address?: string;
  geometry?: Geometry;
  place_id?: string;
  plus_code?: PlusCode;
  types?: string[];
}

export interface IGeocoderResponse {
  results?: IGeocoderResponseProps[] | any;
  status?: GeocoderResponseStatus;
}