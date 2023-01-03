import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import doneeDescriptions from "../content/doneeDescriptions";
import useGetDoneeDescription from "./useGetDoneeDescription";
import buildDoneeDescription from "./buildDoneeDescription";

import { Donee } from "../types";
export default function useGetDoneesDescription(onlyActive = true): Donee[] {
  const donees = useAppContext()?.donees ?? Object.values(doneeDescriptions);
  return donees
    .map(buildDoneeDescription)
    .filter((donee) => !onlyActive || donee.active);
}
