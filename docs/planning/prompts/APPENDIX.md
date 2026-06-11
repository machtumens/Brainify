══════════════════════════════════════════════════════════════════════
## APPENDIX — CROSS-PROMPT REFERENCE
══════════════════════════════════════════════════════════════════════

### Memory File Locations
```
MEMORY.md index:   C:\Users\Richard Amadeus\.claude\projects\
                   C--Users-Richard-Amadeus-Documents-Everything-Code-Projects-Quikphic\
                   memory\MEMORY.md

Project context:   same dir\project_secondbrain.md
Skill feedback:    same dir\feedback_proactive_skills.md
```

### Core Document Paths
```
ROADMAP.md:          C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\ROADMAP.md
principles.md:       C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\principles.md
ui-ux-principles.md: C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\ui-ux-principles.md
```

### Universal Skills (Every Prompt)
```
MANDATORY FIRST:    /plan
BEFORE FEATURES:    /tdd
AFTER CODE:         /code-review
BEFORE COMMIT:      /security-review
AFTER UI:           /verify
END OF SESSION:     memory:memory-persist, save-session, checkpoint
AFTER CSS CHANGE:   hooks:post-task (grep checks)
```

### Phase Gate Map
```
Gate 1 → P04 complete (P05 auth is the final criterion)
Gate 2 → P10 complete (Pomodoro + session logging)
Gate 3 → P13 complete (calendar strip = Today View DONE)
Gate 4 → P17 complete (Ask AI = ALL views exist)
Gate 5 → P22 complete (retrospective cron = v1 feature complete)
Gate 6 → P25 complete (production demo = PROJECT CLOSE)
```

### Prompt Dependencies (Do Not Skip)
```
P01 → P02 → P03 → P04 → P05 → P06   (Sprint 1 sequential)
P07, P08, P09, P10                    (Sprint 2 parallel after P05)
P11, P12, P13                         (Sprint 3 parallel after P10)
P14, P15, P16, P17                    (Sprint 4 parallel after P13)
P18, P19, P20, P21, P22               (Sprint 5 parallel after P17)
P23, P24, P25                         (Sprint 6 sequential)
```

### Prompt Archaeology Files Created
```
/docs/prompts/brief-prompt-v1.md       → P07
/docs/prompts/primer-prompt-v1.md      → P11
/docs/prompts/tutor-prompt-v1.md       → P17
/docs/prompts/test-gen-prompt-v1.md    → P19
/docs/prompts/ingest-tag-prompt-v1.md  → P16
/docs/prompts/retro-prompt-v1.md       → P22
```

### Design Token Quick Reference
```css
/* Backgrounds */  --cream:#FAF8F4  --cream2:#F3F0EA  --cream3:#EAE6DD
/* Text */         --ink:#1A1917    --ink2:#4A4845    --ink3:#8A8784   --ink4:#B8B5B0
/* Borders */      --line:#E2DED6   --line2:#CBC7BF
/* Semantic */     --red:#C0392B    --amber:#8B5E00   --green:#2D6A4F
/* Transitions */  --t-fast:80ms    --t-task:150ms    --t-expand:200ms  --t-progress:300ms
/* BANNED */       box-shadow: ANY  |  hardcoded hex in /components  |  height > 1px on bars
```

*build-prompts.md — Second Brain v1.0 Build System*
*25 prompts · 1,250+ skill invocations · Full PMBOK + Apple HIG compliance*
*Source: ROADMAP.md + principles.md + ui-ux-principles.md + SecondBrain_Blueprint_v2.docx*