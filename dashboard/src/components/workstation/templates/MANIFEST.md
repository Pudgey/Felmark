# Templates -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `TemplatesPage` -- Full-page template gallery with categories and preview
- `TemplatePicker` -- Inline template selector for document creation
- `SaveTemplateModal` -- Modal to save current document as a template

## Dependencies
- `@/lib/types` -- DocumentTemplate, Block, TemplateCategory, TemplateBlock
- `@/lib/utils` -- uid

## Imported By
- `Editor.tsx` -- TemplatesPage rendered when templates view is active
- `page.tsx` -- SaveTemplateModal rendered for save-as-template action
- `page.tsx` -- TemplatePicker (available for new document flow)

## Files
- `TemplatesPage.tsx` -- template gallery (194 lines)
- `TemplatesPage.module.css` -- gallery styles
- `TemplatePicker.tsx` -- inline picker (162 lines)
- `TemplatePicker.module.css` -- picker styles
- `SaveTemplateModal.tsx` -- save modal (145 lines)
- `SaveTemplateModal.module.css` -- modal styles
