This is a artifact of trying to figure out how to search for talents. Each talent has at least 4 different IDs, and I'm trying to figure out how to map between them.

| Tactician                          |     `90282`      |  `112134`  |                 `184783`                 |          `117139`           |
| ---------------------------------- | :--------------: | :--------: | :--------------------------------------: | :-------------------------: |
| Addon (Talent Tweaks)              |    _Node ID_     | _Entry ID_ |                _Spell ID_                |       _Definition ID_       |
| **Warcraftlogs Characterrankings** |                  | `talentId` |                   `id`                   |                             |
| Bnet Wow Talent Index              |                  |            |                                          |            `id`             |
| Bnet Wow Talent                    |                  |            |                `spell.id`                |            `id`             |
| Bnet Wow Talenttree                |       `id`       |            | `ranks[].tooltip.spell_tooltip.spell.id` | `ranks[].tooltip.talent.id` |
| Wowhead trees                      | `talents[].node` |            |        `talents[].spells[].spell`        |                             |
