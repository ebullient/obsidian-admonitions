# Icon Attribute Behavior

This page centralizes icon behavior for code block admonitions and native callouts.

## Setup

1. Open Admonition settings.
2. Create a custom admonition type named `image-png`.
3. Set its icon to `assets/red-square-16.png` and save.
4. Create a second custom admonition type named `icon-css`.
5. Enable `Style This Admonition with CSS` for `icon-css` and save.
6. Enable the snippet `.obsidian/snippets/ad-test-vault-icon-css.css`:
   1. `Settings` -> `Appearance` -> `CSS snippets`
   2. Turn on `ad-test-vault-icon-css`

## 1) `icon:` in code block admonitions

The `icon:` header attribute applies to `ad-*` code blocks.

```ad-note
title: Code block icon override
icon: bug
This code block uses the `icon:` parameter.
```

## 2) Uploaded image icon behavior

With the custom `image-png` type above:

```ad-image-png
title: Code block with uploaded image icon
The red square icon from settings should render here.
```

> [!image-png] Limitation: Native callouts do not use the `icon` attribute
> Native callouts do not use the code-block `icon:` attribute.
> With an uploaded bitmap icon, the title may render without an image icon.

## 3) CSS icon for both callout and codeblock

With type `icon-css`, the snippet sets an SVG `--callout-icon` value (per Obsidian callout customization docs):

```css
.callout[data-callout="icon-css"] {
    --callout-icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="currentColor"/></svg>';
}
```

Ready-to-use snippet for this vault: `.obsidian/snippets/ad-test-vault-icon-css.css`

```ad-icon-css
title: Code block using CSS-managed icon
This should render with the snippet-provided icon.
```

> [!icon-css] Native callout using CSS-managed icon
> This should render with the same snippet-provided icon.

This applies to both:
- `> [!icon-css]` native callouts
- `` ```ad-icon-css `` code block admonitions
