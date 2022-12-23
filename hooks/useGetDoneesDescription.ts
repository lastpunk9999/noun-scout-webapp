import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import doneeDescriptions from "../content/doneeDescriptions";
import useGetDoneeDescription from "./useGetDoneeDescription";
import buildDoneeDescription from "./buildDoneeDescription";

import { Donee } from "../types";
export default function useGetDoneesDescription(): Donee[] {
  const donees = useAppContext()?.donees ?? Object.values(doneeDescriptions);
  return donees
    .map(buildDoneeDescription)
    .filter((org) => org.active !== false);
}
