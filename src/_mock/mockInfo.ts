import { faker } from "@faker-js/faker";
import { APIBandNamesType } from "../types";

export const mockBandNames = {
  "0": {
    name: "Jimmy and the Hendricks",
    description: "Cool description",
    nid: "0",
  },
  "1": {
    name: "Contraforce",
    description: "Cool description for Contraforce",
    nid: "1",
  },
  "2": {
    name: "Great Bear",
    description: "Cool description for Great Bear",
    nid: "2",
  },
} as APIBandNamesType;

export const mockCallers = {
  "0": {
    name: faker.name.fullName(),
  },
  "1": {
    name: faker.name.fullName(),
  },
  "2": {
    name: faker.name.fullName(),
  },
  "3": {
    name: faker.name.fullName(),
  },
  "4": {
    name: faker.name.fullName(),
  },
};

export const mockSoundTechs = {
  "0": {
    name: faker.name.fullName(),
  },
  "1": {
    name: faker.name.fullName(),
  },
  "2": {
    name: faker.name.fullName(),
  },
  "3": {
    name: faker.name.fullName(),
  },
  "4": {
    name: faker.name.fullName(),
  },
};

export const mockHosts = {
  "0": {
    name: faker.name.fullName(),
  },
  "1": {
    name: faker.name.fullName(),
  },
  "2": {
    name: faker.name.fullName(),
  },
  "3": {
    name: faker.name.fullName(),
  },
  "4": {
    name: faker.name.fullName(),
  },
};
