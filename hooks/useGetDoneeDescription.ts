import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import doneeDescriptions from "../content/doneeDescriptions";

export default function useGetDoneeDescription(doneeId: number) {
  const donees = useAppContext() || [];
  const donee = {
    ...donees[doneeId],
    ...doneeDescriptions[doneeId],
  };
  return useMemo(() => 
    donee, [doneeId]
  );
}
