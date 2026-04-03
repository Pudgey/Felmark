"use client";

import type { Block, Workstation, DocumentTemplate } from "@/lib/types";
import Launchpad from "@/components/launchpad/Launchpad";
import SaveTemplateModal from "@/components/workstation/templates/SaveTemplateModal";
import TemplatePicker from "@/components/workstation/templates/TemplatePicker";

export interface ShellModalsProps {
  // Launchpad
  launchpadOpen: boolean;
  workstations: Workstation[];
  onCloseLaunchpad: () => void;
  onLaunchpadNavigate: (screenId: string) => void;
  onLaunchpadSelectWorkstation: (wsId: string) => void;
  onOpenCommandPalette: () => void;
  // SaveTemplateModal
  showSaveTemplate: boolean;
  onCloseSaveTemplate: () => void;
  activeProjectBlocks: Block[];
  onSaveTemplate: (template: DocumentTemplate) => void;
  // TemplatePicker
  showTemplatePicker: boolean;
  onCloseTemplatePicker: () => void;
  docTemplates: DocumentTemplate[];
  onSelectBlank: () => void;
  onSelectTemplate: (blocks: Block[]) => void;
}

export default function ShellModals({
  launchpadOpen,
  workstations,
  onCloseLaunchpad,
  onLaunchpadNavigate,
  onLaunchpadSelectWorkstation,
  onOpenCommandPalette,
  showSaveTemplate,
  onCloseSaveTemplate,
  activeProjectBlocks,
  onSaveTemplate,
  showTemplatePicker,
  onCloseTemplatePicker,
  docTemplates,
  onSelectBlank,
  onSelectTemplate,
}: ShellModalsProps) {
  return (
    <>
      <Launchpad
        open={launchpadOpen}
        onClose={onCloseLaunchpad}
        workstations={workstations}
        onNavigate={onLaunchpadNavigate}
        onSelectWorkstation={onLaunchpadSelectWorkstation}
        onOpenCommandPalette={onOpenCommandPalette}
      />

      <SaveTemplateModal
        open={showSaveTemplate}
        onClose={onCloseSaveTemplate}
        blocks={activeProjectBlocks}
        onSave={onSaveTemplate}
      />

      <TemplatePicker
        open={showTemplatePicker}
        onClose={onCloseTemplatePicker}
        templates={docTemplates}
        onSelectBlank={onSelectBlank}
        onSelectTemplate={onSelectTemplate}
      />
    </>
  );
}
