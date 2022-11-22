import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import doneeDescriptions from "../content/doneeDescriptions";

export default function useGetDoneeDescription(doneeId: number) {
  const donees = useAppContext();
  console.log("donees from context", donees);

  const donee = {
    ...donees[doneeId],
    ...doneeDescriptions[doneeId],
  };
  return useMemo(() => 
    donee, [doneeId]
  );
}
