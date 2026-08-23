import { Head, Html, Main, NextScript } from "next/document";

const contract = `THESIS: Bork is the familiar social feed finished with dog-first personality; it refuses novelty controls and themed chrome. OWN-WORLD: continuous midnight navy, tonal charcoal surfaces, cool hairlines, one clear blue action, warm circular portraits, compact rounded controls. STORY: visitors recognize a working full-stack app, read public borks, then sign in to post or inspect profiles and project proof. FIRST VIEWPORT: a compact 18% navigation rail, broad 55% feed with integrated composer, and concise 22% Built by Colton rail; BORK is the only saturated action. FORM: polished social feed, standing category exit, seed b017ac58. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance`;

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{ __html: `document.currentScript.before(document.createComment(${JSON.stringify(contract)}))` }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
