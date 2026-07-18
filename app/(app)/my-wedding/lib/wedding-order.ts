import { weddingData } from "../data";
import type { Parents, Person } from "../types";
import type { WeddingSide } from "./wedding-date";

interface PortraitData {
  src: string;
  alt: string;
}

export interface OrderedCouple {
  first: Person;
  second: Person;
  firstShortName: string;
  secondShortName: string;
  firstParents: Parents;
  secondParents: Parents;
  firstPortrait: PortraitData;
  secondPortrait: PortraitData;
  combined: string;
}

// The `?at=groom|bride` query param decides whose name and family lead the
// invitation: guests of the bride's family see her side first everywhere.
export function resolveCoupleOrder(side: WeddingSide): OrderedCouple {
  const { couple, parents, portraits } = weddingData;
  const [groomShort = "", brideShort = ""] = couple.combined.split(" & ");

  if (side === "bride") {
    return {
      first: couple.bride,
      second: couple.groom,
      firstShortName: brideShort,
      secondShortName: groomShort,
      firstParents: parents.bride,
      secondParents: parents.groom,
      firstPortrait: portraits.bride,
      secondPortrait: portraits.groom,
      combined: `${brideShort} & ${groomShort}`,
    };
  }

  return {
    first: couple.groom,
    second: couple.bride,
    firstShortName: groomShort,
    secondShortName: brideShort,
    firstParents: parents.groom,
    secondParents: parents.bride,
    firstPortrait: portraits.groom,
    secondPortrait: portraits.bride,
    combined: couple.combined,
  };
}
