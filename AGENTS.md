# Contributor and agent guidance

- Read README.md. There are two interfaces, one Python server, and one script: `stage/show.json`.
- Use `ScriptStore` in `stage/script_store.py` for script mutations. Require the loaded revision, preserve cue IDs and projection metadata, and keep atomic saves, conflict detection, undo, and recovery snapshots.
- Never reconstruct the current play from historical Markdown, YAML, exports, or audio transcripts. Those are not authoring sources.
- Changed text or speaker invalidates audio. Register real generated recordings through `ScriptStore.register_audio`; never relabel an old recording as new dialogue.
- Preserve local edits, media, voice references, and ignored recovery data. Do not commit or push without the user's authorization. Do not add automatic Git actions.
- No credentials, machine-specific paths, or private host addresses in code. Configure optional generation through environment variables.
- Keep editing and presenting usable offline with Python's standard library. Avoid new services, build steps, dependencies, or overlapping editors.
- Run the checks in README.md after code changes. Test saves with temporary copies, never destructive edits to the user's script.
- Presenter UI changes follow `stage/BRAND.md`.

## Writing

Adapted from [Humanizer](https://github.com/blader/humanizer):

- Keep dialogue specific, uneven, and human. Characters need not resolve their arguments or announce the theme.
- Narrator passages are spoken text. Keep them clear when read aloud.
- Avoid inflated significance, promotional language, generic conclusions, and abstract metaphors that replace concrete action.
- Cut padding, repetitive lists of three, manufactured punchlines, “not just X but Y” formulas, and trailing explanations such as “highlighting the tension.”
- Avoid clusters of words such as pivotal, delve, showcase, tapestry, foster, and underscore.
- Preserve mundane details, mixed feelings, and deliberate delivery punctuation. Em dashes are allowed; match the existing voice.
- Read changes aloud. Ask what sounds generated and what claims something the story has not established.
