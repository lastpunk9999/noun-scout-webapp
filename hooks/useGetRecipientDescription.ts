import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/state";
import recipientDescriptions from "../content/recipientDescriptions";
import buildRecipientDescription from "./buildRecipientDescription";
import { Recipient } from "../types";

export default function useGetRecipientDescription(
  recipientId: number
): Recipient {
  const recipients =
    useAppContext()?.recipients ?? Object.values(recipientDescriptions);
  return buildRecipientDescription(recipients[recipientId], recipientId);
}
