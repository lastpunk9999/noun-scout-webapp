import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import recipientDescriptions from "../content/recipientDescriptions";
import useGetRecipientDescription from "./useGetRecipientDescription";
import buildRecipientDescription from "./buildRecipientDescription";

import { Recipient } from "../types";
export default function useGetRecipientsDescription(
  onlyActive = true
): Recipient[] {
  const recipients =
    useAppContext()?.recipients ?? Object.values(recipientDescriptions);
  return recipients
    .map(buildRecipientDescription)
    .filter((donee) => !onlyActive || donee.active);
}
