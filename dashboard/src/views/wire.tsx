"use client";

import type { Workstation } from "@/lib/types";
import WirePage from "@/components/workstation/wire/WirePage";
import { WIRE_SERVICES } from "@/lib/initial-services";

interface WireViewProps {
  workstations: Workstation[];
}

export default function WireView({ workstations }: WireViewProps) {
  return <WirePage workstations={workstations} services={WIRE_SERVICES} />;
}
