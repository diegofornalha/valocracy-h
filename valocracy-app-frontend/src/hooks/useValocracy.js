import { useContext } from "react";

import ValocracyContext from "../contexts/ValocracyContext";

export const useValocracy = () => useContext(ValocracyContext);
