import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import doneeDescriptions from "../content/doneeDescriptions";
import buildDoneeDescription from "./buildDoneeDescription";
import { Donee } from "../types";

export default function useGetDoneeDescription(doneeId: number): Donee {
  const donees = useAppContext()?.donees ?? Object.values(doneeDescriptions);
  return buildDoneeDescription(donees[doneeId], doneeId);
}