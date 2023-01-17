export type PeopleAndBandsAPIType = {
  bandOptions: APIBandNamesType;
  soundTechOptions: APISoundTechNamesType;
  callerOptions: APICallerNamesType;
  hostOptions: APIHostNamesType;
};

export type APIBandNamesType = {
  [x: string]: BandNamesType;
};

export type APICallerNamesType = {
  [x: string]: CallerNamesType;
};

export type APISoundTechNamesType = {
  [x: string]: SoundTechNamesType;
};

export type APIHostNamesType = {
  [x: string]: HostNamesType;
};

export type BandNamesType = {
  inputValue?: string;
  nid: string | number;
  name: string;
  description?: string;
};

export type CallerNamesType = {
  inputValue?: string;
  nid: string | number;
  name: string;
};

export type SoundTechNamesType = {
  inputValue?: string;
  nid: string | number;
  name: string;
};

export type HostNamesType = {
  inputValue?: string;
  nid: string | number;
  name: string;
};

export type EventType = {
  band: BandNamesType | string;
  bandPay: string;
  bandTravel: string;
  caller: CallerNamesType | string;
  callerPay: string;
  callerTravel: string;
  eventDescription: string;
  eventTitle: string | undefined;
  eventStartTime: Date | string;
  eventEndTime: Date | string;
  host: HostNamesType | string;
  soundTech: SoundTechNamesType | string;
};
