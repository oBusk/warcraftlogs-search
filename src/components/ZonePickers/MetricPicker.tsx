"use client";

import { useParsedParams } from "^/lib/useParsedParams";
import DropdownFilter from "../DropdownFilter";

export default function MetricPicker() {
    const { metric, setParams } = useParsedParams();

    return (
        <DropdownFilter
            tooltip="Metric"
            options={[
                {
                    label: "DPS",
                    value: "dps",
                },
                {
                    label: "HPS",
                    value: "hps",
                },
                {
                    label: "CDPS",
                    value: "cdps",
                },
                {
                    label: "NDPS",
                    value: "ndps",
                },
                {
                    label: "RDPS",
                    value: "rdps",
                },
            ]}
            selected={metric ? String(metric) : ""}
            key={metric}
            setSelected={(metric) => setParams({ metric })}
        />
    );
}
