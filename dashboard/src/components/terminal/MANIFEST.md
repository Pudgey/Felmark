# Terminal -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `Terminal` -- Interactive command terminal with natural language and command parsing
- `TerminalProvider` -- Context provider managing terminal state, command execution, and ambient insights
- `useTerminalContext` -- Hook to access terminal context
- `AIThink` -- AI thinking animation components (ThinkingDots, StreamText, ThinkPhases, WaveformPulse, ScanLine)

## Dependencies
- `@/lib/terminal/commands` -- COMMAND_REGISTRY
- `@/lib/terminal/types` -- TerminalBlock, NLResponseData, TerminalContextType, CommandHandlerContext, AmbientInsight
- `@/lib/terminal/parser` -- parseCommand
- `@/lib/terminal/watcher` -- extractDocumentContext, hashContext
- `@/lib/wire-context` -- buildWireContext
- `@/lib/types` -- Workspace, Project

## Imported By
- `Editor.tsx` -- Terminal and TerminalProvider rendered in split pane
- `editor/ai/AiBlock.tsx` -- AIThink animations imported

## Files
- `Terminal.tsx` -- main terminal component (575 lines)
- `Terminal.module.css` -- terminal styles
- `TerminalProvider.tsx` -- context provider (353 lines)
- `AIThink.tsx` -- thinking animations (287 lines)
- `AIThink.module.css` -- animation styles
